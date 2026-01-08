import { Request, Response } from "express";
import Stripe from "stripe";
import * as db from "./db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log("Checkout session completed:", {
          sessionId: session.id,
          clientReferenceId: session.client_reference_id,
          metadata: session.metadata,
        });

        // Extract metadata
        const userId = parseInt(session.metadata?.user_id || "0");
        const addressId = parseInt(session.metadata?.address_id || "0");
        const total = session.metadata?.total || "0";

        if (userId && addressId) {
          // Update order status to pagamento_confirmado
          // In a real scenario, you would fetch the order by session ID
          // For now, we'll just log it
          console.log(`Payment confirmed for user ${userId}, order total: ${total}`);
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment intent succeeded:", {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          metadata: paymentIntent.metadata,
        });
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error("Payment intent failed:", {
          id: paymentIntent.id,
          lastPaymentError: paymentIntent.last_payment_error,
        });
        break;
      }

      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        console.log("Customer created:", {
          id: customer.id,
          email: customer.email,
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
