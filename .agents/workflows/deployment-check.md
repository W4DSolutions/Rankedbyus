---
description: Process to verify, commit, and push changes to the project cleanly
---

Before completing any task where we add, modify, or make any changes to the project, you MUST run this workflow to ensure code quality and prevent broken deploys on Vercel.

// turbo-all
1. Run ESLint to catch syntax errors and unused variables
```bash
npm run lint
```
2. Build the Next.js project to ensure no static generation, typescript, or hydration errors occur
```bash
npm run build
```
3. Stage the files, create a commit, and push the verified code to the main branch
```bash
git add .
git commit -m "feat/fix/chore: [update this with a short description of the changes]"
git push origin main
```
