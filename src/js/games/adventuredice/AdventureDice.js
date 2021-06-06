import {Button, Grid, Paper} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import useStateRef from "../../../utils/useStateRef";
import DiceContainer from "./DiceContainer";
import PlayerInfo from "./PlayerInfo";
import ResultsCard from "./ResultsCard";

const styles = {
  root: {
    color: "white",
  },
  statsText: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  statsIconContainer: {
    paddingTop: "0.2rem",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    minHeight: "5rem",
    maxHeight: "5rem",
    padding: "0 11rem",
  },
  button: {
    width: "14rem"
  },
  turnIndicatorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    fontSize: "2rem",
    fontWeight: "bold",
    minHeight: "6rem",
    maxHeight: "6rem",
  },
  playerInfoContainer: {
    display: "flex",
    justifyContent: "center",
    margin: "2rem 0",
    flexDirection: "column",
  },
  diceContainer: {
    padding: "8rem 8rem 0 8rem",
    minHeight: "20rem",
    maxHeight: "20rem"
  },


}

export default () => {
  const [socket, setSocket] = useState(null);
  const [currentTurnPlayerId, setCurrentTurnPlayerId, currentTurnPlayerIdRef] = useStateRef(null);
  const [player, setPlayer, playerRef] = useStateRef(JSON.parse(localStorage.getItem("player")));
  // const [player, setPlayer] = useState({ username: "Shikad", id: "1", lives: 2, stars: 8, gambledStars: 4});
  // const [players, setPlayers] = useState([{ username: "Guiso", id: "2", lives: 3, stars: 4, gambledStars: 2} ]);
  const [players, setPlayers] = useState([]);
  const [game, setGame] = useState(JSON.parse(localStorage.getItem("game")));
  const [dice, setDice] = useState([]);
  const [showRollButton, setShowRollButton] = useState(false);
  const [showPassButton, setShowPassButton] = useState(false);
  const [result, setResult] = useState(undefined);

  useEffect(() => {
    const socket = io("/games/adventuredice");
    setSocket(socket);
    socket.on("game started", ({ game }) => {
      setResult(undefined);
      setCurrentTurnPlayerId(game.currentTurnPlayerId);
      setPlayers(game.players);
      const currentPlayer = game.players.find(i => i.id === game.currentTurnPlayerId);
      setDice(currentPlayer.dice);
      if (game.currentTurnPlayerId === playerRef.current.id) {
        setPlayer(currentPlayer);
        setShowRollButton(true);
        setShowPassButton(true);
      }
    });
    socket.on("player rolled", ({ game }) => {
      const currentPlayer = game.players.find(i => i.id === game.currentTurnPlayerId);
      setPlayers(game.players);
      setDice(currentPlayer.dice);
      if (game.currentTurnPlayerId === playerRef.current.id) {
        setPlayer(currentPlayer);
        setShowRollButton(currentPlayer.lives > 0);
        setShowPassButton(true);
        if (currentPlayer.dice.length < 3) {
          setShowRollButton(false);
        }
      }
    });
    socket.on("player passed", ({ game }) => {
      setCurrentTurnPlayerId(game.currentTurnPlayerId)
      const currentPlayer = game.players.find(i => i.id === game.currentTurnPlayerId);
      setPlayers(game.players);
      setDice(currentPlayer.dice);
      if (game.currentTurnPlayerId === playerRef.current.id) {
        setPlayer(currentPlayer);
        setShowRollButton(true);
        setShowPassButton(true);
      } else {
        setShowRollButton(false);
        setShowPassButton(false);
      }
    });
    socket.on("game ended", ({ result }) => {
      setResult(result);
      setCurrentTurnPlayerId(undefined);
      setShowPassButton(false);
      setShowRollButton(false);
    });
    socket.on("return to lobby", ({ lobbyId }) => {
      window.location.href = `/lobbies/${lobbyId}`;
    });
    socket.emit("player is ready", { gameId: game.id, playerId: player.id });
  }, []);

  const handlePass = () => {
    setShowRollButton(false);
    setShowPassButton(false);
    socket.emit("player passed", { gameId: game.id, playerId: player.id });
  }

  const handleRoll = () => {
    setShowRollButton(false);
    setShowPassButton(false);
    socket.emit("player rolled", { gameId: game.id, playerId: player.id });
  }

  const handlePlayAgain = () => {
    socket.emit("player voted to play again", { gameId: game.id, playerId: player.id });
  }

  const handleReturnToLobby = () => {
    socket.emit("return to lobby", {gameId: game.id});
  }

  return (
    <div style={styles.root}>
      <Grid container direction={"column"} spacing={2}>
        <Grid item container xs={12}>
          <Grid item xs={3} style={styles.playerInfoContainer}>
            {players.map((currentPlayer, i) => {
              if (i < 4) {
                return <PlayerInfo key={i}  player={currentPlayer} isActive={currentPlayer.id === currentTurnPlayerId}/>
              }
              return null;
            })}
          </Grid>
            { !result ?
              <Grid item container xs={6} direction={"column"}>
                <Grid item xs={12} style={styles.diceContainer}>
                  <DiceContainer dice={dice}/>
                </Grid>
                <Grid item xs={12} style={styles.buttonsContainer}>
                  { showPassButton && <Button variant={"contained"} color={"secondary"} style={styles.button} onClick={handlePass}>PASS</Button>}
                  { showRollButton && <Button variant={"contained"} color={"primary"} style={styles.button} onClick={handleRoll}>ROLL</Button>}
                </Grid>
                <Grid item xs={12} style={styles.turnIndicatorContainer}>
                  { players.length > 0 && currentTurnPlayerId &&
                    (currentTurnPlayerId === player.id ? "YOUR TURN!" : `Waiting for ${players.find(iPlayer => iPlayer.id === currentTurnPlayerId).username}`)
                  }
                </Grid>
              </Grid>
              : <Grid item container xs={6}>
                <ResultsCard result={result} onPlayAgain={handlePlayAgain} onReturnToLobby={handleReturnToLobby}/>
              </Grid>
            }

          <Grid item xs={3}>
            <Grid item xs={3} style={styles.playerInfoContainer}>
              {players.filter(currentPlayer => currentPlayer.id !== player.id).map((currentPlayer, i) => {
                if (i >= 4) {
                  return <PlayerInfo key={i}  player={currentPlayer} isActive={currentPlayer.id === currentTurnPlayerId}/>
                }
                return null;
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );

}