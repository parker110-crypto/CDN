import { describe, it, expect } from 'vitest';
import { ErrorResponseUtil, ErrorType } from '../src/utils/error-response';
import { Response } from 'express';

describe('ErrorResponseUtil', () => {
  const mockResponse = {
    status: () => ({
      json: (data: any) => data
    })
  } as unknown as Response;

  it('should create a not found error response', () => {
    const error = ErrorResponseUtil.notFound();
    expect(error.status).toBe(404);
    expect(error.type).toBe(ErrorType.NotFound);
    expect(error.message).toBe('Resource not found');
  });

  it('should create a bad request error response', () => {
    const error = ErrorResponseUtil.badRequest('Invalid input', 'Field validation failed');
    expect(error.status).toBe(400);
    expect(error.type).toBe(ErrorType.BadRequest);
    expect(error.message).toBe('Invalid input');
    expect(error.details).toBe('Field validation failed');
  });

  it('should create a forbidden error response', () => {
    const error = ErrorResponseUtil.forbidden();
    expect(error.status).toBe(403);
    expect(error.type).toBe(ErrorType.Forbidden);
    expect(error.message).toBe('Access forbidden');
  });

  it('should create an internal server error response', () => {
    const error = ErrorResponseUtil.internalServerError('Database error', 'Connection timeout');
    expect(error.status).toBe(500);
    expect(error.type).toBe(ErrorType.InternalServerError);
    expect(error.message).toBe('Database error');
    expect(error.details).toBe('Connection timeout');
  });

  it('should send a standardized error response', () => {
    const error = ErrorResponseUtil.notFound();
    const result = ErrorResponseUtil.send(mockResponse, error);
    
    expect(result).toEqual({
      error: {
        type: ErrorType.NotFound,
        message: 'Resource not found',
        details: null
      }
    });
  });
});