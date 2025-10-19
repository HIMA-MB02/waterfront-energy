// Google Drive Dynamic Document Loader
// Separate folders for each regulatory section

const DRIVE_CONFIG = {
  // You'll need to create a Google Cloud Project and enable Drive API
  // Then create an API key with Drive API access
  API_KEY: 'AIzaSyDlfiARqQ5cjB6C4bnpV_JyZWAYJHfxbdI', // Your API key
  
  // Folder IDs for each section - UPDATE THESE WITH YOUR ACTUAL FOLDER IDs
  FOLDERS: {
    'merc-petitions': '1JzC_9bIeg4fMevUU-zImFlEyCKb_4bga',
    'merc-orders': '1SMjB47r9I8XQ58zh5NtI79olE4Arq8bS',
    'cerc-petitions': '1iZjA5a150ij1bKfC_w4HbmZX-4r8VIlM',
    'cerc-orders': '15ZXIV0fIF897fPgEzA7y7-5Z0JD99RBd'
  }
};

// Detect current page section
function getCurrentSection() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf('/') + 1);
  
  if (filename.includes('merc-petitions')) return 'merc-petitions';
  if (filename.includes('merc-orders')) return 'merc-orders';
  if (filename.includes('cerc-petitions')) return 'cerc-petitions';
  if (filename.includes('cerc-orders')) return 'cerc-orders';
  
  return null;
}

// Get folder ID for current section
function getFolderId() {
  const section = getCurrentSection();
  return section ? DRIVE_CONFIG.FOLDERS[section] : null;
}

// Format file size
function formatFileSize(bytes) {
  if (!bytes) return 'N/A';
  const kb = bytes / 1024;
  const mb = kb / 1024;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${kb.toFixed(0)} KB`;
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

// Determine document icon based on section
function getDocumentIcon() {
  const section = getCurrentSection();
  if (section && section.includes('orders')) return '⚖️';
  return '📄';
}

// Get status badge based on file properties
function getStatusBadge(file) {
  const daysOld = (Date.now() - new Date(file.modifiedTime)) / (1000 * 60 * 60 * 24);
  
  if (daysOld < 30) {
    return '<span class="document-badge">New</span>';
  } else if (file.name.toLowerCase().includes('pending')) {
    return '<span class="document-badge">Pending</span>';
  } else if (file.name.toLowerCase().includes('approved')) {
    return '<span class="document-badge">Approved</span>';
  }
  return '';
}

// Extract case number from filename (if present)
function extractCaseNumber(fileName) {
  const match = fileName.match(/(?:case|order)[\s-]*(?:no\.?)?[\s-]*([A-Z0-9\/\-]+)/i);
  return match ? match[1] : 'N/A';
}

// Remove case number from filename for clean display
function getCleanTitle(fileName) {
  // Remove .pdf extension
  let title = fileName.replace(/\.pdf$/i, '');
  
  // Remove case/order number patterns
  title = title.replace(/[\s-]*(?:case|order)[\s-]*(?:no\.?)?[\s-]*[A-Z0-9\/\-]+$/i, '');
  
  // Remove trailing dashes or spaces
  title = title.replace(/[\s-]+$/, '');
  
  return title;
}

// Create document row HTML
function createDocumentRow(file) {
  const icon = getDocumentIcon();
  const badge = getStatusBadge(file);
  const caseNumber = extractCaseNumber(file.name);
  const title = getCleanTitle(file.name);
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${file.id}`;
  
  return `
    <div class="document-row">
      <div class="document-info">
        <div class="document-title">
          <span class="document-icon">${icon}</span>
          ${title}
          ${badge}
        </div>
        <div class="document-meta">
          <span>📅 ${formatDate(file.modifiedTime)}</span>
          <span>📎 PDF - ${formatFileSize(file.size)}</span>
          <span>🔖 Case No: ${caseNumber}</span>
        </div>
      </div>
      <div class="document-actions">
        <a href="${downloadUrl}" class="btn-download" download>⬇ Download</a>
      </div>
    </div>
  `;
}

// Fetch files from Google Drive
async function fetchDriveFiles() {
  try {
    const folderId = getFolderId();
    
    if (!folderId) {
      console.error('No folder ID configured for this page');
      return null;
    }
    
    if (folderId.startsWith('YOUR_')) {
      console.warn('Folder ID not configured. Please update drive-loader.js with actual folder IDs.');
      return null;
    }
    
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${DRIVE_CONFIG.API_KEY}&fields=files(id,name,mimeType,size,modifiedTime)&orderBy=modifiedTime desc`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Drive API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching Drive files:', error);
    return null;
  }
}

// Create skeleton loader HTML
function createSkeletonLoader(count = 3) {
  let skeletons = '';
  for (let i = 0; i < count; i++) {
    skeletons += `
      <div class="skeleton-row">
        <div class="skeleton-content">
          <div class="skeleton-title">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text title"></div>
          </div>
          <div class="skeleton-meta">
            <div class="skeleton-text short"></div>
            <div class="skeleton-text short"></div>
            <div class="skeleton-text short"></div>
          </div>
        </div>
        <div class="skeleton-button"></div>
      </div>
    `;
  }
  return `<div class="skeleton-loader">${skeletons}</div>`;
}

// Load documents for current page
async function loadDocuments() {
  const documentList = document.querySelector('.document-list');
  
  if (!documentList) return;
  
  // Show skeleton loading state
  documentList.innerHTML = createSkeletonLoader(3);
  
  // Fetch files from Drive
  const files = await fetchDriveFiles();
  
  if (!files) {
    documentList.innerHTML = `
      <div class="coming-soon">
        <h3 style="margin-bottom: 1rem; color: var(--text-dark);">⚠️ Unable to Load Documents</h3>
        <p>Please check the API key and folder ID configuration or try again later.</p>
      </div>
    `;
    return;
  }
  
  // Filter PDF files only
  const pdfFiles = files.filter(file => 
    file.mimeType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  );
  
  if (pdfFiles.length === 0) {
    documentList.innerHTML = `
      <div class="coming-soon">
        <h3 style="margin-bottom: 1rem; color: var(--text-dark);">📄 No Documents Available</h3>
        <p>No documents have been uploaded yet. Please check back later.</p>
      </div>
    `;
    return;
  }
  
  // Generate HTML for each file
  const html = pdfFiles.map(file => createDocumentRow(file)).join('');
  
  documentList.innerHTML = html;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadDocuments);
} else {
  loadDocuments();
}

