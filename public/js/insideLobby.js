const socket = io("/lobbies");

const lobby = JSON.parse(localStorage.getItem("lobby"));
const player = JSON.parse(localStorage.getItem("player"));
let imHost = false;
document.getElementById("header").innerHTML = lobby.name;
if (lobby.hostId === player.id) {
  imHost = true;
  document.getElementById("deleteLobbyButton").style.display = "block";
  document.getElementById("startGameButton").style.display = "block";
} else {
  document.getElementById("leaveLobbyButton").style.display = "block";
}


socket.emit("find players of lobby", { lobbyId: lobby.id });

const addPlayerToHtml = (player) => {
  const htmlContent = `<td>${player.username}</td>`;
  var tableRef = document.getElementById('playersTable').getElementsByTagName('tbody')[0];
  var newRow = tableRef.insertRow(tableRef.rows.length);
  newRow.id = player.id
  newRow.innerHTML = htmlContent;
}

socket.on("find players of lobby", (data) => {
  for (const player of Object.values(data.players)) {
    addPlayerToHtml(player);
  }
});

socket.on("player joined", (data) => {
  addPlayerToHtml(data.player);
});

const leaveLobby = () => {
  socket.emit("leave lobby", {
    lobbyId: lobby.id,
    playerId: player.id,
  });
  window.location.href = "/lobbies";
}

socket.on("player left lobby", ({ playerId }) => {
  console.log(document.getElementById(playerId));
  document.getElementById(playerId).outerHTML = "";
});

const deleteLobby = () => {
  socket.emit("delete lobby", { lobbyId: lobby.id });
}

socket.on("lobby deleted", () => {
  localStorage.removeItem("lobby");
  window.location.href = "/lobbies";
});

const startGame = () => {
  const selectedGame = document.getElementById("gameTitle").value;
  socket.emit("start game", { lobbyId: lobby.id, selectedGame });
}

socket.on("start game", ({ game }) => {
  localStorage.setItem("game", JSON.stringify(game));
  window.location.href = `/games/${game.name}/${game.id}`;
});