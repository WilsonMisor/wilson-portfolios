# How to Change Photos on Your Portfolio

## Quick Start

1. **Open your portfolio** in a web browser (locally or on the web)
2. **Hover over any photo** - you'll see a camera icon (📷) appear
3. **Click "Change photo"** button that appears in the bottom-right corner
4. **Select an image** from your computer's file explorer
5. **Done!** The image updates immediately and persists across page refreshes

## What Images Can You Change?

You can change the following images:

### Home Page (index.html)
- Hero/profile photo (main landing page image)
- Contact section headshot

### About Page (about.html)
- Hero banner image

### Project Pages
- Architecture diagrams for each project
- Project artifact images (screenshots, mockups, etc.)

## Two Ways to Update Images

### Option 1: Upload from Computer (Recommended)
1. Hover over the image
2. Click **"Change photo"**
3. Select an image file from your computer
4. Maximum file size: 5MB
5. Supported formats: JPG, PNG, GIF, WebP, SVG

### Option 2: Use Image URL
1. Hover over the image
2. Click **"Use URL"**
3. Enter a direct image URL (must end in .jpg, .png, etc.)
4. The image will load from that URL

## How It Works

- **No Server Needed**: Images are stored in your browser's localStorage
- **Persistent**: Your changes persist across page refreshes
- **Local Only**: Changes are saved only in your browser (not on the server)
- **Safe**: No files are uploaded to the web; they stay on your computer

## Important Notes

### For Local Development
- Images you upload are converted to data URLs and stored in localStorage
- This means they persist as long as you don't clear your browser data
- Each browser stores its own copy (Chrome, Firefox, etc. won't share changes)

### For Publishing
- To permanently add images to your website, place them in `assets/img/user/`
- Then update the `data/site-config.json` file with the correct paths
- Or use the Admin panel (admin.html) to manage images and export settings

### File Size Limits
- Maximum 5MB per image
- Large images may slow down your browser
- For best performance, resize images to appropriate dimensions before uploading

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript to be enabled
- Uses HTML5 FileReader API (supported by all modern browsers)

## Troubleshooting

**Image doesn't appear after selecting?**
- Check browser console for errors (F12 → Console tab)
- Make sure the file is a valid image format
- Try a smaller image (under 1MB)

**Changes disappear after refresh?**
- Check if you're in incognito/private mode (doesn't save localStorage)
- Make sure cookies/site data aren't being cleared

**Can't see the "Change photo" button?**
- Make sure you're hovering directly over the image
- Try enabling Edit Mode (click "Edit" button in footer, or press Ctrl+Shift+E)

**Want to reset an image to default?**
- Open browser console (F12)
- Type: `localStorage.clear()` and press Enter
- Refresh the page

## Advanced: Edit Mode

For more control, enable **Edit Mode**:
- Click the **"Edit"** button in the footer, or
- Press **Ctrl + Shift + E**

In Edit Mode:
- All editable elements show outlines
- Change photo buttons are always visible (no need to hover)
- You can also edit text and links inline

## Exporting Your Changes

Use the **Admin Panel** (admin.html) to:
- Export all your changes as a JSON file
- Import changes from another browser
- Update the site configuration permanently

---

**Need Help?** Check the main README.md or open an issue on GitHub.
