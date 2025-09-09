const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static assets (images, CSS, JS, fonts, etc.) — exact filenames with extensions
app.use(express.static(path.join(__dirname, 'public'), {
  // Optional: add caching headers in production
  // maxAge: '1d'
}));

// Serve clean URLs: /about → about.html, /apply → apply.html, etc.
app.get('*', (req, res, next) => {
  // Skip if path has an extension (e.g., .png, .css, .js)
  if (path.extname(req.path)) {
    return next(); // Let static handler serve it or 404
  }

  // Try to serve the path as an .html file
  const htmlFilePath = path.join(__dirname, 'public', req.path + '.html');

  res.sendFile(htmlFilePath, err => {
    if (err) {
      // If .html file doesn't exist, serve index.html only for root
      if (req.path === '/') {
        res.sendFile(path.join(__dirname, 'public', 'index.html'), err2 => {
          if (err2) {
            res.status(500).send('Server Error: index.html missing');
          }
        });
      } else {
        // For any other clean URL without matching .html file → 404
        res.status(404).send(`
          <h1>404 - Page Not Found</h1>
          <p>The page <code>${req.path}</code> does not exist yet.</p>
          <p><a href="/">← Back to Home</a></p>
        `);
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📂 Serving files from "${path.join(__dirname, 'public')}"`);
  console.log(`🔗 /           → index.html`);
});
