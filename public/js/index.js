const socket = io("/lobbies");

const createPlayer = () => {
  const username = document.getElementById("username").value;
  socket.emit("create player", { username });
  return false;
}

socket.on("create player", (data) => {
  localStorage.setItem("player", JSON.stringify(data.player));
  window.location.href = "/lobbies";
});
