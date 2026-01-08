import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, ShoppingCart, ArrowLeft, Check, Truck, Shield } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ProductDetail({ productId }: { productId: number }) {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [quantity, setQuantity] = useState(1);

  const { data: product } = trpc.products.getById.useQuery({ id: productId });
  const { data: relatedProducts = [] } = trpc.products.list.useQuery();

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
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

  const handleAddToCart = () => {
    // Implementar lógica de adicionar ao carrinho
    alert(`${quantity} unidade(s) de ${product.name} adicionada(s) ao carrinho!`);
  };

  const discountPercent = product.originalPrice
    ? Math.round(
        ((Number(product.originalPrice) - Number(product.price)) /
          Number(product.originalPrice)) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border py-4 sticky top-0 z-40">
        <div className="container flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-primary">Tech Gadgets</h1>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Imagem do Produto */}
          <div className="flex flex-col gap-4">
            <div className="relative h-96 lg:h-full bg-muted rounded-lg overflow-hidden">
              <img
                src={product.imageUrl || "/images/accessories-flat-lay.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <span className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold">
                  Destaque
                </span>
              )}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(Number(product.rating || 0))
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviews} avaliações)
                </span>
              </div>
            </div>

            {/* Preço */}
            <div className="space-y-3 p-6 bg-card border border-border rounded-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-bold text-primary">
                  R$ {Number(product.price).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-muted-foreground line-through">
                    R$ {Number(product.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
              {discountPercent > 0 && (
                <div className="text-lg font-bold text-green-600">
                  Economize {discountPercent}%
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                {product.stock > 0 ? (
                  <span className="text-green-600 font-semibold">
                    ✓ Em estoque ({product.stock} disponível)
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Fora de estoque</span>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Descrição</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Características */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Características</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Produto de alta qualidade</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Garantia de 2 anos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Entrega rápida e segura</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">Suporte ao cliente 24/7</span>
                </div>
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-card border border-border rounded-lg">
                <Truck className="w-6 h-6 text-primary mb-2" />
                <p className="font-semibold text-sm text-foreground">Entrega Rápida</p>
                <p className="text-xs text-muted-foreground">Até 7 dias úteis</p>
              </div>
              <div className="p-4 bg-card border border-border rounded-lg">
                <Shield className="w-6 h-6 text-primary mb-2" />
                <p className="font-semibold text-sm text-foreground">Garantia</p>
                <p className="text-xs text-muted-foreground">2 anos completos</p>
              </div>
            </div>

            {/* Quantidade e Botão */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Quantidade:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    −
                  </Button>
                  <span className="px-6 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </div>

        {/* Produtos Relacionados */}
        <div className="border-t border-border pt-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Produtos Relacionados</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedProducts
              .filter((p) => p.id !== productId && p.category === product.category)
              .slice(0, 3)
              .map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="overflow-hidden hover:shadow-xl transition cursor-pointer border border-border"
                  onClick={() => setLocation(`/product/${relatedProduct.id}`)}
                >
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={relatedProduct.imageUrl || "/images/accessories-flat-lay.jpg"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-xl font-bold text-primary">
                        R$ {Number(relatedProduct.price).toFixed(2)}
                      </span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {Number(relatedProduct.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Adicionar ao carrinho
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
