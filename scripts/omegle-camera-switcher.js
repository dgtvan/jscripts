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

// Function to create and insert the dropdown
function createAndInsertDropdown() {
  // If dropdown already exists and is in the document, do nothing
  if (dropdownContainer && document.contains(dropdownContainer)) {
    return;
  }

  // Create and style the dropdown container
  dropdownContainer = document.createElement('div');
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
  `;

  // Add camera options
  cameras.forEach((camera, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.text = camera.label || `Camera ${index + 1}`;
    select.appendChild(option);
  });

  // Find the Store button container and insert before it
  const actionDiv = document.querySelector('.actions') || document.querySelector('.action');
  if (actionDiv) {
    const storeButton = actionDiv.querySelector('.btn-gold');
    if (storeButton) {
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
  createAndInsertDropdown();

  // Set up interval to check and recreate dropdown if needed
  setInterval(() => {
    createAndInsertDropdown();
  }, 1000); // Check every second
})();
  