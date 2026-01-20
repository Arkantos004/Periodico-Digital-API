import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadsDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // Crear directorio si no existe
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  uploadFile(file: Express.Multer.File): { url: string; filename: string } {
    if (!file) {
      throw new Error('No file provided');
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(this.uploadsDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    return {
      filename,
      url: `/api/uploads/${filename}`,
    };
  }

  deleteFile(filename: string): void {
    const filepath = path.join(this.uploadsDir, filename);

    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
  }

  getFile(filename: string): Buffer {
    const filepath = path.join(this.uploadsDir, filename);

    if (!fs.existsSync(filepath)) {
      throw new Error('Archivo no encontrado');
    }

    return fs.readFileSync(filepath);
  }
}
