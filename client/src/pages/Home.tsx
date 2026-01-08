import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star, Zap, Truck, Shield, ArrowRight, Check, ShoppingCart, User, LogOut, Search } from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

/**
 * Design Philosophy: Premium Tech Store E-Commerce
 * - Sophisticated typography with Playfair Display for headlines
 * - Deep indigo/purple color palette suggesting technology & innovation
 * - Minimalist layout with strategic whitespace
 * - High-quality product imagery as focal points
 * - Smooth animations and micro-interactions
 * - Full e-commerce functionality with auth
 * - Enhanced UX with loading states, transitions, and visual feedback
 * - Responsive design with mobile-first approach
 * - Accessibility-first component design
 */

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [cart, setCart] = useState<Array<{ id: number; quantity: number }>>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Buscar produtos do banco de dados
  const { data: products = [] } = trpc.products.list.useQuery();
  const { data: featuredProducts = [] } = trpc.products.featured.useQuery();

  const benefits = [
    {
      icon: Zap,
      title: "Entrega Rápida",
      description: "Receba em até 7 dias úteis"
    },
    {
      icon: Shield,
      title: "Garantia Completa",
      description: "2 anos de cobertura total"
    },
    {
      icon: Truck,
      title: "Frete Grátis",
      description: "Acima de R$ 200"
    }
  ];

  const addToCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (Number(product?.price) || 0) * item.quantity;
  }, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setLocation("/checkout");
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">
            Tech Gadgets
          </div>
          <div className="hidden md:flex gap-8 flex-1 mx-8">
            <a href="#products" className="text-sm font-medium hover:text-primary transition">Produtos</a>
            <a href="#benefits" className="text-sm font-medium hover:text-primary transition">Benefícios</a>
            <a href="#reviews" className="text-sm font-medium hover:text-primary transition">Avaliações</a>
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(!showCart)}
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </div>
            {isAuthenticated ? (
              <div className="flex gap-2 items-center">
                <span className="text-sm text-muted-foreground hidden sm:inline">{user?.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = getLoginUrl()}
              >
                <User className="w-4 h-4 mr-1" />
                Entrar
              </Button>
            )}
          </div>
        </div>

        {/* Cart Dropdown */}
        {showCart && (
          <div className="border-t border-border bg-card p-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="container max-h-64 overflow-y-auto">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Carrinho vazio</p>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => {
                    const product = products.find(p => p.id === item.id);
                    return (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{product?.name}</p>
                          <p className="text-muted-foreground">Qtd: {item.quantity}</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <p className="font-semibold text-primary">
                            R$ {(Number(product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between font-bold text-foreground mb-3">
                      <span>Total:</span>
                      <span className="text-primary">R$ {cartTotal.toFixed(2)}</span>
                    </div>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 transition-all duration-200 active:scale-95"
                      onClick={handleCheckout}
                    >
                      Ir para Checkout
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-accent/20 text-primary rounded-full text-sm font-medium">
                ✨ Tecnologia Premium
              </span>
              <h1 className="text-foreground leading-tight">
                Tecnologia de Ponta ao Seu Alcance
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Descubra uma curadoria exclusiva de gadgets inovadores que transformam seu dia a dia. Qualidade garantida, preços imbatíveis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl">
                Explorar Produtos <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="transition-all duration-200 active:scale-95 hover:bg-accent/50">
                Ver Avaliações
              </Button>
            </div>

            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-primary">1000+</div>
                <p className="text-sm text-muted-foreground">Clientes Satisfeitos</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <p className="text-sm text-muted-foreground">Avaliação Média</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24h</div>
                <p className="text-sm text-muted-foreground">Suporte Ativo</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 lg:h-full">
            <img
              src="/images/tech-lifestyle.jpg"
              alt="Projetor em uso"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-card py-20 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">Por Que Escolher A Gente?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Oferecemos a melhor experiência de compra com garantia de qualidade e suporte excepcional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => {
              const Icon = benefit.icon;
              return (
                <Card key={idx} className="p-8 border border-border hover:border-primary/50 transition">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">Produtos em Destaque</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seleção cuidadosa de produtos de tecnologia com melhor custo-benefício
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(searchQuery ? filteredProducts : products).slice(0, 3).map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-border flex flex-col h-full"
                onClick={() => setSelectedProduct(product.id)}
              >
                <div className="relative h-64 overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl || "/images/accessories-flat-lay.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  {product.featured && (
                    <span className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      Destaque
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4 flex flex-col flex-grow">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(Number(product.rating || 0))
                                ? "fill-primary text-primary"
                                : "text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        R$ {Number(product.price).toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {Number(product.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                        Economize {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}%
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {product.description}
                    </p>
                  </div>

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-base font-semibold py-3 mt-auto transition-all duration-200 active:scale-95"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Adicionar ao Carrinho
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const product = products.find(p => p.id === selectedProduct);
              if (!product) return null;
              return (
                <div className="p-8">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="float-right text-2xl text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>

                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <img
                      src={product.imageUrl || "/images/accessories-flat-lay.jpg"}
                      alt={product.name}
                      className="w-full h-80 object-cover rounded-lg"
                    />
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-foreground mb-2">{product.name}</h2>
                        <div className="flex items-center gap-2 mb-4">
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

                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary">
                            R$ {Number(product.price).toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-lg text-muted-foreground line-through">
                              R$ {Number(product.originalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                        {product.originalPrice && (
                          <p className="text-green-600 font-semibold">
                            Economize {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}%
                          </p>
                        )}
                      </div>

                      <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Características:</h4>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">Produto de alta qualidade</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">Garantia de 2 anos</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">Entrega rápida e segura</span>
                        </div>
                      </div>

                      <Button
                        size="lg"
                        className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                        onClick={() => {
                          addToCart(product.id);
                          setSelectedProduct(null);
                        }}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      {/* Reviews Section */}
      <section id="reviews" className="bg-card py-20 border-t border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-foreground mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-lg text-muted-foreground">
              Milhares de clientes satisfeitos em todo o Brasil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Silva",
                rating: 5,
                text: "Produto de excelente qualidade! Chegou rápido e bem embalado. Recomendo!",
                avatar: "👨‍💼"
              },
              {
                name: "Marina Costa",
                rating: 5,
                text: "O projetor superou minhas expectativas. Imagem nítida e brilho perfeito para meu apartamento.",
                avatar: "👩‍💼"
              },
              {
                name: "João Pereira",
                rating: 5,
                text: "Atendimento excelente e produto chegou antes do prazo. Muito satisfeito!",
                avatar: "👨‍💻"
              }
            ].map((review, idx) => (
              <Card key={idx} className="p-6 border border-border">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{review.avatar}</span>
                  <div>
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground border-t border-border">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Explore nossa coleção completa de gadgets tecnológicos e encontre exatamente o que você procura.
          </p>
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Comprar Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Tech Gadgets</h3>
              <p className="text-sm text-muted-foreground">
                Sua loja de tecnologia confiável com os melhores produtos e preços.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Fones</a></li>
                <li><a href="#" className="hover:text-primary">Smartwatches</a></li>
                <li><a href="#" className="hover:text-primary">Carregadores</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Contato</a></li>
                <li><a href="#" className="hover:text-primary">FAQ</a></li>
                <li><a href="#" className="hover:text-primary">Devoluções</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary">Termos</a></li>
                <li><a href="#" className="hover:text-primary">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Tech Gadgets Store. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
