import path from 'path';

/**
 * Middleware to sanitize and validate file paths
 * Prevents directory traversal attacks and ensures file access is restricted
 * 
 * @param {string} cdnRoot - Root directory for CDN file serving
 * @returns {Function} Express middleware function
 */
export function createPathSanitizer(cdnRoot) {
  if (!cdnRoot) {
    throw new Error('CDN root directory must be specified');
  }

  return (req, res, next) => {
    try {
      // Normalize the requested file path
      const requestedPath = req.params.filePath || req.query.path || '';
      
      // Decode the URI component to handle encoded characters
      const decodedPath = decodeURIComponent(requestedPath);
      
      // Normalize path to remove any '..' or multiple slashes
      const normalizedPath = path.normalize(decodedPath);
      
      // Resolve the full path against the CDN root
      const resolvedPath = path.resolve(cdnRoot, normalizedPath);
      
      // Check if the resolved path is within the CDN root directory
      const isPathSafe = resolvedPath.startsWith(path.resolve(cdnRoot));
      
      if (!isPathSafe) {
        return res.status(403).json({
          error: 'Access denied',
          message: 'Invalid file path'
        });
      }
      
      // Attach sanitized path to the request for further processing
      req.sanitizedFilePath = resolvedPath;
      
      next();
    } catch (error) {
      // Handle any errors during path sanitization
      res.status(400).json({
        error: 'Path sanitization failed',
        message: 'Invalid file path'
      });
    }
  };
}