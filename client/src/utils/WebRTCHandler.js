export class WebRTCHandler {
  constructor() {
    this.peerConnections = {};
    this.localStream = null;
    this.socket = null;
  }

  async initLocalStream() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      return this.localStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  createPeerConnection(userId) {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
      ]
    });

    this.peerConnections[userId] = pc;

    // Add local stream to connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream);
      });
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && this.socket) {
        this.socket.emit('ice-candidate', {
          target: userId,
          candidate: event.candidate
        });
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = new MediaStream();
      event.streams[0].getTracks().forEach(track => {
        remoteStream.addTrack(track);
      });
      this.onRemoteStream(userId, remoteStream);
    };

    return pc;
  }

  async createOffer(userId) {
    const pc = this.createPeerConnection(userId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }

  async handleAnswer(userId, answer) {
    const pc = this.peerConnections[userId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  }

  async handleOffer(userId, offer) {
    const pc = this.createPeerConnection(userId);
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }

  handleIceCandidate(userId, candidate) {
    const pc = this.peerConnections[userId];
    if (pc) {
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  }

  cleanup() {
    Object.values(this.peerConnections).forEach(pc => pc.close());
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
  }
} 