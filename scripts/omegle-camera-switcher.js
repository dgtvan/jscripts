// Save the original getUserMedia (properly bound)
if (!navigator.mediaDevices.__originalGetUserMedia__) {
    navigator.mediaDevices.__originalGetUserMedia__ = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  }
  
  (async () => {
    // List available cameras
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
  
    console.log('Available Cameras:', cameras);
  
    if (cameras.length < 2) {
      console.warn('No alternative camera found.');
      return;
    }
  
    const selectedCameraId = prompt(
      'Select camera:\n' + cameras.map((cam, index) => `${index + 1}: ${cam.label}`).join('\n'),
      1
    );
  
    if (!selectedCameraId || isNaN(selectedCameraId) || selectedCameraId < 1 || selectedCameraId > cameras.length) {
      console.warn('Invalid selection');
      return;
    }
  
    const deviceId = cameras[selectedCameraId - 1].deviceId;
  
    // Override getUserMedia to force the selected camera
    navigator.mediaDevices.getUserMedia = async (constraints) => {
      console.log(`Overriding camera with deviceId: ${deviceId}`);
      if (constraints.video === true) {
        constraints.video = { deviceId: { exact: deviceId } };
      } else if (typeof constraints.video === 'object') {
        constraints.video.deviceId = { exact: deviceId };
      }
      return navigator.mediaDevices.__originalGetUserMedia__(constraints);
    };
  
    console.log(`Camera overridden. Agora-SDK (or any other WebRTC app) will now use: ${cameras[selectedCameraId - 1].label}`);
  })();
  