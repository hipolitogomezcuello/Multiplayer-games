import React, {useEffect, useState} from "react";
import {Grid, Paper} from "@material-ui/core";
import Dice from "./Dice";

const styles = {
  root: {
    height: "10rem",
    margin: "1rem 5rem 1rem 5rem",
  },
  mainContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignContent: "center",
    height: "100%",
  },
  diceContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
}

export default ({ dice }) => {

  return (
    <>
      <div style={styles.root}>
        <Grid container spacing={2} style={styles.mainContainer}>
          {dice.map((singleDice, i) =>
            <Grid key={i} item xs={3} style={styles.diceContainer}>
              <Dice face={singleDice.result} color={singleDice.color}/>
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
}