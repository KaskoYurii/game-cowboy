import WindowContainer from "@/components/windowContainer";
import GameStore from "@/store/gameStore";
import { Application } from "pixi.js";

export const mainMenu = (app: Application) => {
  const windowContainer = new WindowContainer();

  // Define the action for the "Start Game" button
  const btnAction = () => {
    const containerInstance = windowContainer.getContainer();
    containerInstance?.destroy(); // Remove the main menu from the stage
    GameStore.startGame(); // Start the game
  };

  // Initialize the main menu with a title, button text, and action
  windowContainer.init(app, "Shooting game", "Start Game", btnAction);
};
