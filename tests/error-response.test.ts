import { describe, it, expect, vi } from 'vitest';
import { ErrorResponseUtil, HttpStatusCode } from '../src/utils/error-response';

describe('ErrorResponseUtil', () => {
  // Mock Express response object
  const createMockResponse = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  });

  it('should send a standardized error response', () => {
    const mockRes = createMockResponse();
    
    ErrorResponseUtil.send(
      mockRes as any, 
      HttpStatusCode.BAD_REQUEST, 
      'Test error',
      'ERR_TEST'
    );

    expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Test error',
      errorCode: 'ERR_TEST'
    });
  });

  it('should handle optional error code', () => {
    const mockRes = createMockResponse();
    
    ErrorResponseUtil.send(
      mockRes as any, 
      HttpStatusCode.NOT_FOUND, 
      'Not found'
    );

    expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Not found'
    });
  });

  it('should create a not found error response', () => {
    const mockRes = createMockResponse();
    
    ErrorResponseUtil.notFound(mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.NOT_FOUND);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Resource not found'
    });
  });

  it('should create a bad request error response', () => {
    const mockRes = createMockResponse();
    
    ErrorResponseUtil.badRequest(mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.BAD_REQUEST);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid request'
    });
  });

  it('should create an internal server error response', () => {
    const mockRes = createMockResponse();
    
    ErrorResponseUtil.internalServerError(mockRes as any);

    expect(mockRes.status).toHaveBeenCalledWith(HttpStatusCode.INTERNAL_SERVER_ERROR);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: 'An unexpected error occurred'
    });
  });

  it('should sanitize potentially sensitive information', () => {
    const mockRes = createMockResponse();
    
    ErrorResponseUtil.send(
      mockRes as any, 
      HttpStatusCode.BAD_REQUEST, 
      'Error in /home/user/sensitive/path with IP 192.168.1.1'
    );

    const jsonCallArgs = mockRes.json.mock.calls[0][0];
    expect(jsonCallArgs.success).toBe(false);
    expect(jsonCallArgs.message).toMatch(/^Error in \[REDACTED\] with IP \[IP_REDACTED\]$/);
  });
});