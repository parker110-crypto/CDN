import { Response } from 'express';

/**
 * Enum for standardized HTTP error status codes
 */
export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

/**
 * Represents the structure of an error response
 */
export interface ErrorResponse {
  success: boolean;
  message: string;
  errorCode?: string;
}

/**
 * Centralized utility for creating standardized error responses
 */
export class ErrorResponseUtil {
  /**
   * Send a standardized error response
   * @param res Express response object
   * @param statusCode HTTP status code
   * @param message Error message
   * @param errorCode Optional error code for more specific identification
   */
  static send(
    res: Response, 
    statusCode: HttpStatusCode, 
    message: string, 
    errorCode?: string
  ): Response {
    // Construct the error response object
    const errorResponse: ErrorResponse = {
      success: false,
      message: this.sanitizeErrorMessage(message),
      errorCode
    };

    // Remove undefined properties
    Object.keys(errorResponse).forEach(
      key => errorResponse[key as keyof ErrorResponse] === undefined && 
      delete errorResponse[key as keyof ErrorResponse]
    );

    // Send the error response
    return res.status(statusCode).json(errorResponse);
  }

  /**
   * Sanitize error messages to prevent information leakage
   * @param message Original error message
   * @returns Sanitized error message
   */
  private static sanitizeErrorMessage(message: string): string {
    // Remove any potentially sensitive system information
    return message
      .replace(/\/.*\//g, '[REDACTED]')
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, '[IP_REDACTED]');
  }

  /**
   * Create a generic 404 Not Found error response
   * @param res Express response object
   * @param message Optional custom message
   */
  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.send(res, HttpStatusCode.NOT_FOUND, message);
  }

  /**
   * Create a generic 400 Bad Request error response
   * @param res Express response object
   * @param message Optional custom message
   */
  static badRequest(res: Response, message: string = 'Invalid request'): Response {
    return this.send(res, HttpStatusCode.BAD_REQUEST, message);
  }

  /**
   * Create a generic 500 Internal Server Error response
   * @param res Express response object
   * @param message Optional custom message
   */
  static internalServerError(
    res: Response, 
    message: string = 'An unexpected error occurred'
  ): Response {
    return this.send(res, HttpStatusCode.INTERNAL_SERVER_ERROR, message);
  }
}