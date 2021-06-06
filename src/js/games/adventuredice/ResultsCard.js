import React, {useState} from "react";
import {Button, Paper} from "@material-ui/core";

const styles = {
  root: {
    backgroundColor: "gray"
  }
}

export default ({ result, onReturnToLobby, onPlayAgain }) => {
  const [showButtons, setShowButtons] = useState(true);

  const handleReturn = () => {
    setShowButtons(false);
    onReturnToLobby();
  }

  const handlePlayAgain = () => {
    setShowButtons(false);
    onPlayAgain();
  }

  return(
    <Paper style={styles.root}>
      <p>Game Ended!</p>
      <br/>
      { result.winners.length === 1 ?
        <>
          <p>{`Winner: ${result.winners[0].username}`}</p>
        </>
      : <>
          <p>Winners:</p><br/>
          {result.winners.map(winner => <>
            <p>{winner.username}</p>
            <br/>
          </>)}
        </>
      }
      { showButtons && <>
        <Button variant={"contained"} color={"secondary"} onClick={handleReturn}>Return to Lobby</Button>
        <Button variant={"contained"} color={"primary"} onClick={handlePlayAgain}>Play again</Button>
      </>}
    </Paper>
  );
}