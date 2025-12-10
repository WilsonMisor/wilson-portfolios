# How to Update Photos on Your Portfolio (GitHub Pages)

## IMPORTANT: Understanding Photo Persistence

**Your portfolio is hosted on GitHub Pages**, which serves **static files only**. This means:

- ❌ Photos changed via the browser "Change photo" button **DO NOT persist** across devices
- ❌ localStorage saves changes only in **your current browser** on **your current device**
- ✅ **To make photos visible on all devices**, you must **update the actual image files** in the Git repository

## The Only Way to Permanently Change Photos

To update photos so they appear for **everyone, on all devices**:

### Step 1: Identify Which File to Replace

| What You See on the Site | File Path in Repository |
|--------------------------|-------------------------|
| **Home page hero photo** | `assets/img/user/wilson1.jpeg` |
| **Home page contact headshot** | `assets/img/user/wilson1.jpeg` (same as hero) |
| **About page hero photo** | `assets/img/user/wilson2.jpg` |
| **Retail project architecture diagram** | `assets/img/projects/retail-demand-architecture.jpg` |
| **Retail project artifact 1** | `assets/img/projects/retail-demand-artifact-1.jpg` |
| **Retail project artifact 2** | `assets/img/projects/retail-demand-artifact-2.jpg` |
| **Fraud project architecture diagram** | `assets/img/projects/fraud-architecture.jpg` |
| **Fraud project artifact 1** | `assets/img/projects/fraud-artifact-1.jpg` |
| **Fraud project artifact 2** | `assets/img/projects/fraud-artifact-2.jpg` |
| **Analytics project architecture diagram** | `assets/img/projects/analytics-architecture.jpg` |
| **Analytics project artifact 1** | `assets/img/projects/analytics-artifact-1.jpg` |
| **Analytics project artifact 2** | `assets/img/projects/analytics-artifact-2.jpg` |

### Step 2: Replace the Image File

```bash
# Navigate to your portfolio repository
cd C:\Users\USER\Documents\wilson-portfolios-main\wilson-portfolios-main\ds

# Replace the image file with your new image
# IMPORTANT: Use the EXACT same filename
# For example, to update the home hero photo:
copy "C:\path\to\your\new-photo.jpg" "assets\img\user\wilson1.jpeg"

# Or for a project diagram:
copy "C:\path\to\diagram.png" "assets\img\projects\retail-demand-architecture.jpg"
```

**Important Notes:**
- Keep the same filename (e.g., `wilson1.jpeg`)
- If you want to use a different filename, update `data/site-config.json` (see Step 5)
- Supported formats: JPG, JPEG, PNG, GIF, WebP
- Recommended max size: 1MB for fast loading

### Step 3: Commit Your Changes

```bash
# Check what files changed
git status

# Add the changed image(s)
git add assets/img/user/wilson1.jpeg
# Or add all images at once:
git add assets/img/

# Commit with a descriptive message
git commit -m "Update hero photo"
```

### Step 4: Push to GitHub

```bash
# Push to GitHub (triggers automatic rebuild)
git push origin master
```

### Step 5: Wait for GitHub Pages to Rebuild

- GitHub Pages automatically rebuilds your site when you push
- This usually takes **1-3 minutes**
- Check your GitHub repository → Settings → Pages to see build status
- Once complete, visit your live site to verify the change

### Step 6: Clear Browser Cache (if needed)

If you still see the old image:
- Hard refresh: **Ctrl + Shift + R** (Windows/Linux) or **Cmd + Shift + R** (Mac)
- Or clear your browser cache completely

## Alternative: Update Image Paths in Config

If you want to use a different filename instead of replacing existing files:

1. Add your new image to `assets/img/user/` (e.g., `my-new-photo.jpg`)

2. Update `data/site-config.json`:
   ```json
   {
     "images": {
       "homeHeroPhoto": "assets/img/user/my-new-photo.jpg",
       "aboutHeroPhoto": "assets/img/user/about-banner.jpg",
       "headshot": "assets/img/user/my-new-photo.jpg"
     }
   }
   ```

3. Commit both the new image and the updated config file

4. Push to GitHub

## The "Change Photo" Button (Local Development Only)

**What it does:**
- Opens your file picker to preview a new image
- Shows the change **only in your current browser**
- **Does NOT save to the repository**
- **Does NOT work across devices**

**When to use it:**
- For **previewing** how a new photo looks before committing it
- Only works when running locally (not on GitHub Pages production)

**What it DOES NOT do:**
- ❌ Does not upload images to GitHub
- ❌ Does not make changes visible on other devices
- ❌ Does not permanently save anything

To make a preview change permanent, follow Steps 1-6 above.

## Quick Reference Commands

```bash
# Navigate to repo
cd C:\Users\USER\Documents\wilson-portfolios-main\wilson-portfolios-main\ds

# Replace an image (example)
copy "C:\Downloads\new-headshot.jpg" "assets\img\user\wilson1.jpeg"

# Commit and push
git add assets/img/
git commit -m "Update portfolio photos"
git push origin master

# Wait 1-3 minutes, then visit your site
```

## Troubleshooting

**"My changes aren't showing on GitHub Pages"**
- Wait 2-3 minutes for the rebuild to complete
- Check GitHub repo → Actions tab for build status
- Hard refresh your browser (Ctrl + Shift + R)
- Check that you pushed to the correct branch (usually `master` or `main`)

**"I want to use a PNG instead of JPG"**
- You can! Just make sure to update the filename in `site-config.json` if needed
- Example: Change `wilson1.jpeg` to `wilson1.png` in the config

**"The image looks distorted or doesn't fit"**
- Resize your image before uploading (recommended dimensions in README.txt)
- For hero images: 800x800px (square) or 1200x800px (landscape)
- For thumbnails: 600x400px

**"I accidentally broke something"**
- Revert your commit: `git revert HEAD`
- Or restore from GitHub: Download the previous version of the file
- Push the reverted changes: `git push origin master`

---

**Remember:** The only way to make photo changes visible across all devices is to update the actual image files in the repository and push to GitHub. Browser-based "Change photo" is for local preview only.
