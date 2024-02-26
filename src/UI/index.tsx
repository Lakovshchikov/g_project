import React, { type FC } from "react";
import { createRoot } from "react-dom/client";
import { GameScene } from "./features/gameScene";
import "./styles.css";

const App: FC = () => {
  return (
    <div>
      <GameScene />
    </div>
  );
};

const root = createRoot(document.getElementById("root") as HTMLDivElement);
root.render(<App />);
