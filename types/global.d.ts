declare global {

  interface Window {
    ethereum?: any;
  }


  interface JwtPayload {
    company: {
      id?: string;
      email: string
    };
  }
}

export {};
