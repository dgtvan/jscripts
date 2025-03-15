//**************************************
// Camera switcher
//**************************************

// Save the original getUserMedia (properly bound)
if (!navigator.mediaDevices.__originalGetUserMedia__) {
  navigator.mediaDevices.__originalGetUserMedia__ = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
}

let selectedDeviceId = null;
let dropdownContainer = null;
let cameras = [];
let isCreatingDropdown = false; // Lock to prevent concurrent creation

// Override getUserMedia immediately
navigator.mediaDevices.getUserMedia = async (constraints) => {
  if (selectedDeviceId && constraints.video) {
    if (constraints.video === true) {
      constraints.video = { deviceId: { exact: selectedDeviceId } };
    } else if (typeof constraints.video === 'object') {
      constraints.video.deviceId = { exact: selectedDeviceId };
    }
  }
  return navigator.mediaDevices.__originalGetUserMedia__(constraints);
};

// Function to test if a camera is usable
async function testCamera(deviceId) {
  try {
    const stream = await navigator.mediaDevices.__originalGetUserMedia__({
      video: { deviceId: { exact: deviceId } }
    });
    // Stop all tracks to release the camera
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.warn(`Camera test failed for device ${deviceId}:`, error);
    return false;
  }
}

// Function to find existing dropdown
function findExistingDropdown() {
  return document.querySelector('#omegle-camera-switcher');
}

// Function to create and insert the dropdown
async function createAndInsertDropdown() {
  // Check if dropdown already exists or if creation is in progress
  if (isCreatingDropdown || findExistingDropdown()) {
    return;
  }

  try {
    isCreatingDropdown = true;

    // Create and style the dropdown container
    dropdownContainer = document.createElement('div');
    dropdownContainer.id = 'omegle-camera-switcher';
    dropdownContainer.style.cssText = `
      display: inline-block;
      margin-right: 10px;
    `;

    // Create the select element with matching style
    const select = document.createElement('select');
    select.style.cssText = `
      padding: 8px 12px;
      border-radius: 20px;
      border: 1px solid #e0e0e0;
      background: white;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      outline: none;
      min-width: 200px;
    `;

    // Add camera options with status check
    for (let i = 0; i < cameras.length; i++) {
      const camera = cameras[i];
      const isUsable = await testCamera(camera.deviceId);
      const option = document.createElement('option');
      option.value = i;
      option.text = `${camera.label || `Camera ${i + 1}`} [${isUsable ? '✓ Ready' : '✗ Not Available'}]`;
      if (!isUsable) {
        option.style.color = '#999';
      }
      select.appendChild(option);
    }

    // Find the Store button container and insert before it
    const actionDiv = document.querySelector('.actions') || document.querySelector('.action');
    if (actionDiv) {
      const storeButton = actionDiv.querySelector('.btn-gold');
      if (storeButton) {
        // Remove any existing dropdown first
        const existingDropdown = findExistingDropdown();
        if (existingDropdown) {
          existingDropdown.remove();
        }

        // Insert the dropdown before the Store button
        actionDiv.insertBefore(dropdownContainer, storeButton);
        dropdownContainer.appendChild(select);

        // Handle camera selection change
        select.addEventListener('change', (event) => {
          selectedDeviceId = cameras[event.target.value].deviceId;
          console.log(`Camera selection changed. Will now use: ${cameras[event.target.value].label}`);
        });

        // Set the current selection
        if (selectedDeviceId) {
          const selectedIndex = cameras.findIndex(cam => cam.deviceId === selectedDeviceId);
          if (selectedIndex !== -1) {
            select.selectedIndex = selectedIndex;
          }
        }
      }
    }
  } finally {
    isCreatingDropdown = false;
  }
}

(async () => {
  // List available cameras
  const devices = await navigator.mediaDevices.enumerateDevices();
  cameras = devices.filter(device => device.kind === 'videoinput');

  console.log('Available Cameras:', cameras);

  if (cameras.length < 2) {
    console.warn('No alternative camera found.');
    return;
  }

  // Set the first camera as default
  selectedDeviceId = cameras[0].deviceId;

  // Create initial dropdown
  await createAndInsertDropdown();

  // Set up interval to check and recreate dropdown if needed
  setInterval(async () => {
    const existingDropdown = findExistingDropdown();
    const actionDiv = document.querySelector('.actions') || document.querySelector('.action');
    
    // Only recreate if the dropdown is missing AND the action div exists
    if (!existingDropdown && actionDiv) {
      await createAndInsertDropdown().catch(console.error);
    }
  }, 1000); // Check every second
})();
  