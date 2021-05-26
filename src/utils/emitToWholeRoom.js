module.exports = (socket, roomId, eventName, data) => {
  socket.emit(eventName, data);
  socket.to(roomId).emit(eventName, data);
}