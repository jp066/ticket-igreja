import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";
import { AUTHORIZED_EMAIL } from "@/lib/config";

const Login = () => {
  const navigate = useNavigate();
  const { signInWithGoogle, user, loading, signOut } = useAuth();

  useEffect(() => {
    // Se o usuário já estiver logado, verifica se é autorizado
    if (user && !loading) {
      if (user.email === AUTHORIZED_EMAIL) {
        navigate("/dashboard");
      } else {
        // Email não autorizado, faz logout
        signOut();
        toast.error("Acesso negado. Apenas administradores autorizados podem acessar.");
      }
    }
  }, [user, loading, navigate, signOut]);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      
      // Verifica se o email é autorizado
      if (result?.user?.email === AUTHORIZED_EMAIL) {
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        // Email não autorizado, faz logout imediatamente
        await signOut();
        toast.error("Acesso negado. Apenas o administrador autorizado pode acessar este painel.");
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error("Erro ao fazer login. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Botão Voltar ao Início */}
      <Button
        onClick={() => navigate("/")}
        variant="outline"
        size="sm"
        className="fixed top-4 left-4 z-50"
      >
        <Home className="w-4 h-4 mr-2" />
        Voltar ao Início
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Acesso ao Dashboard</CardTitle>
          <CardDescription>
            Faça login para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button 
              onClick={handleGoogleSignIn}
              className="w-full" 
              size="lg"
              variant="default"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar com Google
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Apenas administradores autorizados</p>
            <p>podem acessar o dashboard</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
