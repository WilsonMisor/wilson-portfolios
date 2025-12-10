# Photo Preview Feature (Local Development Only)

## ⚠️ IMPORTANT: This Feature Does NOT Work on GitHub Pages

**The browser-based photo editor is for LOCAL PREVIEW ONLY.**

- ❌ **Does NOT save changes to GitHub**
- ❌ **Does NOT persist across devices**
- ❌ **Does NOT work on the live site (GitHub Pages)**
- ✅ **Only for previewing how a new photo looks before committing it**

**To permanently change photos visible on all devices, see [IMAGE-UPDATE.md](IMAGE-UPDATE.md)**

---

## How the Preview Feature Works (Local Development)

When running the site **locally** (http://localhost or file://):

## What Images Can You Preview?

When running locally, you can preview changes to:

### Home Page (index.html)
- Hero/profile photo (main landing page image)
- Contact section headshot

### About Page (about.html)
- Hero banner image

### Project Pages
- Architecture diagrams for each project
- Project artifact images (screenshots, mockups, etc.)

## How to Preview Images Locally

### Step 1: Run the Site Locally
```bash
cd C:\Users\USER\Documents\wilson-portfolios-main\wilson-portfolios-main\ds
python -m http.server 8000
# Then open http://localhost:8000
```

### Step 2: Preview a Photo
1. Hover over the image
2. Click **"Preview Photo"** button
3. Select an image file from your computer
4. The preview appears immediately in your browser

**Remember:** This is a PREVIEW only. Changes disappear when you close the browser tab.

## How It Works

- **Preview Only**: Changes are stored in sessionStorage (temporary memory)
- **Not Persistent**: Preview disappears when you close the tab
- **Local Only**: Only works when running the site locally
- **Disabled on Production**: The feature is completely disabled on GitHub Pages

## To Permanently Change Photos

**The preview feature CANNOT save changes permanently.**

To make photos visible on all devices and on GitHub Pages:

1. **See [IMAGE-UPDATE.md](IMAGE-UPDATE.md)** for complete instructions
2. **Summary:**
   - Replace the actual image file in `assets/img/user/` or `assets/img/projects/`
   - Commit and push to GitHub
   - Wait for GitHub Pages to rebuild (1-3 minutes)

### Production (GitHub Pages)
- **Photo editing is completely disabled** on the live site
- Visitors cannot change photos
- Only the repository owner can change photos by updating files in GitHub

## Troubleshooting

**"I don't see the Preview Photo button on GitHub Pages"**
- This is correct! The feature is disabled on production (GitHub Pages)
- It only works when running locally
- To change photos on the live site, see IMAGE-UPDATE.md

**"My preview disappeared after closing the tab"**
- This is expected behavior. Previews use sessionStorage (temporary)
- To make changes permanent, update the actual image files in the repository

**"I want to permanently change a photo"**
- See [IMAGE-UPDATE.md](IMAGE-UPDATE.md) for step-by-step instructions
- You must replace the image file in the repository and push to GitHub

## Summary

**The browser photo editor is NOT a real photo uploader.**

| What It Does | What It Does NOT Do |
|-------------|---------------------|
| ✅ Preview how a new photo looks | ❌ Upload to GitHub |
| ✅ Work when running locally | ❌ Work on GitHub Pages production |
| ✅ Help you test before committing | ❌ Save across devices |
| ✅ Use sessionStorage (temporary) | ❌ Persist after closing tab |

**For permanent photo changes → See [IMAGE-UPDATE.md](IMAGE-UPDATE.md)**

---

**Need Help?**
- Permanent changes: See [IMAGE-UPDATE.md](IMAGE-UPDATE.md)
- General questions: Check the main [README.md](README.md)
