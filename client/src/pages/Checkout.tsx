import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [cart, setCart] = useState<Array<{ id: number; quantity: number }>>([]);
  const [formData, setFormData] = useState({
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const { data: products = [] } = trpc.products.list.useQuery();
  const { data: addresses = [] } = trpc.addresses.list.useQuery();
  const createOrderMutation = trpc.orders.create.useMutation();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Acesso Necessário</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar logado para fazer o checkout.
          </p>
          <Button
            onClick={() => setLocation("/")}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Voltar para Home
          </Button>
        </Card>
      </div>
    );
  }

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (Number(product?.price) || 0) * item.quantity;
  }, 0);

  const shippingCost = cartTotal > 200 ? 0 : 20;
  const tax = cartTotal * 0.1;
  const total = cartTotal + shippingCost + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Carrinho vazio!");
      return;
    }

    setIsLoading(true);
    try {
      // Aqui você criaria o endereço e depois o pedido
      // Por enquanto, vamos apenas simular
      alert("Checkout será implementado com Stripe em breve!");
      setLocation("/");
    } catch (error) {
      alert("Erro ao processar pedido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border py-4">
        <div className="container flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="text-xl font-bold mb-6">Endereço de Entrega</h2>
              
              {addresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Endereços Salvos</h3>
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <label key={addr.id} className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/5">
                        <input type="radio" name="address" className="mr-3" />
                        <div>
                          <p className="font-medium">
                            {addr.street}, {addr.number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {addr.city}, {addr.state} - {addr.zipCode}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <hr className="my-6" />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rua</label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Número</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Complemento (opcional)</label>
                  <input
                    type="text"
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Apto, sala, etc."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cidade</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Estado</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      maxLength={2}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CEP</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="00000-000"
                      required
                    />
                  </div>
                </div>

                <h2 className="text-xl font-bold mt-8 mb-6">Método de Pagamento</h2>
                <div className="p-4 border border-border rounded-lg bg-accent/5">
                  <p className="text-muted-foreground">
                    Integração com Stripe será implementada em breve. Por enquanto, o checkout é apenas demonstrativo.
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 mt-8"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    "Finalizar Pedido"
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div>
            <Card className="p-6 sticky top-20">
              <h3 className="text-lg font-bold mb-6">Resumo do Pedido</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">R$ {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      `R$ ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Impostos</span>
                  <span className="font-medium">R$ {tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  ✓ Entrega em até 7 dias úteis
                </p>
                <p className="text-sm text-muted-foreground">
                  ✓ Garantia de 2 anos
                </p>
                <p className="text-sm text-muted-foreground">
                  ✓ Suporte 24 horas
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
