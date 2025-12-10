/**
 * Photo Editor - Development Tool for Image File Identification
 *
 * IMPORTANT: This is a DEVELOPMENT-ONLY tool, not a production feature.
 *
 * PURPOSE:
 * - Helps you identify which image file to replace in the repo
 * - Shows a temporary preview of your selected image
 * - Provides instructions on making changes permanent
 *
 * PERSISTENCE:
 * - Changes are NOT saved to localStorage or any database
 * - Preview is temporary and only visible in your current browser session
 * - To make changes permanent, you must replace the actual image file in assets/img/
 *   and commit/push to GitHub
 *
 * PRODUCTION BEHAVIOR:
 * - This feature is hidden on the live GitHub Pages site (not localhost)
 * - Only visible when running locally for development
 */

// Image file mapping - maps placeholder IDs to actual file paths
const IMAGE_FILE_MAP = {
  'hero-home-photo': 'assets/img/hero-home.jpg',
  'headshot-photo': 'assets/img/headshot.jpg',
  'hero-about-photo': 'assets/img/hero-about.jpg',
  'batch-medallion-architecture': 'assets/img/batch-medallion-architecture.jpg',
  'batch-medallion-artifact-0': 'assets/img/batch-medallion-artifact-0.jpg',
  'realtime-risk-architecture': 'assets/img/realtime-risk-architecture.jpg',
  'realtime-risk-artifact-0': 'assets/img/realtime-risk-artifact-0.jpg',
  'platform-architecture': 'assets/img/platform-architecture.jpg',
  'platform-artifact-0': 'assets/img/platform-artifact-0.jpg',
  'clean-health-pipeline-architecture': 'assets/img/clean-health-pipeline-architecture.jpg',
  'clean-health-pipeline-artifact-0': 'assets/img/clean-health-pipeline-artifact-0.jpg',
  'template-architecture': 'assets/img/template-architecture.jpg',
  'template-artifact-0': 'assets/img/template-artifact-0.jpg'
};

// Check if running locally (development mode)
function isLocalhost() {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.hostname === '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Only enable in development mode
  if (!isLocalhost()) {
    console.log('Photo editor disabled in production. Run locally to use this feature.');
    return;
  }

  console.log('Photo editor enabled (development mode)');
  console.log('See assets/img/IMAGE-MAP.md for image file mapping');

  initPhotoEditor();
});

function initPhotoEditor() {
  const editablePhotos = document.querySelectorAll('.editable-photo');

  editablePhotos.forEach(container => {
    setupPhotoEditor(container);
  });
}

function setupPhotoEditor(container) {
  const photoId = container.dataset.editablePhotoId;
  if (!photoId) {
    console.warn('Editable photo container missing data-editable-photo-id', container);
    return;
  }

  // Get the corresponding file path
  const filePath = IMAGE_FILE_MAP[photoId];
  if (!filePath) {
    console.warn(`No file mapping found for photo ID: ${photoId}`);
    return;
  }

  // Get references to elements
  const img = container.querySelector('.editable-photo-img');
  const button = container.querySelector('.editable-photo-button');
  const fileInput = container.querySelector('.editable-photo-input');

  if (!img || !button || !fileInput) {
    console.warn('Editable photo container missing required elements', container);
    return;
  }

  // Add tooltip showing which file this corresponds to
  button.title = `Replace: ${filePath}`;

  // Wire up the button to trigger file picker
  button.addEventListener('click', () => {
    fileInput.click();
  });

  // Handle file selection
  fileInput.addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    // Validate it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Create a temporary preview using object URL
    const previewUrl = URL.createObjectURL(file);

    // Update the image preview
    if (img.tagName === 'IMG') {
      img.src = previewUrl;
    } else {
      img.style.backgroundImage = `url(${previewUrl})`;
    }
    img.classList.add('has-photo');

    // Show instructions for making this permanent
    showPersistenceInstructions(photoId, filePath, file);

    // Clear the file input so the same file can be selected again
    fileInput.value = '';
  });
}

function showPersistenceInstructions(photoId, filePath, selectedFile) {
  const instructions = `
┌─────────────────────────────────────────────────────────────┐
│ TEMPORARY PREVIEW ONLY                                      │
├─────────────────────────────────────────────────────────────┤
│ Photo ID: ${photoId}                                        │
│ Target File: ${filePath}                                    │
│ Selected: ${selectedFile.name} (${formatFileSize(selectedFile.size)})
│                                                             │
│ TO MAKE THIS PERMANENT:                                     │
│ 1. Save/export your image as: ${filePath.split('/').pop()}  │
│ 2. Copy it to the ${filePath.substring(0, filePath.lastIndexOf('/'))} folder in your repo
│ 3. Commit and push:                                         │
│    git add ${filePath}                                      │
│    git commit -m "Update ${photoId} image"                  │
│    git push origin main                                     │
│ 4. Wait 1-2 minutes for GitHub Pages to rebuild            │
│ 5. Refresh your live site to see the change                │
│                                                             │
│ See IMAGE-UPDATE.md in the repo root for full instructions │
└─────────────────────────────────────────────────────────────┘
  `.trim();

  console.log('%c' + instructions, 'font-family: monospace; font-size: 11px; color: #4ade80;');

  // Also show a brief notification
  showNotification(`Preview updated! Check console for instructions to make this permanent.`);
}

function showNotification(message) {
  // Create a simple notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid #4ade80;
    color: #e2e8f0;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    max-width: 400px;
    font-size: 14px;
    font-family: 'Manrope', sans-serif;
  `;

  document.body.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.style.transition = 'opacity 0.3s ease';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
