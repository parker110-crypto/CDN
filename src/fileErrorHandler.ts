import { Request, Response, NextFunction } from 'express';
import fs from 'fs/promises';

/**
 * Custom error class for file access and permission errors
 */
export class FileAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileAccessError';
  }
}

/**
 * Middleware to handle file access and permission errors
 * @param err Error object
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const fileErrorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Log the error for internal tracking
  console.error(`File Access Error: ${err.message}`);

  // Handle specific file-related errors
  if (err instanceof FileAccessError) {
    return res.status(403).json({
      error: 'File Access Denied',
      message: 'Unable to access the requested file.'
    });
  }

  // Fallback to generic server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred while processing the file.'
  });
};

/**
 * Safely check file access and permissions
 * @param filePath Path to the file to check
 * @throws {FileAccessError} If file cannot be accessed
 */
export const checkFileAccess = async (filePath: string) => {
  try {
    // Attempt to access file metadata
    await fs.access(filePath);
    await fs.stat(filePath);
  } catch (error) {
    // Translate system errors to custom FileAccessError
    if (error instanceof Error) {
      throw new FileAccessError(`Cannot access file: ${error.message}`);
    }
    throw new FileAccessError('Unknown file access error');
  }
};