import multer from 'multer';
import path from 'path';
import {Request} from 'express';
import fs from 'fs';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'events');

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }
        cb(null, UPLOAD_DIR);
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const eventUpload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default eventUpload;