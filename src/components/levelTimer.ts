import { Text, Container, Application } from "pixi.js";
import GameStore from "@/store/gameStore";

const TIME_VALUE = 60; // Initial time value in seconds
const BOOSTER_VALUE = 30; // Additional time added by a booster in seconds

class LevelTimer {
  app: Application | null; // Reference to the PIXI application
  timerContainer: Container | null; // Container for the timer UI
  time: number; // Current time value in seconds
  oneBooster: number; // Time added by a booster
  interval: NodeJS.Timeout | null; // Interval for updating the timer
  timerText: Text | null; // Text element displaying the timer

  constructor(app: Application | null) {
    this.app = app; // Initialize the PIXI application reference
    this.timerContainer = null; // Initialize the timer container as null
    this.time = TIME_VALUE; // Set the initial time value
    this.oneBooster = BOOSTER_VALUE; // Set the booster time value
    this.interval = null; // Initialize the interval as null
    this.timerText = null; // Initialize the timer text as null
  }

  init(): void {
    // Destroy the previous timer container if it exists
    if (this.timerContainer) {
      this.timerContainer.destroy();
    }

    if (this.app) {
      // Create a new container for the timer
      this.timerContainer = new Container();
      this.timerContainer.setSize(this.app.screen.width, 100); // Set the size of the timer container
      this.timerContainer.position.set(this.app.screen.width / 2, 10); // Position the container at the top of the screen

      // Calculate the initial minutes and seconds
      const minutes = Math.floor(this.time / 60);
      const seconds = this.time % 60;

      // Create the text element to display the timer
      this.timerText = new Text({
        text: `Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`, // Format the time as MM:SS
        style: {
          fontFamily: "Arial", // Font family for the text
          fill: "black", // Text color
          fontSize: 24, // Font size
          align: "center", // Center-align the text
          fontWeight: "bold" // Bold text
        }
      });

      this.timerText.anchor.set(0.5); // Center the text anchor point
      this.timerText.position.set(this.timerContainer.width / 2 - 100, 50); // Position the text inside the container
      this.timerContainer.addChild(this.timerText); // Add the text to the timer container

      // Start the timer interval to update the time every second
      this.interval = setInterval(() => {
        if (this.time === 0) {
          GameStore.setGameOver(); // Trigger game over when the timer reaches 0
          this.stop(); // Stop the timer
          return;
        }

        this.time--; // Decrease the time by 1 second
        GameStore.setData("levelTime", this.time); // Update the level time in the game store

        // Recalculate minutes and seconds
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;

        // Update the timer text
        if (this.timerText) {
          this.timerText.text = `Time: ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        }
      }, 1000); // Update every second

      // Add the timer container to the application's stage
      this.app.stage.addChild(this.timerContainer);
    }
  }

  // Add additional time to the timer using a booster
  addBusterTime(): void {
    this.time += this.oneBooster;
  }

  // Pause the timer by clearing the interval
  pause(): void {
    if (this.interval) clearInterval(this.interval);
  }

  // Stop the timer and destroy the timer container
  stop(): void {
    if (this.interval && this.timerContainer) {
      clearInterval(this.interval); // Clear the interval
      this.timerContainer.destroy(); // Destroy the timer container
    }
  }
}

export default LevelTimer;
