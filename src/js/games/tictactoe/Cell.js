import React, { useState } from 'react';

const styles = {
  container: {
    backgroundColor: "#d3d3d3",
    height: "50px",
    width: "50px",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
}

const Cell = ({ style, figure, onClick }) => {
  return <>
    <div style={{...styles.container, ...style}} onClick={onClick}>
      {figure || " "}
    </div>
  </>
}

export default Cell;