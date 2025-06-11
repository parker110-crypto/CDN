import { Response } from 'express';

/**
 * Enum representing different error types
 */
export enum ErrorType {
  NotFound = 'NOT_FOUND',
  Unauthorized = 'UNAUTHORIZED',
  Forbidden = 'FORBIDDEN',
  BadRequest = 'BAD_REQUEST',
  InternalServerError = 'INTERNAL_SERVER_ERROR'
}

/**
 * Interface for structured error response
 */
export interface ErrorResponse {
  status: number;
  type: ErrorType;
  message: string;
  details?: string;
}

/**
 * Centralized error response utility for consistent error handling
 */
export class ErrorResponseUtil {
  /**
   * Send a standardized error response
   * @param res Express response object
   * @param error Error details
   */
  static send(res: Response, error: ErrorResponse): Response {
    return res.status(error.status).json({
      error: {
        type: error.type,
        message: error.message,
        details: error.details || null
      }
    });
  }

  /**
   * Create a 404 Not Found error response
   * @param message Custom error message
   * @returns ErrorResponse object
   */
  static notFound(message: string = 'Resource not found'): ErrorResponse {
    return {
      status: 404,
      type: ErrorType.NotFound,
      message
    };
  }

  /**
   * Create a 400 Bad Request error response
   * @param message Custom error message
   * @param details Additional error details
   * @returns ErrorResponse object
   */
  static badRequest(message: string = 'Invalid request', details?: string): ErrorResponse {
    return {
      status: 400,
      type: ErrorType.BadRequest,
      message,
      details
    };
  }

  /**
   * Create a 403 Forbidden error response
   * @param message Custom error message
   * @returns ErrorResponse object
   */
  static forbidden(message: string = 'Access forbidden'): ErrorResponse {
    return {
      status: 403,
      type: ErrorType.Forbidden,
      message
    };
  }

  /**
   * Create a 500 Internal Server Error response
   * @param message Custom error message
   * @param details Additional error details
   * @returns ErrorResponse object
   */
  static internalServerError(
    message: string = 'Internal server error', 
    details?: string
  ): ErrorResponse {
    return {
      status: 500,
      type: ErrorType.InternalServerError,
      message,
      details
    };
  }
}