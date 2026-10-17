import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectsFilePath = path.join(__dirname, '..', 'src', 'data', 'projects.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("\n🚀 --- Portfolio Project Creator Wizard --- 🚀\n");

  const title = await ask("Project Title: ");
  if (!title.trim()) {
    console.error("❌ Project title is required.");
    rl.close();
    return;
  }

  const tech = await ask("Tech Stack (e.g. Python / Flask / IoT): ");
  const description = await ask("Description: ");
  const github = await ask("GitHub URL (or leave empty): ");
  const demo = await ask("Live Demo URL (or '#' if none): ");
  const video = await ask("Video Path/URL (or leave empty for typewriter terminal): ");
  const typewriterText = await ask("Terminal Typewriter Lines (separated by \\n, or leave empty): ");

  let projects = [];
  try {
    const raw = fs.readFileSync(projectsFilePath, 'utf8');
    projects = JSON.parse(raw);
  } catch (err) {
    projects = [];
  }

  const newProject = {
    id: "project-" + Date.now(),
    title: title.trim(),
    tech: tech.trim(),
    description: description.trim(),
    video: video.trim(),
    typewriterText: typewriterText.replace(/\\n/g, '\n').trim(),
    github: github.trim(),
    demo: demo.trim() || "#"
  };

  projects.unshift(newProject);
  fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2), 'utf8');

  console.log(`\n✅ Successfully added "${newProject.title}" to src/data/projects.json!\n`);

  const pushGit = await ask("Do you want to commit and push this new project to GitHub now? (y/n): ");
  if (pushGit.toLowerCase().trim() === 'y') {
    try {
      console.log("Staging and pushing changes to GitHub...");
      execSync('git add src/data/projects.json', { stdio: 'inherit' });
      execSync(`git commit -m "feat: add ${newProject.title} project"`, { stdio: 'inherit' });
      execSync('git push origin main', { stdio: 'inherit' });
      console.log("🎉 Successfully pushed to GitHub main!");
    } catch (err) {
      console.error("⚠️ Git push encountered an issue:", err.message);
    }
  }

  rl.close();
}

main();
