import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Paper,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStateRef from "../utils/useStateRef";
import gameTitles from "../utils/gameTitles";

const styles = {
  tableContainer: {
    maxWidth: "500px",
  },
  gameSelector: {
    width: "20rem",
  },
};

const InsideLobby = () => {
  const [lobby, setLobby] = useState(JSON.parse(localStorage.getItem("lobby")));
  const [player, setPlayer] = useState(
    JSON.parse(localStorage.getItem("player"))
  );
  const [socket, setSocket] = useState(null);
  const [players, setPlayers, playersRef] = useStateRef([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedGameTitle, setSelectedGameTitle] = useState("");
  const imHost = lobby.hostId === player.id;

  useEffect(() => {
    const socket = io("/lobbies");
    setSocket(socket);
    socket.emit("find players of lobby", { lobbyId: lobby.id });
    if (lobby.gameTitle) setSelectedGame(lobby.gameTitle);
    socket.on("find players of lobby", (data) => {
      setPlayers(Object.values(data.players));
    });
    socket.on("player joined", (data) => {
      setPlayers([...playersRef.current, data.player]);
    });
    socket.on("player left lobby", ({ playerId }) => {
      setPlayers(playersRef.current.filter((player) => player.id !== playerId));
    });
    socket.on("lobby deleted", () => {
      localStorage.removeItem("lobby");
      window.location.href = "/lobbies";
    });
    socket.on("start game", ({ game }) => {
      localStorage.setItem("game", JSON.stringify(game));
      window.location.href = `/games/${game.name}/${game.id}`;
    });
    socket.on("game selected", ({ game }) => {
      setSelectedGame(game);
    });
  }, []);

  const handleGameChange = (event) => {
    const value = event.target.value;
    setSelectedGameTitle(value);
    socket.emit("game selected", { game: value, lobbyId: lobby.id });
  };

  const handleDeleteLobby = () => {
    socket.emit("delete lobby", { lobbyId: lobby.id });
  };

  const handleLeaveLobby = () => {
    socket.emit("leave lobby", {
      lobbyId: lobby.id,
      playerId: player.id,
    });
    window.location.href = "/lobbies";
  };

  const handleStartGame = () => {
    socket.emit("start game", {
      lobbyId: lobby.id,
    });
  };

  const handleDevTools = () => {
    console.log(gameTitles);
  };

  return (
    <>
      <Button variant="contained" color="secondary" onClick={handleDevTools}>
        DEV TOOLS
      </Button>
      {!imHost && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLeaveLobby}
        >
          Leave Lobby
        </Button>
      )}
      {imHost && (
        <Button
          variant="contained"
          color="secondary"
          onClick={handleDeleteLobby}
        >
          Delete Lobby
        </Button>
      )}
      {imHost && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleStartGame}
          disabled={
            !selectedGame ||
            !selectedGame.POSSIBLE_PLAYCOUNTS.includes(players.length)
          }
        >
          Start Game
        </Button>
      )}
      <h1>{lobby.name}</h1>
      {imHost ? (
        <FormControl>
          <InputLabel id="select-game-label">Select a Game</InputLabel>
          <Select
            value={selectedGameTitle}
            onChange={handleGameChange}
            labelId="select-game-label"
            style={styles.gameSelector}
          >
            {Object.keys(gameTitles).map((gameKey) => (
              <MenuItem value={gameKey} key={gameKey}>
                {gameTitles[gameKey]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : selectedGame ? (
        <p>{`Game selected: ${selectedGame.title}`}</p>
      ) : (
        <p></p>
      )}
      <TableContainer component={Paper} style={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Players</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id}>
                <TableCell>{player.username}</TableCell>
                <TableCell>{player.id === lobby.hostId && "HOST"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default InsideLobby;
