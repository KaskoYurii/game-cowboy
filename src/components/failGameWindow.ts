import WindowContainer from "@/components/windowContainer";
import GameStore from "@/store/gameStore";
import { Application } from "pixi.js";

export const failGameWindow = (app: Application | null): void => {
  const windowContainer = new WindowContainer();

  // Define the action for the restart button
  const btnAction = () => {
    const containerInstance = windowContainer.getContainer();
    containerInstance?.destroy(); // Remove the fail game window from the stage
    GameStore.startGame(); // Restart the game
  };

  // Initialize the fail game window with a title, button text, and action
  windowContainer.init(app, "Game over", "Restart level", btnAction);
};
