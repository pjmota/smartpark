export interface LoginCredentials {
  username: string;
  password: string;
};

export interface AuthResponse {
  data: {
    token: string;
    expiredIn: string;
  };
  message: string;
  originReturn: string;
  notification: any[];
};

export interface AuthError {
  codigo: string;
  mensagem: string;
  complemento: string;
};

export interface User {
  username: string;
  token: string;
  expiredIn: string;
};