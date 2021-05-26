import React from "react";
import Tictactoe from "./games/Tictactoe";
import RollingDice from "./games/RollingDice";

const routes = {
  "/games/tictactoe/:lobbyId": ({ lobbyId }) => <Tictactoe />,
  "/games/rollingdice/:lobbyId": ({ lobbyId }) => <RollingDice />
}