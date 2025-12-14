# GitHub Pages Setup

This directory contains the landing page for the Even app, hosted on GitHub Pages.

## Files

- `index.html` - Main landing page
- `logo.png` - Even app logo
- `og-image.png` - OpenGraph meta image for social sharing
- `favicon.ico` - Favicon

## Deployment

To enable GitHub Pages:

1. Go to your repository settings on GitHub
2. Navigate to "Pages" section
3. Under "Source", select "Deploy from a branch"
4. Select branch: `main` (or your default branch)
5. Select folder: `/docs`
6. Click "Save"

Your landing page will be available at: `https://yourusername.github.io/even-app/`

## Local Testing

To test locally, simply open `index.html` in your browser:

```bash
open docs/index.html
```

Or use a local server:

```bash
cd docs
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Customization

Update the following in `index.html`:

- Line 211: Update GitHub link with your actual repository URL
- Line 212: Update World App link if needed
- Hero CTA button (line 119): Update link to your actual World App mini app URL
