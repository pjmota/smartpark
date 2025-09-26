import api from '../api.service';
import {LoginCredentials} from '@/types/auth.type';

// Tipo customizado para a resposta do login do serviço
interface LoginResponse {
  token: string;
  expiredIn: string;
  user: {
    username: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post('/login', {
        username: credentials.username,
        password: credentials.password
      });

      // Estrutura de resposta baseada na documentação da API mockada
      const { data, message } = response.data;
      
      if (data?.token) {
        // Armazenar token e dados do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
          token: data.token,
          expiredIn: data.expiredIn,
          username: credentials.username
        }));

        return {
          token: data.token,
          expiredIn: data.expiredIn,
          user: {
            username: credentials.username,
            // Adicionar outros campos conforme necessário
          }
        };
      }

      throw new Error(message || 'Falha na autenticação');
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Credenciais inválidas');
      }
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) return false;
      
      const user = JSON.parse(userStr);
      const expiredDate = new Date(user.expiredIn);
      
      if (expiredDate > new Date()) {
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch {
      this.logout();
      return false;
    }
  },

  getCurrentUser() {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
};