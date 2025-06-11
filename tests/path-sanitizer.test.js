import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import { createPathSanitizer } from '../src/middleware/path-sanitizer.js';

describe('Path Sanitizer Middleware', () => {
  const mockCdnRoot = '/var/cdn';
  
  const createMockRequest = (filePath) => ({
    params: { filePath },
    query: {},
  });
  
  const createMockResponse = () => ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  });
  
  const createMockNext = vi.fn();

  it('should allow safe file paths within CDN root', () => {
    const req = createMockRequest('images/logo.png');
    const res = createMockResponse();
    const next = createMockNext;
    
    const middleware = createPathSanitizer(mockCdnRoot);
    
    middleware(req, res, next);
    
    expect(req.sanitizedFilePath).toBe(path.resolve(mockCdnRoot, 'images/logo.png'));
    expect(next).toHaveBeenCalled();
  });

  it('should block directory traversal attempts', () => {
    const maliciousPath = '../../../etc/passwd';
    const req = createMockRequest(maliciousPath);
    const res = createMockResponse();
    const next = createMockNext;
    
    const middleware = createPathSanitizer(mockCdnRoot);
    
    middleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Access denied',
      message: 'Invalid file path'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should throw error if CDN root is not specified', () => {
    expect(() => createPathSanitizer()).toThrow('CDN root directory must be specified');
  });

  it('should handle encoded paths correctly', () => {
    const encodedPath = encodeURIComponent('../secret/file.txt');
    const req = createMockRequest(encodedPath);
    const res = createMockResponse();
    const next = createMockNext;
    
    const middleware = createPathSanitizer(mockCdnRoot);
    
    middleware(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Access denied',
      message: 'Invalid file path'
    });
    expect(next).not.toHaveBeenCalled();
  });
});