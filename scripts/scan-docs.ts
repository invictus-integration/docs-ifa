import fs from 'node:fs';
import path from 'node:path';

const SUPPORTED_EXTENSIONS = ['.md', '.mdx'];

interface ProjectConfig {
  name: string;
  sourceDirs?: string[]; // relative to repo root; defaults to projects/<id>
}

interface ProjectsConfig {
  [projectId: string]: ProjectConfig;
}

function scanDirectory(dir: string, baseDir: string = dir): Record<string, string> {
  const files: Record<string, string> = {};
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(files, scanDirectory(fullPath, baseDir));
    } else if (SUPPORTED_EXTENSIONS.includes(path.extname(entry.name))) {
      files[path.relative(baseDir, fullPath)] = fs.readFileSync(fullPath, 'utf-8');
    }
  }
  return files;
}

const root = process.cwd();
const projectsJsonPath = path.join(root, 'projects.json');
const generatedDir = path.join(root, 'static', 'generated');

if (!fs.existsSync(projectsJsonPath)) {
  console.error('projects.json not found');
  process.exit(1);
}

const config: ProjectsConfig = JSON.parse(fs.readFileSync(projectsJsonPath, 'utf-8'));

fs.mkdirSync(generatedDir, { recursive: true });

let totalProjects = 0;
let totalFiles = 0;

for (const [projectId, project] of Object.entries(config)) {
  const sourceDirs = project.sourceDirs ?? [`projects/${projectId}`];
  const allFiles: Record<string, string> = {};

  for (const sourceDir of sourceDirs) {
    const absDir = path.join(root, sourceDir);
    const scanned = scanDirectory(absDir, absDir);
    for (const [filePath, content] of Object.entries(scanned)) {
      allFiles[`${sourceDir}/${filePath}`] = content;
    }
  }

  const output = JSON.stringify({ ...project, files: allFiles }, null, 2);
  const outputPath = path.join(generatedDir, `${projectId}.json`);
  fs.writeFileSync(outputPath, output, 'utf-8');

  const sizeKb = (Buffer.byteLength(output) / 1024).toFixed(1);
  console.log(`✓ ${projectId}: ${Object.keys(allFiles).length} files → ${sizeKb} KB`);
  totalFiles += Object.keys(allFiles).length;
  totalProjects++;
}

console.log(`\nDone: ${totalProjects} project(s), ${totalFiles} file(s) total`);
