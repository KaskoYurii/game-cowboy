import WindowContainer from "@/components/windowContainer";
import GameStore from "@/store/gameStore";
import { levelRating } from "@/components/levelRating";
import { Application } from "pixi.js";

export const winLevelWindow = (app: Application | null) => {
  const windowContainer = new WindowContainer();
  const lastLevel = GameStore.currentLevel === GameStore.levels.length; // Check if the current level is the last one

  // Define the action for the button
  const btnAction = () => {
    const containerInstance = windowContainer.getContainer();
    containerInstance?.destroy(); // Remove the win level window from the stage
    if (lastLevel) {
      GameStore.playNewGame(); // Start a new game if the last level is completed
    } else {
      GameStore.startNextLevel(); // Start the next level if there are more levels
    }
  };

  // Initialize the window with appropriate text based on the game state
  if (lastLevel) {
    windowContainer.init(app, "Game finished", "Play again?", btnAction); // Display "Game finished" for the last level
  } else {
    windowContainer.init(app, "Level passed", "Start next level?", btnAction); // Display "Level passed" for intermediate levels
  }

  // Add the level rating to the window
  levelRating(windowContainer.container);
};
