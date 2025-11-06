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
