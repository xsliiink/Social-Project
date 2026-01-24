import { Request } from 'express';
import multer, { StorageEngine, FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';


type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const UPLOAD_PATH = path.join(process.cwd(), 'uploads', 'avatars');

const storage: StorageEngine = multer.diskStorage({
    destination: (
        req: Request, 
        file: Express.Multer.File, 
        cb: DestinationCallback
    ): void => {
        if (!fs.existsSync(UPLOAD_PATH)) {
            fs.mkdirSync(UPLOAD_PATH, { recursive: true });
        }
        cb(null, UPLOAD_PATH);
    },
    filename: (
        req: Request, 
        file: Express.Multer.File, 
        cb: FileNameCallback
    ): void => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
): void => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!') as unknown as null, false);
    }
};

const userUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default userUpload;