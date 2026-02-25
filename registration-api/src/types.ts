// src/types.ts

/**
 * Response returned by the embedding service
 */
export interface EmbeddingServiceResponse {
  embedding: number[];
}

/**
 * Successful response from registration endpoint
 */
export interface RegisterSuccessResponse {
  success: true;
  studentId: number;
}

/**
 * Error response shape (shared)
 */
export interface ErrorResponse {
  error: string;
}