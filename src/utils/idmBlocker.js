/**
 * IDM Blocker Utility
 * Prevents Internet Download Manager from working on the website
 */

// Detect if IDM is being used
export const detectIDM = () => {
  // Check for common IDM objects
  if (window.external && window.external.IDMIntegrator) {
    return true;
  }
  
  // Check for IDM browser extension
  const idmExtensions = [
    'chrome-extension://ngpampappnmepgilojfohadhhmbhlaek',
    'chrome-extension://ehoagldboehmagcnpcfgjdpkoekoojpj',
    'chrome-extension://opajhajddbjbiodpfppiflphmgdicohm',
    'chrome-extension://nlbejmccbhkncgokjcmghpfloaajcffj',
    'moz-extension://idm-integration'
  ];
  
  for (let ext of idmExtensions) {
    if (document.querySelector(`link[href*="${ext}"]`)) {
      return true;
    }
  }
  
  // Check for IDM specific behaviors
  try {
    const idmCheck = document.createElement('div');
    idmCheck.setAttribute('id', 'idm-content-notification');
    document.body.appendChild(idmCheck);
    
    const hasIDM = window.getComputedStyle(idmCheck).display === 'none';
    document.body.removeChild(idmCheck);
    
    if (hasIDM) {
      return true;
    }
  } catch (e) {
    console.error("Error checking for IDM:", e);
  }
  
  return false;
};

// Show blocking message
export const showIDMBlockMessage = () => {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
  overlay.style.zIndex = '999999';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.color = 'white';
  overlay.style.fontSize = '18px';
  overlay.style.padding = '20px';
  overlay.style.textAlign = 'center';
  overlay.style.fontFamily = "'Cairo', 'Tajawal', sans-serif";
  
  // Add content
  overlay.innerHTML = `
    <div style="max-width: 500px;">
      <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
      <h2 style="font-size: 24px; margin-bottom: 15px;">برنامج التحميل غير مسموح به</h2>
      <p style="margin-bottom: 20px;">
        يرجى تعطيل Internet Download Manager للاستمرار في استخدام الموقع.
        <br><br>
        Please disable Internet Download Manager to continue using this website.
      </p>
      <button id="idm-close-message" style="
        background-color: #3b82f6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
      ">فهمت / I Understand</button>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(overlay);
  
  // Add close button functionality
  document.getElementById('idm-close-message').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  
  return overlay;
};

// Protect video elements
export const protectVideoElements = () => {
  // Find all video elements
  const videos = document.querySelectorAll('video');
  
  videos.forEach(video => {
    // Disable right-click
    video.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    // Add protection attributes
    video.setAttribute('controlslist', 'nodownload');
    video.setAttribute('disablepictureinpicture', 'true');
    
    // Encrypt source if possible
    if (video.src) {
      const originalSrc = video.src;
      video.removeAttribute('src');
      
      // Create blob URL instead of direct link
      fetch(originalSrc)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          video.src = blobUrl;
        })
        .catch(err => {
          console.error("Error protecting video:", err);
          video.src = originalSrc; // Fallback
        });
    }
  });
};

// Initialize IDM blocking
export const initIDMBlocker = () => {
  // Check if IDM is present
  if (detectIDM()) {
    showIDMBlockMessage();
    return true;
  }
  
  // Protect videos anyway
  protectVideoElements();
  
  // Set up mutation observer to check for dynamically added videos
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length) {
        shouldCheck = true;
      }
    });
    
    if (shouldCheck) {
      protectVideoElements();
      if (detectIDM()) {
        showIDMBlockMessage();
        observer.disconnect();
      }
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  return false;
};

export default initIDMBlocker; 