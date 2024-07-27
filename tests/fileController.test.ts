import { listFiles, createFile, viewFile } from '../controllers/fileController';
import { Request, Response } from 'express';
import fs from 'fs';

jest.mock('fs');

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('File Controller', () => {
  const dataDir = '../data';

  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      render: jest.fn(),
      redirect: jest.fn(),
    };
  });

  describe('listFiles', () => {
    it('should list all files', () => {
      mockedFs.readdir.mockImplementation((dir, callback) => {
        callback(null, ['file1.txt', 'file2.txt']);
      });

      listFiles(req as Request, res as Response);

      expect(mockedFs.readdir).toHaveBeenCalledWith(dataDir, expect.any(Function));
      expect(res.render).toHaveBeenCalledWith('index', { files: ['file1.txt', 'file2.txt'] });
    });

    it('should handle errors', () => {
      mockedFs.readdir.mockImplementation((dir, callback) => {
        callback(new Error('Unable to scan files'), []);
      });

      listFiles(req as Request, res as Response);

      expect(mockedFs.readdir).toHaveBeenCalledWith(dataDir, expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Unable to scan files');
    });
  });

  describe('createFile', () => {
    it('should create a new file', () => {
      req.body = { filename: 'newfile.txt', content: 'New file content' };

      mockedFs.writeFile.mockImplementation((filePath, data, callback) => {
        callback(null);
      });

      createFile(req as Request, res as Response);

      expect(mockedFs.writeFile).toHaveBeenCalledWith(`${dataDir}/newfile.txt`, 'New file content', expect.any(Function));
      expect(res.redirect).toHaveBeenCalledWith('/');
    });

    it('should handle errors', () => {
      req.body = { filename: 'newfile.txt', content: 'New file content' };

      mockedFs.writeFile.mockImplementation((filePath, data, callback) => {
        callback(new Error('Unable to create file'));
      });

      createFile(req as Request, res as Response);

      expect(mockedFs.writeFile).toHaveBeenCalledWith(`${dataDir}/newfile.txt`, 'New file content', expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Unable to create file');
    });
  });

  describe('viewFile', () => {
    it('should view the content of a specific file', () => {
      req.params = { filename: 'file1.txt' };

      mockedFs.readFile.mockImplementation((filePath, encoding, callback) => {
        callback(null, 'Sample content');
      });

      viewFile(req as Request, res as Response);

      expect(mockedFs.readFile).toHaveBeenCalledWith(`${dataDir}/file1.txt`, 'utf8', expect.any(Function));
      expect(res.render).toHaveBeenCalledWith('detail', { filename: 'file1.txt', content: 'Sample content' });
    });

    it('should handle errors', () => {
      req.params = { filename: 'file1.txt' };

      mockedFs.readFile.mockImplementation((filePath, encoding, callback) => {
        callback(new Error('Unable to read file'), '');
      });

      viewFile(req as Request, res as Response);

      expect(mockedFs.readFile).toHaveBeenCalledWith(`${dataDir}/file1.txt`, 'utf8', expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Unable to read file');
    });
  });
});
