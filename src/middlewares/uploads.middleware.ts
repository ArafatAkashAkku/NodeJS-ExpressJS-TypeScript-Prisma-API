import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { isDevelopment } from '../utilities/app.utilities';

// Use memory storage instead of writing immediately to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// Helper: Generate unique filename
function getFileName(originalName: string): string {
  const timestamp = Date.now();
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  if (isDevelopment) console.log(`File name: ${baseName}-${timestamp}${ext}`);
  return `${baseName}-${timestamp}${ext}`;
}

// Helper: Save buffer to disk
function saveFileToDisk(
  file: Express.Multer.File,
  filename: string,
  folder: string = '',
): string {
  const baseUploadDir = path.join(__dirname, '../uploads');
  const targetDir = path.join(baseUploadDir, folder); // use folder subdirectory if provided

  if (!fs.existsSync(targetDir)) {
    if (isDevelopment) console.log(`Target directory: ${targetDir}`);
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const fullPath = path.join(targetDir, filename);
  if (isDevelopment) console.log(`Full path: ${fullPath}`);
  fs.writeFileSync(fullPath, file.buffer);
  return fullPath;
}

// Middleware: Handle single file, only save if response allows
export const uploadMiddleware = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        if (isDevelopment) console.log(`Upload error: ${err.message}`);
        return res.status(400).json({ error: 'Upload failed' });
      }
      if (isDevelopment) console.log(`Upload success: ${req.file?.filename}`);
      next(); // move to your controller, where you conditionally save the file
    });
  };
};

// Middleware: Multiple files (array)
export const uploadMultipleMiddleware = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.array(fieldName)(req, res, (err) => {
      if (err) {
        if (isDevelopment) console.log(`Upload error: ${err.message}`);
        return res.status(400).json({ error: 'Upload failed' });
      }
      if (isDevelopment) console.log(`Upload success: ${req.files?.length}`);
      next();
    });
  };
};

// Middleware: Multiple fields
export const uploadFieldsMiddleware = (
  fields: Array<{ name: string; maxCount?: number }>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.fields(fields)(req, res, (err) => {
      if (err) {
        if (isDevelopment) console.log(`Upload error: ${err.message}`);
        return res.status(400).json({ error: 'Upload failed' });
      }
      if (isDevelopment) console.log(`Upload success: ${req.files?.length}`);
      next();
    });
  };
};

// Export helper to manually save file from memory
export const saveUploadedFile = (
  file: Express.Multer.File,
  folder: string = '',
): string => {
  const filename = getFileName(file.originalname);
  if (isDevelopment) console.log(`Saving file: ${filename}`);
  saveFileToDisk(file, filename, folder);
  return filename;
};

export const saveUploadedFiles = (
  files: Express.Multer.File[],
  folder: string = '',
): string[] => {
  return files.map((file) => {
    const filename = getFileName(file.originalname);
    if (isDevelopment) console.log(`Saving file: ${filename}`);
    saveFileToDisk(file, filename, folder);
    return filename;
  });
};

export const deleteUploadedFile = (filename: string, folder: string = '') => {
  const baseUploadDir = path.join(__dirname, '../uploads');
  const targetDir = path.join(baseUploadDir, folder); // use folder subdirectory if provided
  const fullPath = path.join(targetDir, filename);
  if (isDevelopment) console.log(`Deleting file: ${fullPath}`);
  fs.unlinkSync(fullPath);
};

export const deleteUploadedFiles = (filenames: string[], folder: string = '') => {
  filenames.forEach((filename) => {
    deleteUploadedFile(filename, folder);
  });
};

// Export multer for manual control
export { upload as multerUpload };
