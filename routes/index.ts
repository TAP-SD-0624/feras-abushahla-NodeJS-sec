import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { listFiles, createFile, viewFile, uploadFile, deleteFile } from '../controllers/fileController';

const router = Router();
const upload = multer({ dest: path.join(__dirname, '../data') });

router.get('/', listFiles);
router.get('/create', (req, res) => res.render('create'));
router.post('/create', createFile);
router.get('/files/:filename', viewFile);
router.delete('/files/:filename', deleteFile);
router.post('/upload', upload.single('file'), uploadFile);

export default router;
