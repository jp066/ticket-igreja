import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { createTicket } from "@/lib/ticketService";

const Purchase = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    quantity: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || formData.quantity < 1) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    setIsLoading(true);

    try {
      // Salvar no Firebase Firestore
      const ticketId = await createTicket({
        name: formData.name,
        phone: formData.phone,
        quantity: formData.quantity,
      });
      
      toast.success("Filipeta comprada com sucesso!");
      navigate(`/ticket/${ticketId}`);
    } catch (error) {
      console.error('Erro ao comprar filipeta:', error);
      toast.error("Erro ao processar a compra. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Dashboard Button */}
      <Button
        onClick={() => navigate("/dashboard")}
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50"
      >
        <LayoutDashboard className="w-4 h-4 mr-2" />
        Dashboard
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Ticket className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Comprar Filipeta</CardTitle>
          <CardDescription>
            Preencha os dados para adquirir seu ingresso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Processando..." : "Comprar Filipeta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Purchase;
