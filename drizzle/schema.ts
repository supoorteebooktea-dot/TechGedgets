import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Produtos
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2, mode: "string" }).notNull(),
  originalPrice: decimal("originalPrice", { precision: 10, scale: 2, mode: "string" }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  category: varchar("category", { length: 100 }),
  stock: int("stock").default(0).notNull(),
  rating: decimal("rating", { precision: 3, scale: 1, mode: "string" }).default("0"),
  reviews: int("reviews").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// Endereços de entrega
export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  street: varchar("street", { length: 255 }).notNull(),
  number: varchar("number", { length: 20 }).notNull(),
  complement: varchar("complement", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 2 }).notNull(),
  zipCode: varchar("zipCode", { length: 10 }).notNull(),
  isDefault: boolean("isDefault").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Address = typeof addresses.$inferSelect;
export type InsertAddress = typeof addresses.$inferInsert;

// Pedidos
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  status: mysqlEnum("status", [
    "pendente_pagamento",
    "pagamento_confirmado",
    "processando",
    "enviado",
    "entregue",
    "cancelado"
  ]).default("pendente_pagamento").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2, mode: "string" }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2, mode: "string" }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2, mode: "string" }).default("0"),
  total: decimal("total", { precision: 10, scale: 2, mode: "string" }).notNull(),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  trackingCode: varchar("trackingCode", { length: 100 }),
  addressId: int("addressId"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Itens do pedido
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  quantity: int("quantity").notNull(),
  unitPrice: decimal("unitPrice", { precision: 10, scale: 2, mode: "string" }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2, mode: "string" }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

// Histórico de pedidos
export const orderHistory = mysqlTable("orderHistory", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  previousStatus: varchar("previousStatus", { length: 50 }),
  newStatus: varchar("newStatus", { length: 50 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OrderHistoryRecord = typeof orderHistory.$inferSelect;
export type InsertOrderHistoryRecord = typeof orderHistory.$inferInsert;
