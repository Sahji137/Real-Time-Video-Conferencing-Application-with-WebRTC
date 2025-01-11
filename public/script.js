const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const chatBox = document.getElementById('chat-box');
const muteButton = document.getElementById('mute');
const stopVideoButton = document.getElementById('stop-video');
const sendMessageButton = document.getElementById('send-message');
const chatMessageInput = document.getElementById('chat-message');

(async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

  // Create video element for the local user
  const localVideo = document.createElement('video');
  localVideo.srcObject = localStream;
  localVideo.autoplay = true;
  localVideo.muted = true; // Mute own audio to avoid feedback
  localVideo.id = 'local-video'; // Add an ID for managing video boxes
  videoGrid.append(localVideo);

  const peers = {}; // Store peer connections
  const roomId = 'music-room'; // Room name to join
  socket.emit('join-room', roomId); // Join the room

  // Handle when a user connects
  socket.on('user-connected', (userId) => {
    console.log('User connected:', userId);

    const peerConnection = createPeerConnection(userId);

    // Create an offer and send it to the other user
    peerConnection.createOffer().then((offer) => {
      console.log('Sending offer to user:', userId);
      return peerConnection.setLocalDescription(offer);
    }).then(() => {
      socket.emit('signal', { target: userId, signal: peerConnection.localDescription });
    }).catch((error) => {
      console.error('Error creating offer:', error);
    });
  });

  // Handle the reception of a signal (offer, answer, ICE candidate)
  socket.on('signal', (data) => {
    const { signal, from } = data;

    if (!peers[from]) {
      console.log('Creating peer connection for user:', from);
      createPeerConnection(from);
    }

    if (signal.candidate) {
      console.log('Received ICE candidate from user:', from);
      peers[from].addIceCandidate(new RTCIceCandidate(signal)).catch((error) => {
        console.error('Error adding ICE candidate:', error);
      });
    }

    if (signal.type === 'offer') {
      console.log('Received offer from user:', from);
      peers[from].setRemoteDescription(new RTCSessionDescription(signal)).then(() => {
        return peers[from].createAnswer();
      }).then((answer) => {
        return peers[from].setLocalDescription(answer);
      }).then(() => {
        socket.emit('signal', { target: from, signal: peers[from].localDescription });
      }).catch((error) => {
        console.error('Error handling offer:', error);
      });
    }

    if (signal.type === 'answer') {
      console.log('Received answer from user:', from);
      peers[from].setRemoteDescription(new RTCSessionDescription(signal)).catch((error) => {
        console.error('Error handling answer:', error);
      });
    }
  });

  // Remove video box on user disconnection
  socket.on('user-disconnected', (userId) => {
    console.log('User disconnected:', userId);
    if (peers[userId]) {
      peers[userId].close();
      delete peers[userId];
    }
    const videoElement = document.getElementById(`video-${userId}`);
    if (videoElement) {
      videoElement.remove();
    }
  });

  // Mute/unmute audio
  muteButton.onclick = () => {
    localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled;
  };

  // Stop/start video
  stopVideoButton.onclick = () => {
    localStream.getVideoTracks()[0].enabled = !localStream.getVideoTracks()[0].enabled;
  };

  // Send chat message
  sendMessageButton.onclick = () => {
    const message = chatMessageInput.value.trim();
    if (message !== '') {
      chatBox.innerHTML += `<p><b>You:</b> ${message}</p>`;
      chatMessageInput.value = '';
      socket.emit('chat', message); // Emit the message to the server
    }
  };

  // Receive chat message
  socket.on('chat', (data) => {
    const { message, userId } = data;
    chatBox.innerHTML += `<p><b>${userId}:</b> ${message}</p>`;
  });

  // Helper function to create and configure a new peer connection
  function createPeerConnection(userId) {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    // Handle remote track and ensure only one video box per user
    peerConnection.ontrack = (event) => {
      console.log('Received remote stream from user:', userId);

      // Check if the video element already exists
      let video = document.getElementById(`video-${userId}`);
      if (!video) {
        video = document.createElement('video');
        video.id = `video-${userId}`;
        video.srcObject = event.streams[0];
        video.autoplay = true;
        videoGrid.append(video);
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate to user:', userId);
        socket.emit('signal', { target: userId, signal: event.candidate });
      }
    };

    peers[userId] = peerConnection; // Store the peer connection
    return peerConnection;
  }
})();
