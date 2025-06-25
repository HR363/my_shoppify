export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'CUSTOMER';
  }
} 