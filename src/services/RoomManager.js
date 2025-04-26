class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> Map<userId, socketId>
  }

  addUser(roomId, userId, socketId) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Map());
    }
    this.rooms.get(roomId).set(userId, socketId);
  }

  removeUser(roomId, userId) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.delete(userId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  getUserSocket(userId) {
    for (const room of this.rooms.values()) {
      const socketId = room.get(userId);
      if (socketId) {
        return socketId;
      }
    }
    return null;
  }

  removeSocket(socketId) {
    const affectedRooms = [];
    for (const [roomId, room] of this.rooms.entries()) {
      for (const [userId, sid] of room.entries()) {
        if (sid === socketId) {
          room.delete(userId);
          if (room.size === 0) {
            this.rooms.delete(roomId);
          }
          affectedRooms.push(roomId);
        }
      }
    }
    return affectedRooms;
  }

  getRoomParticipants(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) return [];
    return Array.from(room.keys());
  }

  getRoomCount(roomId) {
    const room = this.rooms.get(roomId);
    return room ? room.size : 0;
  }
}

module.exports = RoomManager; 