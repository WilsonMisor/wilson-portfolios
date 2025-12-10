# Image File Mapping

This document maps each photo placeholder ID to its corresponding image file in the repository.

## Directory Structure

All editable site images are stored in `assets/img/` with predictable filenames.

## Image Mapping

| Page/Section | Placeholder ID | Image File Path | Description |
|-------------|----------------|-----------------|-------------|
| Home Page | `hero-home-photo` | `assets/img/hero-home.jpg` | Main hero/profile photo on home page |
| Home Page | `headshot-photo` | `assets/img/headshot.jpg` | Headshot in contact section |
| About Page | `hero-about-photo` | `assets/img/hero-about.jpg` | Wide hero banner on about page |
| Batch Medallion | `batch-medallion-architecture` | `assets/img/batch-medallion-architecture.jpg` | Architecture diagram |
| Batch Medallion | `batch-medallion-artifact-0` | `assets/img/batch-medallion-artifact-0.jpg` | Medallion layer diagram |
| Realtime Risk | `realtime-risk-architecture` | `assets/img/realtime-risk-architecture.jpg` | Architecture diagram |
| Realtime Risk | `realtime-risk-artifact-0` | `assets/img/realtime-risk-artifact-0.jpg` | Streaming flow diagram |
| Platform | `platform-architecture` | `assets/img/platform-architecture.jpg` | Architecture diagram |
| Platform | `platform-artifact-0` | `assets/img/platform-artifact-0.jpg` | Platform compose layout |
| Clean Health | `clean-health-pipeline-architecture` | `assets/img/clean-health-pipeline-architecture.jpg` | Architecture diagram |
| Clean Health | `clean-health-pipeline-artifact-0` | `assets/img/clean-health-pipeline-artifact-0.jpg` | Pipeline DAG screenshot |
| Template | `template-architecture` | `assets/img/template-architecture.jpg` | Template architecture diagram |
| Template | `template-artifact-0` | `assets/img/template-artifact-0.jpg` | Template artifact image |

## How to Update Images

1. **Prepare your image**: Resize and optimize your image file (recommended: JPG or PNG, under 500KB)
2. **Name it correctly**: Use the exact filename from the "Image File Path" column above
3. **Replace the file**: Copy your image to `assets/img/` folder, replacing the existing file
4. **Commit and push**:
   ```bash
   git add assets/img/your-image-name.jpg
   git commit -m "Update [description] image"
   git push origin main
   ```
5. **Wait for deployment**: GitHub Pages will rebuild (usually 1-2 minutes)
6. **Verify**: Visit your live site and confirm the image updated

## Image Guidelines

- **Format**: JPG for photos, PNG for diagrams with transparency
- **Size**: Keep under 500KB for fast loading
- **Dimensions**:
  - Hero photos: 800x600px or similar landscape
  - Headshot: 400x400px square
  - Architecture diagrams: 1200x600px or similar wide format
  - Artifact images: 800x600px
- **Quality**: Use 80-85% JPEG quality for good balance

## Development Mode

When running locally (localhost), the "Change photo" button helps you identify which file to replace:
- Click the button and select a preview image
- A console message will tell you which file in `assets/img/` to replace
- The preview only shows in your browser temporarily
- To make it permanent, follow the steps above to replace the actual file
