import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";
import { toast } from "sonner";

const Purchase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    quantity: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || formData.quantity < 1) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    // Gerar ID único para a filipeta
    const ticketId = `FLP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Aqui você integraria com Firebase/Firestore
    // Por enquanto, vamos simular salvando no localStorage
    const purchase = {
      id: ticketId,
      ...formData,
      createdAt: new Date().toISOString(),
      used: false,
    };
    
    localStorage.setItem(`ticket-${ticketId}`, JSON.stringify(purchase));
    
    toast.success("Filipeta comprada com sucesso!");
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
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

            <Button type="submit" className="w-full" size="lg">
              Comprar Filipeta
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground"
            >
              Acessar Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Purchase;
