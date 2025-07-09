export interface EncuestaSatisfaccionRequest {
    idRecibo: number;
    idCotizacion: number;
    evaluaciones: EvaluacionRequest[];
}

export interface EvaluacionRequest {
    idPregunta: number;
    puntajeSatisfaccion: number;
    comentario?: string;
} 