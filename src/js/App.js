import React from "react";
import ReactDOM from "react-dom";
import Tictactoe from "./games/tictactoe/Tictactoe";
import RollingDice from './games/RollingDice';
import Lobbies from "./Lobbies";

const App = () => {
  const path = window.location.pathname;
  if (path === "/lobbies") {
    return <Lobbies />
  }
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