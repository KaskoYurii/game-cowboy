import { Text, Container, Application } from "pixi.js";
import GameStore from "@/store/gameStore";

class EnemyCounter {
  app: Application | null; // Reference to the PIXI application
  enemyCounterContainer: Container | null; // Container for the enemy counter UI
  enemyCountText: Text | null; // Text element displaying the enemy count

  constructor(app: Application | null) {
    this.app = app; // Initialize the PIXI application reference
    this.enemyCounterContainer = null; // Initialize the container as null
    this.enemyCountText = null; // Initialize the text element as null
  }

  init(): void {
    if (this.app) {
      // Create a container for the enemy counter
      this.enemyCounterContainer = new Container();
      this.enemyCounterContainer.setSize(this.app.screen.width, 100); // Set the container size
      this.enemyCounterContainer.position.set(
        (this.app.screen.width + 300) / 2,
        10
      ); // Position the container on the screen

      // Create the text element to display the enemy count
      this.enemyCountText = new Text({
        text: `Enemies: ${GameStore.enemies.length - GameStore.enemyKilledCount} / ${GameStore.enemies.length}`, // Initial enemy count text
        style: {
          fontFamily: "Arial", // Font family for the text
          fill: "black", // Text color
          fontSize: 24, // Font size
          align: "center", // Center-align the text
          fontWeight: "bold" // Bold text
        }
      });
      this.enemyCountText.anchor.set(0.5); // Center the text anchor point
      this.enemyCountText.position.set(this.enemyCountText.width / 2 - 100, 50); // Position the text within the container

      // Add the text element to the container
      this.enemyCounterContainer.addChild(this.enemyCountText);

      // Add the container to the application's stage
      this.app.stage.addChild(this.enemyCounterContainer);
    }
  }

  updateText() {
    // Update the enemy count text dynamically
    if (this.enemyCountText) {
      this.enemyCountText.text = `Enemies: ${GameStore.enemies.length - GameStore.enemyKilledCount} / ${GameStore.enemies.length}`;
    }
  }
}

export default EnemyCounter;
