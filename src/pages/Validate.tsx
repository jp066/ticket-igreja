import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, AlertCircle, ScanLine } from "lucide-react";
import { toast } from "sonner";

interface ValidationResult {
  status: "valid" | "used" | "not-found";
  ticket?: any;
}

const Validate = () => {
  const [ticketCode, setTicketCode] = useState("");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const handleValidate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketCode.trim()) {
      toast.error("Digite o código da filipeta");
      return;
    }

    // Buscar filipeta no localStorage
    const storedTicket = localStorage.getItem(`ticket-${ticketCode}`);
    
    if (!storedTicket) {
      setValidationResult({ status: "not-found" });
      toast.error("Filipeta não encontrada");
      return;
    }

    const ticket = JSON.parse(storedTicket);
    
    if (ticket.used) {
      setValidationResult({ status: "used", ticket });
      toast.error("Esta filipeta já foi utilizada");
    } else {
      // Marcar como usada
      ticket.used = true;
      ticket.usedAt = new Date().toISOString();
      localStorage.setItem(`ticket-${ticketCode}`, JSON.stringify(ticket));
      
      setValidationResult({ status: "valid", ticket });
      toast.success("Filipeta validada com sucesso!");
    }
  };

  const resetValidation = () => {
    setTicketCode("");
    setValidationResult(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <ScanLine className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Validar Filipeta</CardTitle>
          <CardDescription>
            Digite ou escaneie o código do ingresso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleValidate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código da Filipeta</Label>
              <Input
                id="code"
                placeholder="FLP-XXXXXXXXXX"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
                className="font-mono"
                disabled={validationResult !== null}
              />
            </div>

            {validationResult === null ? (
              <Button type="submit" className="w-full" size="lg">
                Validar Filipeta
              </Button>
            ) : (
              <Button 
                type="button" 
                onClick={resetValidation} 
                variant="outline" 
                className="w-full" 
                size="lg"
              >
                Validar Outra Filipeta
              </Button>
            )}
          </form>

          {validationResult && (
            <div className="space-y-4">
              {validationResult.status === "valid" && (
                <Alert className="border-success bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <AlertDescription className="text-success font-medium ml-2">
                    Filipeta Válida - Entrada Autorizada
                  </AlertDescription>
                </Alert>
              )}

              {validationResult.status === "used" && (
                <Alert className="border-destructive bg-destructive/10">
                  <XCircle className="h-5 w-5 text-destructive" />
                  <AlertDescription className="text-destructive font-medium ml-2">
                    Filipeta Já Utilizada
                  </AlertDescription>
                </Alert>
              )}

              {validationResult.status === "not-found" && (
                <Alert className="border-muted-foreground bg-muted">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <AlertDescription className="text-muted-foreground font-medium ml-2">
                    Filipeta Não Encontrada
                  </AlertDescription>
                </Alert>
              )}

              {validationResult.ticket && (
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-sm">Informações da Filipeta</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Nome:</span> {validationResult.ticket.name}</p>
                    <p><span className="text-muted-foreground">Quantidade:</span> {validationResult.ticket.quantity}</p>
                    <p><span className="text-muted-foreground">Código:</span> <span className="font-mono">{validationResult.ticket.id}</span></p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Validate;
