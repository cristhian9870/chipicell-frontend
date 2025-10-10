import fs from 'fs';
import path from 'path';

// This script copies a built frontend folder (e.g. chipicell/dist or chipicell/build)
// into the backend's ./public directory so the backend can serve it.

// Default to copying from ../project (the new frontend location). You can still pass a different path as an arg.
const FRONTEND_DIR = process.argv[2] || path.join(process.cwd(), '..', 'project');
const POSSIBLE_BUILD_FOLDERS = ['dist', 'build', 'public'];
const DEST = path.join(process.cwd(), '..', 'TodoApp-backend-main', 'public');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

(async () => {
  try {
    let found = false;
    for (const folder of POSSIBLE_BUILD_FOLDERS) {
      const candidate = path.join(FRONTEND_DIR, folder);
      if (fs.existsSync(candidate)) {
        console.log(`Copying frontend build from ${candidate} to ${DEST}`);
        copyDir(candidate, DEST);
        found = true;
        break;
      }
    }
    if (!found) {
      // maybe frontend repo already contains static files at root
      if (fs.existsSync(FRONTEND_DIR)) {
        console.log(`Copying frontend files from ${FRONTEND_DIR} to ${DEST}`);
        copyDir(FRONTEND_DIR, DEST);
        found = true;
      }
    }
    if (!found) {
      console.error('Frontend build not found. Please build your frontend or provide the path as an argument.');
      process.exit(1);
    }
    console.log('Copy completed.');
  } catch (err) {
    console.error('Error copying frontend:', err);
    process.exit(1);
  }
})();
