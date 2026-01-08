import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import Stripe from "stripe";
import type { Stripe as StripeType } from "stripe";
import { createLineItems } from "./stripe-products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Produtos
  products: router({
    list: publicProcedure.query(async () => {
      return db.getAllProducts();
    }),
    
    featured: publicProcedure.query(async () => {
      return db.getFeaturedProducts();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getProductById(input.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string(),
        originalPrice: z.string().optional(),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
        stock: z.number().default(0),
        featured: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error("Unauthorized");
        }
        return db.createProduct(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        originalPrice: z.string().optional(),
        imageUrl: z.string().optional(),
        category: z.string().optional(),
        stock: z.number().optional(),
        featured: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error("Unauthorized");
        }
        const { id, ...data } = input;
        return db.updateProduct(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error("Unauthorized");
        }
        return db.deleteProduct(input.id);
      }),
  }),

  // Pedidos
  orders: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserOrders(ctx.user.id);
    }),
    
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.id);
        if (!order || order.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }
        return order;
      }),
    
    create: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          unitPrice: z.string(),
        })),
        addressId: z.number(),
        subtotal: z.string(),
        shippingCost: z.string(),
        tax: z.string(),
        total: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await db.createOrder({
          userId: ctx.user.id,
          addressId: input.addressId,
          subtotal: input.subtotal,
          shippingCost: input.shippingCost,
          tax: input.tax,
          total: input.total,
          status: "pendente_pagamento",
        });
        
        // Criar itens do pedido
        const orderId = (result as any).insertId || 1;
        for (const item of input.items) {
          await db.createOrderItem({
            orderId: orderId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: String(Number(item.unitPrice) * item.quantity),
          });
        }
        
        return result;
      }),
    
    createCheckoutSession: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
          unitPrice: z.string(),
        })),
        addressId: z.number(),
        subtotal: z.string(),
        shippingCost: z.string(),
        tax: z.string(),
        total: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        try {
          // Buscar produtos para criar line items
          const products = await db.getAllProducts();
          const lineItems = createLineItems(input.items, products);

          // Criar sessão de checkout
          const session = await stripe.checkout.sessions.create({
            customer_email: ctx.user.email || undefined,
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${ctx.req.headers.origin}/orders?success=true`,
            cancel_url: `${ctx.req.headers.origin}/checkout?canceled=true`,
            client_reference_id: ctx.user.id.toString(),
            metadata: {
              user_id: ctx.user.id.toString(),
              customer_email: ctx.user.email || "unknown",
              customer_name: ctx.user.name || "Customer",
              address_id: input.addressId.toString(),
              subtotal: input.subtotal,
              shipping_cost: input.shippingCost,
              tax: input.tax,
              total: input.total,
            },
            allow_promotion_codes: true,
          });

          return {
            sessionId: session.id,
            url: session.url,
          };
        } catch (error) {
          console.error("Stripe checkout error:", error);
          throw new Error("Failed to create checkout session");
        }
      }),
    
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pendente_pagamento", "pagamento_confirmado", "processando", "enviado", "entregue", "cancelado"]),
      }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== 'admin') {
          throw new Error("Unauthorized");
        }
        
        const order = await db.getOrderById(input.id);
        if (!order) throw new Error("Order not found");
        
        await db.createOrderHistory({
          orderId: input.id,
          previousStatus: order.status,
          newStatus: input.status,
        });
        
        return db.updateOrderStatus(input.id, input.status);
      }),
  }),

  // Admin
  admin: router({
    orders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user?.role !== 'admin') {
        throw new Error("Unauthorized");
      }
      return db.getAllOrders();
    }),
  }),

  // Endereços
  addresses: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserAddresses(ctx.user.id);
    }),
    
    create: protectedProcedure
      .input(z.object({
        street: z.string(),
        number: z.string(),
        complement: z.string().optional(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        isDefault: z.boolean().default(false),
      }))
      .mutation(async ({ input, ctx }) => {
        return db.createAddress({
          userId: ctx.user.id,
          ...input,
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
