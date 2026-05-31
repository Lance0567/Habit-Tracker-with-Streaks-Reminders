The full flow, step by step
Step 1 — Start a new change

git checkout develop          # start from the staging branch
git pull origin develop       # make sure it's up to date
git checkout -b feature/dark-mode-fix   # make your branch
Now you have a private branch to work on.

Step 2 — Build + commit
Make your changes, then:


git add .
git commit -m "fix: whatever you changed"
git push origin feature/dark-mode-fix
Step 3 — Test on the feature preview (first test)
When you push, Vercel automatically builds a preview for that branch. Go to your Vercel Deployments tab → find the deployment for feature/dark-mode-fix → click its URL.

This is a real cloud deployment — same as production but isolated. Test your change here. If it's broken, fix it, commit, push again — the preview updates automatically. Repeat until it works.

This is your first test gate. Nothing moves forward until the feature preview works.

Step 4 — Merge feature → develop (via PR)
Once the feature preview looks good:

Go to GitHub → it'll show "Compare & pull request" for your branch
IMPORTANT: change the base dropdown from main to develop
Create the PR → merge it
Now develop has your change. Delete the feature branch (GitHub offers a button).

Step 5 — Test on the develop preview (second test)
develop also gets its own Vercel preview URL. Test here again — this time you're checking that your change plays nicely with everything else that's accumulated in develop.

This is your second test gate. It catches "feature A broke feature B" problems.

Step 6 — Ship to production (develop → main PR)
When develop is solid and you're confident:

GitHub → New PR → base = main, compare = develop
Merge it
Vercel deploys main → production updates for real users