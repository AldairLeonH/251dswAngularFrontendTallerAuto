export interface PreguntaEvaluacion {
    id?: number;
    pregunta: string;
}

export interface PreguntaEvaluacionRequest {
    pregunta: string;
}

export interface PreguntaEvaluacionResponse {
    id: number;
    pregunta: string;
} 