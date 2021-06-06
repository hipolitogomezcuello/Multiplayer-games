import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useStateRef from "../../../utils/useStateRef";
import Cell from "./Cell";

const styles = {
  row: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  map: {
    a1: {
      borderWidth: "0 1px 1px 0",
      borderStyle: "solid",
      borderColor: "black",
    },
    b1: {
      borderWidth: "0 1px 1px 1px",
      borderStyle: "solid",
      borderColor: "black",
    },
    c1: {
      borderWidth: "0 0 1px 1px",
      borderStyle: "solid",
      borderColor: "black",
    },
    a2: {
      borderWidth: "1px 1px 1px 0",
      borderStyle: "solid",
      borderColor: "black",
    },
    b2: {
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "black",
    },
    c2: {
      borderWidth: "1px 0 1px 1px",
      borderStyle: "solid",
      borderColor: "black",
    },
    a3: {
      borderWidth: "1px 1px 0 0",
      borderStyle: "solid",
      borderColor: "black",
    },
    b3: {
      borderWidth: "1px 1px 0 1px",
      borderStyle: "solid",
      borderColor: "black",
    },
    c3: {
      borderWidth: "1px 0 0 1px",
      borderStyle: "solid",
      borderColor: "black",
    },
  },
};

export default () => {
  const [socket, setSocket] = useState(null);
  const [map, setMap, mapRef] = useStateRef(null);
  const [figure, setFigure, figureRef] = useStateRef(null);
  const [currentTurnPlayerId, setCurrentTurnPlayerId, currentTurnPlayerIdRef] =
    useStateRef(null);
  const [player, setPlayer] = useState(
    JSON.parse(localStorage.getItem("player"))
  );
  const [game, setGame] = useState(JSON.parse(localStorage.getItem("game")));
  const [gameEnded, setGameEnded] = useState(false);
  const [showPlayAgainButton, setShowPlayAgainButton] = useState(false);
  const [
    playersThatWantToPlayAgain,
    setPlayersThatWantToPlayAgain,
    playersThatWantToPlayAgainRef,
  ] = useStateRef([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const socket = io("/games/tictactoe");
    setSocket(socket);
    socket.on("game started", (data) => {
      setMap(data.game.map);
      setFigure(data.game.players[player.id].figure);
      setCurrentTurnPlayerId(data.game.currentTurnPlayerId);
    });
    socket.on("player made a play", ({ figure, cell, currentTurnPlayerId }) => {
      setCurrentTurnPlayerId(currentTurnPlayerId);
      const newMap = { ...mapRef.current };
      newMap[cell] = figure;
      setMap(newMap);
    });
    socket.on("game ended", ({ result }) => {
      setShowPlayAgainButton(true);
      setGameEnded(true);
      setResult(result);
    });
    socket.on("play again", ({ game }) => {
      setGameEnded(false);
      setMap(game.map);
      setFigure(game.players[player.id].figure);
      setCurrentTurnPlayerId(game.currentTurnPlayerId);
      setPlayersThatWantToPlayAgain([]);
      setResult(null);
    });
    socket.on("player wants to play again", ({ playerId }) => {
      if (
        !playersThatWantToPlayAgainRef.current.find(
          (player) => player.id === playerId
        )
      ) {
        const listCopy = [...playersThatWantToPlayAgain];
        listCopy.push(player);
        setPlayersThatWantToPlayAgain(listCopy);
      }
    });
    socket.on("return to lobby", ({ lobbyId }) => {
      window.location.href = `/lobbies/${lobbyId}`;
    });
    socket.emit("player is ready", { gameId: game.id, playerId: player.id });
  }, []);

  const handleClickCell = (cell) => {
    if (!itsMyTurn() || map[cell] || gameEnded) return;
    const newMap = { ...map };
    newMap[cell] = figure;
    setMap(newMap);
    setCurrentTurnPlayerId(null);
    socket.emit("make a play", {
      gameId: game.id,
      playerId: player.id,
      cell,
    });
  };

  const handlePlayAgain = () => {
    setShowPlayAgainButton(false);
    socket.emit("vote to play again", { gameId: game.id, playerId: player.id });
  };

  const handleReturnToLobby = () => {
    setShowPlayAgainButton(false);
    socket.emit("return to lobby", { gameId: game.id });
  };

  const itsMyTurn = () => player.id === currentTurnPlayerId;

  const renderResult = () => {
    if (result.draw) {
      return <p>DRAW!</p>;
    }
    if (result.winner === player.id) {
      return <p>Winner winner chicken dinner!</p>;
    } else {
      return <p>You lost. Fgt.</p>;
    }
  };

  return (
    <>
      <h1>TIC TAC TOE</h1>
      {map ? (
        <div style={styles.column}>
          <div style={styles.row}>
            <Cell
              style={styles.map.a1}
              figure={map.a1}
              onClick={() => handleClickCell("a1")}
            />
            <Cell
              style={styles.map.b1}
              figure={map.b1}
              onClick={() => handleClickCell("b1")}
            />
            <Cell
              style={styles.map.c1}
              figure={map.c1}
              onClick={() => handleClickCell("c1")}
            />
          </div>
          <div style={styles.row}>
            <Cell
              style={styles.map.a2}
              figure={map.a2}
              onClick={() => handleClickCell("a2")}
            />
            <Cell
              style={styles.map.b2}
              figure={map.b2}
              onClick={() => handleClickCell("b2")}
            />
            <Cell
              style={styles.map.c2}
              figure={map.c2}
              onClick={() => handleClickCell("c2")}
            />
          </div>
          <div style={styles.row}>
            <Cell
              style={styles.map.a3}
              figure={map.a3}
              onClick={() => handleClickCell("a3")}
            />
            <Cell
              style={styles.map.b3}
              figure={map.b3}
              onClick={() => handleClickCell("b3")}
            />
            <Cell
              style={styles.map.c3}
              figure={map.c3}
              onClick={() => handleClickCell("c3")}
            />
          </div>
        </div>
      ) : null}
      {currentTurnPlayerId === player.id ? (
        <h3>It's your turn!</h3>
      ) : (
        <h3>Waiting for your oponent...</h3>
      )}
      {gameEnded ? (
        <div style={styles.gameEndedRow}>
          {showPlayAgainButton && (
            <Button
              variant="contained"
              color="primary"
              onClick={handlePlayAgain}
            >
              Play again
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={handleReturnToLobby}
          >
            Return to Lobby
          </Button>
        </div>
      ) : null}
      {result && renderResult()}
      {playersThatWantToPlayAgain.length > 0 ? (
        <p>{`Votes to play again: 1/2`}</p>
      ) : null}
    </>
  );
};
