// count-loc.js
const fs = require("fs");
const path = require("path");

const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);
const ignoreDirs = new Set(["node_modules", ".git", "dist", "build", "out"]);

let total = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) {
        walk(path.join(dir, entry.name));
      }
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (exts.has(ext)) {
        const filePath = path.join(dir, entry.name);
        const content = fs.readFileSync(filePath, "utf8");
        total += content.split(/\r\n|\r|\n/).length;
      }
    }
  }
}

walk(process.cwd());
console.log(`Total lines: ${total}`);