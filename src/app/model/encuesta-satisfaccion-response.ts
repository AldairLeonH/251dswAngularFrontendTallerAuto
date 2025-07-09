export interface EncuestaSatisfaccionResponse {
    idEncuesta: number;
    idRecibo: number;
    idCotizacion: number;
    evaluaciones: EvaluacionResponse[];
    promedioSatisfaccion: number;
    mensaje: string;
    estadoRecibo?: string;
    idCliente?: number;
}

export interface EvaluacionResponse {
    idEvaluacion: number;
    idEncuesta: number;
    idPregunta: number;
    pregunta: string;
    puntajeSatisfaccion: number;
    comentario?: string;
} 