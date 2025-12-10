# Setup Guide

## Local Testing with npm link

The npm link is already set up! Here's how to use it in another application:

### In app Directory:

```bash
cd /path/to/your-app
npm link @krumio/trailhand-ui
```

### Use in Your Code:

```javascript
// Import the component
import '@krumio/trailhand-ui/toggle-switch';

// Or
import { ToggleSwitch } from '@krumio/trailhand-ui';
```

```html
<!-- Use it -->
<toggle-switch onLabel="Enabled" offLabel="Disabled"></toggle-switch>
```

### When Done Testing:

```bash
# In your app
npm unlink @krumio/trailhand-ui

# To reinstall regular dependencies
npm install
```

### Making Changes:

Any changes you make to the trailhand-ui code will immediately be available in your app (you may need to restart your dev server).

---

## GitHub Packages Setup (LATER)

When you're ready to publish to GitHub Packages:

### 1. Create a GitHub Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Give it a name like "npm-packages"
4. Select these scopes:
   - ✅ `write:packages` - Upload packages
   - ✅ `read:packages` - Download packages
   - ✅ `delete:packages` - Delete packages (optional)
5. Click **"Generate token"**
6. **Copy the token** (you won't see it again!)

### 2. Authenticate with GitHub Packages

Add your token to your home directory's `.npmrc`:

```bash
# Add this line to ~/.npmrc (create if doesn't exist)
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE" >> ~/.npmrc
```

Or set it as an environment variable:

```bash
export GITHUB_TOKEN=your_token_here
```

### 3. Publish to GitHub Packages

From the trailhand-ui directory:

```bash
npm publish
```

That's it! The package is now on GitHub Packages.

### 4. Install package to another application (Production)

**Create `.npmrc` in your app:**

```bash
# In your app root
cat > .npmrc << 'EOF'
@krumio:registry=https://npm.pkg.github.com
EOF
```

**Add to your home `.npmrc` for authentication:**

```bash
echo "//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE" >> ~/.npmrc
```

**Install the package:**

```bash
npm install @krumio/trailhand-ui
```

**Add to package.json:**

```json
{
  "dependencies": {
    "@krumio/trailhand-ui": "^1.0.0"
  }
}
```

### 5. CI/CD Setup

For GitHub Actions, add the token as a secret:

```yaml
# .github/workflows/your-workflow.yml
- name: Install dependencies
  run: npm install
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**Or create `.npmrc` in your app with:**

```
@krumio:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

---

## Version Updates

### Publishing New Version

1. Update version in package.json:
   ```bash
   npm version patch  # 1.0.0 -> 1.0.1
   npm version minor  # 1.0.0 -> 1.1.0
   npm version major  # 1.0.0 -> 2.0.0
   ```

2. Publish:
   ```bash
   npm publish
   ```

3. In app:
   ```bash
   npm update @krumio/trailhand-ui
   ```

---

## Troubleshooting

### npm link not working

If you get errors, try:

```bash
# In trailhand-ui
npm unlink
npm link

# In app
npm unlink @krumio/trailhand-ui
npm link @krumio/trailhand-ui
```

### "Could not resolve dependency" error

Make sure you have the `.npmrc` file in your app with:
```
@krumio:registry=https://npm.pkg.github.com
```

### Authentication errors with GitHub Packages

Verify your token has the correct permissions:
- `read:packages`
- `write:packages`

Check that your token is in `~/.npmrc`:
```bash
cat ~/.npmrc | grep npm.pkg.github.com
```

### Component not rendering

1. Check the import:
   ```javascript
   import '@krumio/trailhand-ui/toggle-switch';
   ```

2. Verify it's registered:
   ```javascript
   console.log(customElements.get('toggle-switch'));
   ```

3. Make sure `lit` is installed:
   ```bash
   npm install lit
   ```

---

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm link` | Create link (in trailhand-ui) |
| `npm link @krumio/trailhand-ui` | Use link (in app) |
| `npm unlink @krumio/trailhand-ui` | Remove link |
| `npm publish` | Publish to GitHub Packages |
| `npm install @krumio/trailhand-ui` | Install from GitHub Packages |
| `npm update @krumio/trailhand-ui` | Update to latest version |

---

## Current Status

✅ **npm link**: Ready to use!
⏳ **GitHub Packages**: Ready to publish when needed

To use right now:
```bash
cd /path/to/your-app
npm link @krumio/trailhand-ui
```
