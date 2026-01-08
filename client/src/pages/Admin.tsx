import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Edit, Package, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "0",
    featured: false,
  });

  const { data: products = [] } = trpc.products.list.useQuery();
  const { data: orders = [] } = trpc.admin.orders.useQuery();
  const createProductMutation = trpc.products.create.useMutation();
  const deleteProductMutation = trpc.products.delete.useMutation();
  const updateOrderStatusMutation = trpc.orders.updateStatus.useMutation();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Acesso Negado</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa ser um administrador para acessar esta página.
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProductMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice || undefined,
        category: formData.category,
        stock: parseInt(formData.stock),
        featured: formData.featured,
      });
      setFormData({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        stock: "0",
        featured: false,
      });
      setShowProductForm(false);
    } catch (error) {
      alert("Erro ao criar produto");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este produto?")) {
      try {
        await deleteProductMutation.mutateAsync({ id });
      } catch (error) {
        alert("Erro ao deletar produto");
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        id: orderId,
        status: newStatus as any,
      });
    } catch (error) {
      alert("Erro ao atualizar status do pedido");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border py-4">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Logado como: {user?.name}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "products"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Pedidos ({orders.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Gerenciar Produtos</h2>
              <Button
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            {/* Product Form */}
            {showProductForm && (
              <Card className="p-6">
                <h3 className="text-lg font-bold mb-4">Adicionar Novo Produto</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nome</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Categoria</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preço Original (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estoque</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">
                      Destacado na página inicial
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                      disabled={createProductMutation.isPending}
                    >
                      Adicionar Produto
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowProductForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Products List */}
            <div className="space-y-4">
              {products.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum produto cadastrado</p>
                </Card>
              ) : (
                products.map((product) => (
                  <Card key={product.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                        <div className="flex gap-4 text-sm">
                          <span>R$ {Number(product.price).toFixed(2)}</span>
                          <span className="text-muted-foreground">Estoque: {product.stock}</span>
                          {product.featured && (
                            <span className="px-2 py-1 bg-accent/20 text-primary text-xs rounded">
                              Destacado
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Gerenciar Pedidos</h2>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">Nenhum pedido</p>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">Pedido #{order.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "entregue"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelado"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-bold">R$ {Number(order.total).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className="mt-1 px-3 py-1 border border-border rounded bg-background text-sm"
                        >
                          <option value="pendente_pagamento">Pendente Pagamento</option>
                          <option value="pagamento_confirmado">Pagamento Confirmado</option>
                          <option value="processando">Processando</option>
                          <option value="enviado">Enviado</option>
                          <option value="entregue">Entregue</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
