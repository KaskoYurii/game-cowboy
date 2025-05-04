import WindowContainer from "@/components/windowContainer";
import GameStore from "@/store/gameStore";
import { Application } from "pixi.js";

export const pauseGameWindow = (app: Application | null): void => {
  const windowContainer = new WindowContainer();

  // Define the action for the "Resume Game" button
  const btnAction = () => {
    const containerInstance = windowContainer.getContainer();
    containerInstance?.destroy(); // Remove the pause menu from the stage
    GameStore.setGamePaused(); // Resume the game
  };

  // Initialize the pause menu with a title, button text, and action
  windowContainer.init(app, "Game paused", "Resume game?", btnAction);
};
