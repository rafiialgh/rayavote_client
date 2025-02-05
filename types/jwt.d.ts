import 'jsonwebtoken';

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    company?: {
      id?: string;
      email: string
    };
  }
}
