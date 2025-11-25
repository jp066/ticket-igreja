import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { AUTHORIZED_EMAIL } from '@/lib/config';
import { toast } from 'sonner';

/**
 * Hook para processar o resultado do redirecionamento de autenticação
 * e verificar se o email é autorizado
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
          // Usuário acabou de fazer login
          const userEmail = result.user.email;
          
          if (userEmail === AUTHORIZED_EMAIL) {
            // Email autorizado
            toast.success('Login realizado com sucesso!');
            navigate('/dashboard');
          } else {
            // Email não autorizado - fazer logout
            await signOut();
            toast.error('Acesso negado. Apenas o administrador autorizado pode acessar este painel.');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('Erro ao processar resultado do login:', error);
        toast.error('Erro ao processar login. Tente novamente.');
      }
    };

    handleRedirectResult();
  }, [navigate, signOut]);
};
