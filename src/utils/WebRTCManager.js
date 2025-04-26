export default class WebRTCManager {
  constructor(userId) {
    this.userId = userId;
    this.peers = {};
    this.socket = null;
    this.localStream = null;
  }

  async init(socket, classroomId) {
    this.socket = socket;
    this.classroomId = classroomId;

    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Setup socket listeners
      this.setupSocketListeners();
      return this.localStream;
    } catch (error) {
      console.error('Error getting media devices:', error);
      throw error;
    }
  }

  setupSocketListeners() {
    this.socket.on('existing-participants', participants => {
      participants.forEach(participant => {
        if (participant.user_id !== this.userId) {
          this.createPeer(participant.user_id, true);
        }
      });
    });

    this.socket.on('user-joined', ({ user_id }) => {
      if (user_id !== this.userId) {
        this.createPeer(user_id, true);
      }
    });

    this.socket.on('webrtc-offer', async ({ offer, from }) => {
      const peer = this.createPeer(from, false);
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      
      this.socket.emit('webrtc-answer', {
        answer,
        to: from,
        classroom_id: this.classroomId
      });
    });

    this.socket.on('webrtc-answer', async ({ answer, from }) => {
      const peer = this.peers[from];
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    this.socket.on('ice-candidate', ({ candidate, from }) => {
      const peer = this.peers[from];
      if (peer && candidate) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });
  }

  createPeer(userId, isInitiator) {
    if (this.peers[userId]) return this.peers[userId];

    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream to peer
    this.localStream.getTracks().forEach(track => {
      peer.addTrack(track, this.localStream);
    });

    // Handle ICE candidates
    peer.onicecandidate = ({ candidate }) => {
      if (candidate) {
        this.socket.emit('ice-candidate', {
          candidate,
          to: userId,
          classroom_id: this.classroomId
        });
      }
    };

    // Handle remote stream
    peer.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.onRemoteStream(userId, remoteStream);
    };

    this.peers[userId] = peer;

    if (isInitiator) {
      this.createOffer(userId);
    }

    return peer;
  }

  async createOffer(userId) {
    const peer = this.peers[userId];
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    
    this.socket.emit('webrtc-offer', {
      offer,
      to: userId,
      classroom_id: this.classroomId
    });
  }

  cleanup() {
    Object.keys(this.peers).forEach(userId => {
      this.peers[userId].close();
    });
    this.peers = {};

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    if (this.socket) {
      this.socket.off('existing-participants');
      this.socket.off('user-joined');
      this.socket.off('webrtc-offer');
      this.socket.off('webrtc-answer');
      this.socket.off('ice-candidate');
    }
  }
} 