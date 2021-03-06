import React from "react";
import ReactDOM from "react-dom";
import Tictactoe from "./games/tictactoe/Tictactoe";
import AdventureDice from "./games/adventuredice/AdventureDice";
import Lobbies from "./Lobbies";
import InsideLobby from "./InsideLobby";

const App = () => {
  const path = window.location.pathname;
  if (path === "/lobbies") {
    return <Lobbies/>;
  } else if (path.includes("/lobbies/")) {
    return <InsideLobby/>;
  } else {
    const game = path.split("/")[2];
    const routes = {
      tictactoe: <Tictactoe/>,
      adventuredice: <AdventureDice/>,
    };
    return routes[game];
  }
};

if (typeof window !== "undefined") {
  ReactDOM.render(<App/>, document.getElementById("root"));
}
