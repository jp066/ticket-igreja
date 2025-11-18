import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  id: string;
  name: string;
  phone: string;
  quantity: number;
  createdAt: string;
  used: boolean;
  usedAt?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = () => {
    const allTickets: Ticket[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("ticket-")) {
        const ticket = JSON.parse(localStorage.getItem(key) || "{}");
        allTickets.push(ticket);
      }
    }
    
    // Ordenar por data de criação (mais recente primeiro)
    allTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setTickets(allTickets);
  };

  const toggleUsedStatus = (ticketId: string) => {
    const storedTicket = localStorage.getItem(`ticket-${ticketId}`);
    if (storedTicket) {
      const ticket = JSON.parse(storedTicket);
      ticket.used = !ticket.used;
      
      if (ticket.used) {
        ticket.usedAt = new Date().toISOString();
        toast.success("Filipeta marcada como usada");
      } else {
        delete ticket.usedAt;
        toast.success("Status resetado");
      }
      
      localStorage.setItem(`ticket-${ticketId}`, JSON.stringify(ticket));
      loadTickets();
    }
  };

  const stats = {
    total: tickets.length,
    used: tickets.filter(t => t.used).length,
    available: tickets.filter(t => !t.used).length,
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Gerenciamento de filipetas</p>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            <Home className="w-4 h-4 mr-2" />
            Início
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Filipetas</CardDescription>
              <CardTitle className="text-4xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Disponíveis</CardDescription>
              <CardTitle className="text-4xl text-success">{stats.available}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Utilizadas</CardDescription>
              <CardTitle className="text-4xl text-muted-foreground">{stats.used}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Compras</CardTitle>
            <CardDescription>
              Todas as filipetas registradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhuma filipeta cadastrada ainda</p>
                <Button onClick={() => navigate("/")} className="mt-4">
                  Fazer Primeira Compra
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{ticket.name}</p>
                        <Badge variant={ticket.used ? "secondary" : "default"}>
                          {ticket.used ? "Usada" : "Disponível"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ticket.quantity} {ticket.quantity === 1 ? 'ingresso' : 'ingressos'}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {ticket.id}
                      </p>
                    </div>
                    <Button
                      onClick={() => toggleUsedStatus(ticket.id)}
                      size="sm"
                      variant={ticket.used ? "outline" : "default"}
                    >
                      {ticket.used ? (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Resetar
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Marcar Usada
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <Button
            onClick={() => navigate("/validate")}
            size="lg"
            className="min-w-[200px]"
          >
            Ir para Validação
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
