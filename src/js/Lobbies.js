import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import useStateRef from '../utils/useStateRef';

const styles = {
  tableContainer: {
    maxWidth: "500px",
  },
}

export default () => {
  const [socket, setSocket] = useState(undefined);
  const [lobbies, setLobbies, lobbiesRef] = useStateRef([]);

  useEffect(() => {
    const socket = io("/lobbies");
    setSocket(socket);

    socket.on("connect", () => {
      socket.emit("find all");
    });

    socket.on("find all", (data) => {
      const lobbies = data.lobbies;
      for (const lobby of lobbies) {
        setLobbies([...lobbiesRef.current, lobby]);
      }
      localStorage.setItem("lobbies", JSON.stringify(lobbies));
    });
    
    socket.on("new lobby", (data) => {
      const lobby = data.lobby;
      setLobbies([...lobbiesRef.current, lobby]);
    });
    
    socket.on("create lobby", (data) => {
      localStorage.setItem("lobby", JSON.stringify(data.lobby));
      window.location.href = `/lobbies/${data.lobby.id}`
    });
    
    socket.on("join lobby", (data) => {
      const lobby = data.lobby;
      localStorage.setItem("lobby", JSON.stringify(lobby));
      window.location.href = `/lobbies/${data.lobby.id}`;
    });

    socket.on("player joined lobby", ({ player, lobbyId }) => {
      const lobbiesCopy = [...lobbiesRef.current];
      const lobby = lobbiesCopy.find(lobby => lobby.id === lobbyId);
      lobby.players[player.id] = player;
      setLobbies(lobbiesCopy);
    });
  }, []);

  const joinLobby = (lobbyId) => {
    socket.emit("join lobby", {
      player: JSON.parse(localStorage.getItem("player")),
      lobbyId,
    });
  }

  const createLobby = () => {
    const name = prompt("Please enter a lobby name");
    if (!name) return;
    const player = JSON.parse(localStorage.getItem("player"));
    socket.emit("create lobby", {
      name,
      host: player,
    });
  }

  const createBased = () => {
    const name = "Los basados";
    const player = JSON.parse(localStorage.getItem("player"));
    socket.emit("create lobby", {
      name,
      host: player,
    });
  }

  const devTools = () => {
    console.log(lobbies);
  }

  return <>
    <h1>Lobbies</h1>
    <button onClick={devTools}>DEV TOOLS</button>
    <button onClick={createLobby}>Create Lobby</button>
    <button onClick={createBased}>BASED</button>
    <TableContainer component={Paper} style={styles.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Lobby Name</TableCell>
            <TableCell>Players</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lobbies.map(lobby => <TableRow key={lobby.id}>
            <TableCell>{lobby.name}</TableCell>
            <TableCell>{Object.keys(lobby.players).length}</TableCell>
            <TableCell>
              <Button onClick={() => joinLobby(lobby.id)} variant="contained" color="primary">Join</Button>
            </TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    </TableContainer>
    {/* <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Lobby Name</th>
          <th style={styles.th}>Players</th>
          <th style={styles.th}></th>
        </tr>
      </thead>
      <tbody>
        {lobbies.map(lobby => <tr key={lobby.id}>
          <td>{lobby.name}</td>
          <td>{Object.keys(lobby.players).length}</td>
          <td>
            <button onClick={() => joinLobby(lobby.id)}>Join</button>
          </td>
        </tr>)}
      </tbody>
    </table> */}
  </>
}