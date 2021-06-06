import React from "react";
import {Paper} from "@material-ui/core";

const styles = {
  root: {
    height: "8rem",
    width: "8rem",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}

export default ({ face, color }) => {
  return (
    <>
      <Paper elevation={3} variant={"outlined"} style={{...styles.root, backgroundColor: color}}>
        <img src={`/img/adventuredice/${face}_face.png`} />
      </Paper>
    </>
  )
}