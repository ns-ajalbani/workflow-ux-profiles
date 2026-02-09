# GitHub Pages Deployment

This project is configured to automatically build and deploy to GitHub Pages using GitHub Actions.

## What It Does

The GitHub Actions workflow:
1. Triggers on every push to the `master` branch
2. Checks out your code
3. Installs dependencies with npm
4. Builds the project (`npm run build`)
5. Uploads coverage reports to Codecov (optional)
6. Deploys the `dist/` folder to GitHub Pages

## Setup Instructions

### Step 1: Configure GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
   - This will auto-detect the workflow
4. Save

### Step 2: Verify Workflow

1. Go to **Actions** tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow
3. After each push to `master`, the workflow will run automatically

### Step 3: Access Your Site

After the first successful deployment:
- **GitHub Pages URL**: `https://ns-ajalbani.github.io/workflow-ux-profiles/`
- Check the deployment in the repository's **Deployments** section

## Important Notes

### Base Path Configuration

The `vite.config.ts` includes:
```typescript
base: '/workflow-ux-profiles/',
```

This ensures all assets are served from the correct path on GitHub Pages.

### Custom Domain (Optional)

To use a custom domain:

1. Update the `cname` in `.github/workflows/deploy.yml`:
```yaml
cname: your-domain.com
```

2. Configure your DNS provider to point to GitHub Pages
3. Reference: [GitHub Pages custom domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

### Deployment Triggers

The workflow runs on:
- **Push to master branch** - Deploys to GitHub Pages
- **Pull requests to master** - Builds but doesn't deploy

### View Deployment Status

1. Go to **Actions** tab
2. Click the latest workflow run
3. See build logs and deployment status

## Module Federation on GitHub Pages

Your app is deployed as a federated module at:
```
https://ns-ajalbani.github.io/workflow-ux-profiles/assets/remoteEntry.js
```

Consumer apps can reference this in their `vite.config.ts`:
```typescript
remotes: {
  workflowProfiles: 'https://ns-ajalbani.github.io/workflow-ux-profiles/assets/remoteEntry.js'
}
```

## Troubleshooting

### Workflow Not Running

- Ensure you have `.github/workflows/deploy.yml` in your repository
- Check that the file is committed to the `master` branch
- Go to **Actions** tab to see any errors

### 404 Errors After Deployment

- Verify `base: '/workflow-ux-profiles/'` is set in `vite.config.ts`
- Clear browser cache
- Check that assets are in `dist/assets/` folder

### Module Not Loading

- Verify the remoteEntry.js path is correct
- Check browser console for CORS errors
- Ensure shared dependencies are configured in consumer app

## Environment Variables

If your app uses environment variables:

1. Create a `.env` file locally for development
2. In GitHub Actions, set secrets in **Settings** → **Secrets and variables** → **Actions**
3. Reference in workflow:
```yaml
env:
  VITE_API_URL: ${{ secrets.VITE_API_URL }}
```

## Disabling Auto-Open of Bundle Analyzer

By default, the bundle analyzer opens after build. To disable in CI/CD:

Update `vite.config.ts`:
```typescript
visualizer({
  open: !process.env.CI,  // Don't open in CI environments
  gzipSize: true,
  brotliSize: true,
  filename: 'dist/stats.html',
})
```

## More Information

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
