import React from "react";
import {Grid, Paper} from "@material-ui/core";

const styles = {
  root: {
    width: "80%",
    height: "8rem",
    backgroundColor: "#3f51b5",
    color: "white",
  },
  mainContainer: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainSubContainer: {
    minHeight: "3rem",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    fontSize: "1.5rem",
    fontWeight: "bold"
  },
  statImage: {
    marginLeft: "2rem",
    marginRight: "1rem",
  }
}

export default ({ player, isActive }) => {
  return(
    <>
      <Paper style={styles.root} elevation={5}>
        <Grid container direction={"column"} style={styles.mainContainer}>
          <Grid item xs={12} style={{...styles.mainSubContainer, color: isActive ? "yellow" : "white" }}>
            {player.username}
          </Grid>
          <Grid item container xs={12} style={styles.mainSubContainer}>
            <Grid item xs={4} style={styles.statsContainer}>
              { player.lives >= 0 ?
                <>
                  {[...Array(player.lives)].map((e, i) =>
                  <img key={i} src={"/img/adventuredice/heart.png"} />
                  )}
                  {[...Array(3 - player.lives)].map((e, i) =>
                  <img key={i} src={"/img/adventuredice/empty_heart.png"} />
                  )}
                </>
                :<>
                  <img src={"/img/adventuredice/empty_heart.png"} />
                  <img src={"/img/adventuredice/empty_heart.png"} />
                  <img src={"/img/adventuredice/empty_heart.png"} />
                </>
              }

            </Grid>
            <Grid item xs={8} style={styles.statsContainer}>
              <img src={"/img/adventuredice/star.png"} style={styles.statImage} /> {player.stars}
              <img src={"/img/adventuredice/empty_star.png"} style={styles.statImage} /> {player.gambledStars}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}