import React from "react";
import ReactDOM from "react-dom";
import Tictactoe from "./games/tictactoe/Tictactoe";
import RollingDice from './games/RollingDice';

const App = () => {
  const path = window.location.pathname;
  const game = path.split("/")[2];
  const routes = {
    "tictactoe": <Tictactoe />,
    "rolling-dice": <RollingDice />
  }
  return routes[game];
};

if (typeof window !== "undefined") {
  ReactDOM.render(<App />, document.getElementById("root"));
}