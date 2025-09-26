export interface LoginCredentials {
  username: string;
  password: string;
};

export interface INotification {
  id: number;
  type: string;
  message: string;
  read: boolean;
}

export interface AuthResponse {
  data: {
    token: string;
    expiredIn: string;
  };
  message: string;
  originReturn: string;
  notification: INotification[];
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