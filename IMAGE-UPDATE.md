# Image Update Guide

This guide explains how to permanently update photos on your GitHub Pages portfolio site.

## Understanding the System

### The Problem with localStorage
The original "Change photo" feature used browser localStorage, which created these issues:
- **Browser-specific**: Changes only visible in that specific browser on that specific device
- **Not persistent**: Changes don't affect the actual website files
- **Visitor confusion**: Appears to work locally but doesn't update the live site

### The Solution
Photos are now real image files in the repository. To update a photo across all devices and browsers, you must replace the actual image file in `assets/img/` and push to GitHub.

## Quick Start

### Step 1: Identify Which File to Replace

Run your site locally and use the "Change photo" button in development mode:

```bash
# Start a local server (choose one):
python -m http.server 8000
# OR
npx serve
# OR
php -S localhost:8000
```

Open `http://localhost:8000` in your browser. The "Change photo" buttons will be visible. When you click one and select an image, the console will show you exactly which file to replace.

### Step 2: Prepare Your Image

1. **Resize** your image to appropriate dimensions:
   - Hero photos: 800x600px or similar landscape
   - Headshots: 400x400px square
   - Architecture diagrams: 1200x600px wide
   - Artifact images: 800x600px

2. **Optimize** the file size (aim for under 500KB):
   - Use tools like [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/), or ImageOptim
   - Use 80-85% JPEG quality for photos
   - Use PNG for diagrams with transparency

3. **Name it correctly** using the exact filename from the mapping table below

### Step 3: Replace the File

Copy your prepared image file to the `assets/img/` directory in your local repository, replacing the existing file with the same name.

### Step 4: Commit and Push

```bash
git add assets/img/your-image-name.jpg
git commit -m "Update [description] image"
git push origin main
```

### Step 5: Wait and Verify

1. Wait 1-2 minutes for GitHub Pages to rebuild
2. Visit your live site (hard refresh with Ctrl+Shift+R or Cmd+Shift+R)
3. Confirm the image updated

## Image File Mapping

| Page/Section | What It Shows | Image File Path |
|-------------|---------------|-----------------|
| Home Page - Hero | Main profile/brand photo | `assets/img/hero-home.jpg` |
| Home Page - Contact | Headshot in contact section | `assets/img/headshot.jpg` |
| About Page - Hero | Wide hero banner | `assets/img/hero-about.jpg` |
| Batch Medallion Project | Architecture diagram | `assets/img/batch-medallion-architecture.jpg` |
| Batch Medallion Project | Medallion layer artifact | `assets/img/batch-medallion-artifact-0.jpg` |
| Realtime Risk Project | Architecture diagram | `assets/img/realtime-risk-architecture.jpg` |
| Realtime Risk Project | Streaming flow artifact | `assets/img/realtime-risk-artifact-0.jpg` |
| Platform Project | Architecture diagram | `assets/img/platform-architecture.jpg` |
| Platform Project | Compose layout artifact | `assets/img/platform-artifact-0.jpg` |
| Clean Health Project | Architecture diagram | `assets/img/clean-health-pipeline-architecture.jpg` |
| Clean Health Project | Pipeline DAG artifact | `assets/img/clean-health-pipeline-artifact-0.jpg` |

## Development Mode Features

### "Change Photo" Button (localhost only)

When running locally, you'll see "Change photo" buttons on all image placeholders. These buttons:

✅ **What they DO:**
- Help you identify which file corresponds to each image
- Show a temporary preview of your selected image
- Display instructions in the console for making changes permanent

❌ **What they DON'T do:**
- Upload images to any server
- Save changes to localStorage
- Make changes visible on other devices
- Update the live GitHub Pages site

### Why is it localhost-only?

The "Change photo" feature is hidden on the live GitHub Pages site to avoid confusing visitors. It only appears when you run the site locally for development (localhost, 127.0.0.1).

## Image Guidelines

### File Formats
- **Photos (people, scenes)**: Use JPEG/JPG
- **Diagrams with text**: Use PNG for crisp text
- **Diagrams with transparency**: Use PNG

### Recommended Dimensions
- **Hero home photo**: 800x600px (4:3) or 1000x750px
- **Hero about photo**: 1200x400px (3:1 wide banner)
- **Headshot**: 400x400px (1:1 square)
- **Architecture diagrams**: 1200x600px (2:1)
- **Artifact images**: 800x600px (4:3) or wider

### File Size
- Target: **Under 500KB per image**
- Maximum: 1MB (larger images slow down page load)
- Use compression tools to reduce file size while maintaining quality

### Naming Convention
- Use the **exact** filenames from the mapping table
- Use lowercase
- Use hyphens, not spaces or underscores
- Include file extension (.jpg or .png)

## Troubleshooting

### The image doesn't appear after pushing
- **Hard refresh** your browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Check GitHub Actions tab to ensure deployment succeeded
- Verify the image file name exactly matches the expected name
- Check that the image file is in `assets/img/`, not a subdirectory

### The "Change photo" button doesn't appear
- Are you running on localhost? The button only works in development mode
- Check the browser console for JavaScript errors
- Ensure `assets/js/photo-editor.js` is loaded

### The image shows but looks wrong
- Check image dimensions (might be stretched or cropped)
- Verify file size (large files may load slowly)
- Ensure image format is appropriate (JPEG for photos, PNG for diagrams)

### I see a placeholder instead of my image
- Check that the image file exists at the exact path in `assets/img/`
- Verify the filename matches exactly (case-sensitive on some servers)
- Check that the file extension is correct (.jpg vs .jpeg vs .png)

## Quick Reference: Full Workflow

```bash
# 1. Run locally to identify which file
python -m http.server 8000

# 2. Prepare your image (resize, optimize, name correctly)

# 3. Copy to assets/img/
cp ~/Downloads/my-photo.jpg assets/img/hero-home.jpg

# 4. Commit and push
git add assets/img/hero-home.jpg
git commit -m "Update home hero photo"
git push origin main

# 5. Wait 1-2 minutes, then hard refresh your live site
```

## Advanced: Batch Updates

To update multiple images at once:

```bash
# Copy all your images to assets/img/ first
git add assets/img/*.jpg assets/img/*.png
git commit -m "Update multiple project images"
git push origin main
```

## Need Help?

- Check the detailed mapping in `assets/img/IMAGE-MAP.md`
- Review the console messages when using "Change photo" locally
- Ensure you're following the exact file naming convention
- Verify images are in `assets/img/`, not nested subdirectories

---

**Remember**: The "Change photo" button is a development tool to help you identify which file to replace. To make changes permanent and visible to everyone, you must replace the actual image file in the repository and push to GitHub.
