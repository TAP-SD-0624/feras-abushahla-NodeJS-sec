const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const dataDir = path.join(__dirname, 'data');

app.listen(3000, () => {
    console.log(`Express app is listening on the port 3000!`);
  });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// List all files
app.get('/', (req, res) => {
  fs.readdir(dataDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading directory');
    }
    res.render('index', { files });
  });
});

// Render file creation form
app.get('/create', (req, res) => {
  res.render('create');
});

// Handle file creation
app.post('/create', (req, res) => {
  const { filename, content } = req.body;
  const filePath = path.join(dataDir, filename);
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error creating file');
    }
    res.redirect('/');
  });
});

// View specific file content
app.get('/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(dataDir, filename);
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error reading file');
    }
    res.render('detail', { filename, content });
  });
});

// Handle file update and delete (if implemented)


