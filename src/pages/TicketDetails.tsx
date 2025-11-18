import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";
import QRCodeStyling from "qr-code-styling";

interface Ticket {
  id: string;
  name: string;
  phone: string;
  quantity: number;
  createdAt: string;
  used: boolean;
}

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    if (id) {
      const storedTicket = localStorage.getItem(`ticket-${id}`);
      if (storedTicket) {
        setTicket(JSON.parse(storedTicket));
      }
    }
  }, [id]);

  useEffect(() => {
    if (ticket) {
      const qrCode = new QRCodeStyling({
        width: 240,
        height: 240,
        data: ticket.id,
        dotsOptions: {
          color: "#10b981",
          type: "rounded"
        },
        backgroundOptions: {
          color: "#ffffff",
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 10
        }
      });

      const qrContainer = document.getElementById("qr-code");
      if (qrContainer) {
        qrContainer.innerHTML = "";
        qrCode.append(qrContainer);
      }
    }
  }, [ticket]);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Filipeta não encontrada</p>
            <Button onClick={() => navigate("/")}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-2">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <CardTitle className="text-2xl">Filipeta Confirmada!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium">{ticket.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quantidade</p>
              <p className="font-medium">{ticket.quantity} {ticket.quantity === 1 ? 'ingresso' : 'ingressos'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Código</p>
              <p className="font-mono text-sm font-medium">{ticket.id}</p>
            </div>
          </div>

          <div className="bg-card border-2 border-primary/20 rounded-lg p-6 flex flex-col items-center">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Apresente este QR Code na entrada
            </p>
            <div id="qr-code" className="rounded-lg overflow-hidden shadow-lg"></div>
          </div>

          <div className="space-y-2">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => window.print()}
            >
              Salvar Comprovante
            </Button>
            <Button 
              className="w-full" 
              onClick={() => navigate("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicketDetails;
