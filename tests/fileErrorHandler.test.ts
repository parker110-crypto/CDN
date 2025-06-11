import { describe, it, expect, vi } from 'vitest';
import fs from 'fs/promises';
import { checkFileAccess, FileAccessError } from '../src/fileErrorHandler';

describe('File Error Handling', () => {
  it('should throw FileAccessError when file cannot be accessed', async () => {
    // Mock fs.access to simulate permission denied
    vi.spyOn(fs, 'access').mockRejectedValue(new Error('Permission denied'));
    
    await expect(checkFileAccess('/path/to/nonexistent/file')).rejects.toThrow(FileAccessError);
  });

  it('should successfully check file access when file exists', async () => {
    // Create mock for successful file access
    vi.spyOn(fs, 'access').mockResolvedValue(undefined);
    vi.spyOn(fs, 'stat').mockResolvedValue({} as any);

    await expect(checkFileAccess('/path/to/valid/file')).resolves.not.toThrow();
  });

  it('should handle unknown errors during file access', async () => {
    // Simulate an unknown error
    vi.spyOn(fs, 'access').mockRejectedValue(new Error());
    
    await expect(checkFileAccess('/path/to/file')).rejects.toThrow(FileAccessError);
  });
});