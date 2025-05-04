// Import necessary classes from PixiJS
import { Text, Container, Graphics, Application } from "pixi.js";
import { actionBtn } from "@/components/actionBtn";

// Class to create a reusable window container with a title and a button
class WindowContainer {
  app: Application | null; // Reference to the PixiJS application instance
  text: string; // Title text for the window
  btnText: string; // Text for the button
  btnAction: () => void; // Callback function for the button action
  container: Container | null; // Container to hold all window elements

  constructor() {
    // Initialize default values for the window container
    this.app = null; // PixiJS application instance
    this.text = "Game"; // Default title text
    this.btnText = "Start"; // Default button text
    this.btnAction = () => {}; // Default button action (no-op)
    this.container = null; // Container is initially null
  }

  /**
   * Initializes the window container with the provided parameters.
   * @param {Application} app - The PixiJS application instance.
   * @param {string} text - The title text to display in the window.
   * @param {string} btnText - The text to display on the button.
   * @param {Function} btnAction - The callback function to execute when the button is clicked.
   */
  init(
    app: Application | null,
    text: string,
    btnText: string,
    btnAction: () => void
  ): void {
    this.#setData(app, text, btnText, btnAction); // Set the window data
    this.#processContainer(); // Create and configure the container
  }

  /**
   * Retrieves the container instance for external use.
   * @returns {Container | null} The container instance.
   */
  getContainer(): Container | null {
    return this.container;
  }

  /**
   * Sets the data for the window container.
   * @private
   * @param {Application} app - The PixiJS application instance.
   * @param {string} text - The title text to display in the window.
   * @param {string} btnText - The text to display on the button.
   * @param {Function} btnAction - The callback function to execute when the button is clicked.
   */
  #setData(
    app: Application | null,
    text: string,
    btnText: string,
    btnAction: () => void
  ): void {
    this.app = app; // Store the PixiJS application instance
    this.text = text; // Store the title text
    this.btnText = btnText; // Store the button text
    this.btnAction = btnAction; // Store the button action
  }

  /**
   * Creates and configures the container, including the background, title, and button.
   * @private
   */
  #processContainer(): void {
    if (this.app) {
      // Create a new container to hold the window elements
      this.container = new Container();
      this.container.setSize(400, 300); // Set the container size
      this.container.position.set((this.app.screen.width - 500) / 2, 100); // Center the container on the screen

      // Add the container to the application's stage
      this.app.stage.addChild(this.container);

      // Create a background panel for the window
      const panelWidth = 400; // Panel width
      const panelHeight = 300; // Panel height
      const panelX = this.container.width / 2; // Horizontal position of the panel
      const panelY = 60; // Vertical position of the panel

      const panel = new Graphics()
        .setStrokeStyle({ width: 3, color: 0x000000 }) // Add a black border
        .roundRect(0, 0, panelWidth, panelHeight, 20) // Create a rounded rectangle
        .fill("#ff9f1c"); // Set the background color to orange

      panel.position.set(panelX, panelY); // Position the panel within the container
      this.container.addChild(panel); // Add the panel to the container

      // Create a title text element with the specified text and styling
      const containerTitle = new Text({
        text: this.text, // Title text
        style: {
          fontFamily: "Arial", // Font family
          fill: "white", // Text color
          fontSize: 48, // Font size
          align: "center", // Text alignment
          fontWeight: "bold" // Bold font weight
        }
      });

      // Center the title text horizontally and position it near the top
      containerTitle.anchor.set(0.5); // Set the anchor point to the center
      containerTitle.x = this.container.width / 2; // Center the text horizontally
      containerTitle.y = 100; // Position the text vertically at 100px from the top

      // Add the title text to the container
      this.container.addChild(containerTitle);

      // Add a button to the container
      actionBtn({
        parentContainer: this.container,
        text: this.btnText, // Button text
        xAxis: this.container.width / 2 - 100, // Horizontal position of the button
        yAxis: 250, // Vertical position of the button
        pointerAction: this.btnAction // Button action
      });
    }
  }
}

export default WindowContainer;
