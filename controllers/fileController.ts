import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, '../data');

// List the available files
export const listFiles = (req: Request, res: Response) => {
    fs.readdir(dataDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error reading files');
        }
        res.render('index', { files });
    });
};

// Create new file
export const createFile = (req: Request, res: Response) => {
    const { filename, content } = req.body;
    const filePath = path.join(dataDir, filename + '.txt');

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).send('Error creating file');
        }
        res.redirect('/');
    });
};

// View file details
export const viewFile = (req: Request, res: Response) => {
    const filePath = path.join(dataDir, req.params.filename);

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.render('detail', { filename: req.params.filename, content });
    });
};

// Upload file to server
export const uploadFile = (req: Request, res: Response): void => {
    const file = req.file;
    if (!file) {
      res.status(400).send('No file uploaded');
      return;
    }
    res.redirect('/');
  };

 // Delete file
 export const deleteFile = (req: Request, res: Response): void => {
    const { filename } = req.params;
    const filePath = path.join(dataDir, filename);
    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(500).send('Unable to delete file');
        return;
      }
      res.redirect('/');
    });
  };

 