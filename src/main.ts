import { Application, Sprite } from "pixi.js";
import { mainMenu } from "@/components/mainMenu";

import GameStore from "@/store/gameStore";
import { headerControls } from "@/components/headerControls";

(async () => {
  // Create a new PixiJS application instance
  const app = new Application();

  // Initialize the application with specific settings
  await app.init({ resizeTo: window });

  // Initialize the game store with the application instance
  await GameStore.init(app);

  // Start playing background music
  GameStore.startMusic();

  // Set up the background image
  const background = new Sprite(GameStore.images.background);
  background.scale.set(
    app.screen.width / background.texture.width,
    app.screen.height / background.texture.height
  );

  // Add the background to the stage at the lowest layer
  app.stage.addChildAt(background, 0);

  // Append the application canvas to the HTML container
  const container = document?.getElementById("pixi-container");
  if (container) {
    container.appendChild(app.canvas);
  } else {
    console.error("Container element with id 'pixi-container' not found.");
  }

  // Display the main menu
  mainMenu(app);

  // Initialize the header controls
  headerControls(app);
})();
