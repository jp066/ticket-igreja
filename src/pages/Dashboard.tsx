import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Home, Search, Ticket, Users, Calendar, CheckCircle, LogOut } from "lucide-react";
import { toast } from "sonner";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Ticket as TicketType, markTicketAsUsed } from "@/lib/ticketService";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const ticketsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TicketType[];
      
      setTickets(ticketsData);
    } catch (error) {
      console.error('Erro ao buscar filipetas:', error);
      toast.error("Erro ao carregar filipetas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsUsed = async (ticketId: string, ticketName: string) => {
    try {
      await markTicketAsUsed(ticketId);
      
      // Atualizar o estado local
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, used: true } : ticket
        )
      );
      
      toast.success(`Filipeta de ${ticketName} marcada como usada!`);
    } catch (error) {
      console.error('Erro ao marcar filipeta como usada:', error);
      toast.error("Erro ao atualizar filipeta");
    }
  };

  const filteredTickets = tickets.filter(ticket => 
    ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.phone.includes(searchTerm) ||
    ticket.ticketCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTickets = tickets.length;
  const totalQuantity = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const usedTickets = tickets.filter(t => t.used).length;

  const formatDate = (date: any) => {
    if (date instanceof Timestamp) {
      return date.toDate().toLocaleDateString('pt-BR');
    }
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Filipetas</h1>
            <p className="text-muted-foreground mt-1">Gerencie todas as filipetas vendidas</p>
            {user && (
              <p className="text-sm text-muted-foreground mt-1">
                Logado como: {user.email}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
            <Button onClick={() => navigate("/")} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{totalTickets}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Ingressos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{totalQuantity}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Filipetas Usadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold">{usedTickets}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold">{totalTickets - usedTickets}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Filipetas</CardTitle>
            <CardDescription>Pesquise por nome, telefone ou código</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle>Filipetas Vendidas ({filteredTickets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Carregando filipetas...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "Nenhuma filipeta encontrada" : "Nenhuma filipeta vendida ainda"}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold">{ticket.name}</p>
                          <p className="text-sm text-muted-foreground">{ticket.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Código</p>
                        <p className="font-mono text-sm font-medium">{ticket.ticketCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Quantidade</p>
                        <p className="font-semibold">{ticket.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Data</p>
                        <p className="text-sm">{formatDate(ticket.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {ticket.used ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Usado
                          </span>
                        ) : (
                          <>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                              Disponível
                            </span>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsUsed(ticket.id!, ticket.name);
                              }}
                              className="ml-2"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Marcar Usado
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
