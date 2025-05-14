

export interface TokenResponse {
    token: string;
    usuario: {
    id: number;
    nombreUsuario: string;
    nombreCompleto: string;
    telefono: string;
    nroDocumento: string;
    tipoDocumento: string;
    rol: string;
  };
} 