const socket = io("/lobbies");

socket.on("connect", () => {
  socket.emit("find all");
});

const addLobbyToHtml = (lobby) => {
  const htmlContent = `<tr id="${lobby.id}">
  <td>${lobby.name}</td>
  <td>${Object.keys(lobby.players).length}</td>
  <td>
  <button onClick="joinLobby('${lobby.id}')">Join</button>
  </td>
  </tr>`;
  var tableRef = document.getElementById('lobbiesTable').getElementsByTagName('tbody')[0];
  var newRow = tableRef.insertRow(tableRef.rows.length);
  newRow.innerHTML = htmlContent;
}

socket.on("find all", (data) => {
  const lobbies = data.lobbies;
  for (const lobby of lobbies) {
    addLobbyToHtml(lobby);
  }
  localStorage.setItem("lobbies", JSON.stringify(lobbies));
});

socket.on("new lobby", (data) => {
  const lobby = data.lobby;
  console.log(`New Lobby: ${lobby.name}`)
  addLobbyToHtml(lobby);
});

socket.on("create lobby", (data) => {
  localStorage.setItem("lobby", JSON.stringify(data.lobby));
  window.location.href = `/lobbies/${data.lobby.id}`
});

const createLobby = () => {
  const name = prompt("Please enter a lobby name");
  if (!name) return;
  const player = JSON.parse(localStorage.getItem("player"));
  socket.emit("create lobby", {
    name,
    host: player,
  });
}

const joinLobby = (lobbyId) => {
  socket.emit("join lobby", {
    player: JSON.parse(localStorage.getItem("player")),
    lobbyId,
  });
}

socket.on("join lobby", (data) => {
  const lobby = data.lobby;
  localStorage.setItem("lobby", JSON.stringify(lobby));
  window.location.href = `/lobbies/${data.lobby.id}`;
})
