1. Work on feature/fix branches (highest impact)

Instead of committing to main, create a branch for every change:


git checkout -b fix/analytics-toggle
# make changes, commit
git push origin fix/analytics-toggle
Vercel automatically creates a preview deployment for every branch push — you get a live URL like habitflow-git-fix-analytics-toggle.vercel.app to test on before anything touches production.

2. Protect the main branch on GitHub

Go to GitHub → Repository → Settings → Branches → Add rule:

Branch name: main
Check "Require a pull request before merging"
Optionally: "Require approvals" (even just 1, from yourself)
This makes it physically impossible to push directly to main — everything must go through a PR.

3. Open a Pull Request instead of direct merge

Once a branch is ready:

Open a PR on GitHub from your branch → main
Review the diff yourself
Check the Vercel Preview URL
Merge only when it looks right
4. Run npm run build locally before every push

We already got burned by ESLint errors that only surfaced on Vercel. Running the full build locally catches those before they ever reach production.

5. Use a develop branch as the staging layer (optional, more structured)


feature/x  →  develop  →  main
                ↓              ↓
           staging URL   production URL
develop deploys to a staging environment. main is only updated when develop is confirmed stable. More overhead, but gives you a buffer.