/**
 * Stripe Products Configuration
 * This file defines the products and prices available in the store
 */

export const stripeProducts = {
  // Exemplo de produto - será substituído pelos produtos do banco de dados
  techGadgets: {
    name: "Tech Gadgets",
    description: "Premium technology products",
  },
};

/**
 * Helper function to create line items from cart items
 * Receives product data from database and converts to Stripe line items
 */
export function createLineItems(
  cartItems: Array<{ productId: number; quantity: number; unitPrice: string }>,
  products: Array<{ id: number; name: string; price: string }>
) {
  return cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    return {
      price_data: {
        currency: "brl",
        product_data: {
          name: product.name,
          metadata: {
            productId: item.productId.toString(),
          },
        },
        unit_amount: Math.round(Number(product.price) * 100), // Convert to cents
      },
      quantity: item.quantity,
    };
  });
}
