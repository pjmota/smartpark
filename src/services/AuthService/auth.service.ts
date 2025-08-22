import { LoginCredentials, AuthResponse } from '@/types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/Authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data)) {
          throw new Error(data[0]?.mensagem || 'Erro na autenticação');
        }
        throw new Error('Erro na autenticação');
      }

      return data as AuthResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro ao conectar com o servidor');
    }
  }
}