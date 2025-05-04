import {
  Assets,
  AnimatedSprite,
  EventEmitter,
  Application,
  Texture
} from "pixi.js";
import gsap from "gsap";

export const spriteEvents = new EventEmitter();

// Class to handle the logic for animated enemy sprites
type Position = {
  x: number;
  y: number;
};

class AnimatedEnemy {
  app: Application | null; // Reference to the PixiJS application
  enemy: AnimatedSprite | null; // The animated enemy sprite
  speed: number; // Movement speed of the enemy
  index: number; // Index of the enemy instance
  positions: Array<Position>; // Predefined positions for enemy movement
  currentPosition: number; // Index of the current position
  isMoving: boolean; // Flag to indicate if the enemy is moving

  /**
   * Constructor to initialize the AnimatedEnemy instance.
   * @param {Application} app - The PixiJS application instance.
   * @param {number} speed - Movement speed of the enemy.
   * @param {number} index - Index of the enemy instance.
   */
  constructor(app: Application | null, speed: number, index = 0) {
    this.app = app; // Reference to the PixiJS application
    this.enemy = null; // Placeholder for the AnimatedSprite instance
    this.speed = speed; // Movement speed of the enemy
    this.positions = []; // Initialize the positions array
    this.currentPosition = 0 + index; // Set the initial position index
    this.isMoving = false; // Flag to indicate if the enemy is moving
    this.index = index; // Index of the enemy instance
  }

  /**
   * Initializes the animated enemy by loading animation frames and setting up the sprite.
   */
  async init(): Promise<void> {
    if (this.app) {
      this.#setPositions(); // Define the movement positions
      this.isMoving = true; // Set the moving flag to true

      // Load the atlas containing the animation frames
      const atlas = await Assets.load("assets/atlas.json");

      // Check if the animation exists in the atlas
      if (!atlas.animations || !atlas.animations["cowboy_fire"]) {
        console.error("Animation 'cowboy_fire' is missing in the atlas.");
        return;
      }

      const frames = atlas.animations["cowboy_fire"]; // Retrieve the animation frames

      // Map the frame names to their corresponding textures
      const textures: Texture[] = frames
        .map((frame: string | { label: string }) => {
          const frameName: string =
            typeof frame === "string" ? frame : frame.label; // Handle string or object frames
          if (!atlas.textures[frameName]) {
            console.error(`Texture for frame '${frameName}' is missing.`);
          }
          return atlas.textures[frameName];
        })
        .filter((texture: Texture | undefined): texture is Texture =>
          Boolean(texture)
        ); // Remove undefined textures

      // Check if valid textures were found
      if (textures.length === 0) {
        console.error("No valid textures found for 'cowboy_fire' animation.");
        return;
      }

      // Create the AnimatedSprite using the loaded textures
      this.enemy = new AnimatedSprite(textures);
      this.enemy.animationSpeed = 0.1; // Set the animation speed
      this.enemy.play(); // Start the animation
      this.enemy.anchor.set(0.5); // Center the sprite
      this.enemy.interactive = true; // Make the sprite interactive
      this.enemy.cursor = "crosshair"; // Set the cursor style
      this.enemy.label = "enemy" + this.currentPosition; // Assign a label to the sprite
      this.enemy.on("pointertap", () => {
        spriteEvents.emit(`spriteTouched_${this.enemy?.label}`, this.enemy); // Emit an event when the sprite is clicked
      });
      this.enemy.position.set(
        this.app.screen.width / 2,
        this.app.screen.height / 2
      ); // Position the sprite at the center of the screen
      this.app.stage.addChild(this.enemy); // Add the sprite to the stage
      this.#moveCowboy(); // Start the movement logic
    }
  }

  /**
   * Moves the enemy between predefined positions in a loop.
   * @private
   */
  #moveCowboy(): void {
    if (!this.isMoving || !this.enemy) {
      return;
    }

    // Shuffle the positions array to randomize movement
    const shuffleArray = (array: Array<Position>) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    };

    this.positions = shuffleArray(this.positions); // Shuffle the positions
    const nextPosition = this.positions[this.currentPosition]; // Get the next position

    // Animate the enemy to the next position
    gsap.to(this.enemy, {
      x: nextPosition.x,
      y: nextPosition.y,
      duration: this.speed, // Duration of the movement in seconds
      onComplete: () => {
        // Update the current position index and loop back if necessary
        this.currentPosition =
          (this.currentPosition + 1) % this.positions.length;
        this.#moveCowboy(); // Recursively move to the next position
      }
    });
  }

  /**
   * Pauses or resumes the enemy's animation and movement.
   */
  pauseAnimation(): void {
    this.isMoving = !this.isMoving; // Toggle the moving flag
    if (!this.enemy) return;

    if (this.isMoving) {
      this.#moveCowboy(); // Resume movement
      this.enemy.animationSpeed = 0.1; // Resume animation
    } else {
      this.enemy.animationSpeed = 0; // Pause animation
    }
  }

  /**
   * Stops the enemy's animation and removes it from the stage.
   */
  stopAnimation(): void {
    if (this.app && this.enemy) {
      this.isMoving = false; // Stop movement
      this.app.stage.removeChild(this.enemy); // Remove the sprite from the stage
      this.enemy.stop(); // Stop the animation
      this.enemy = null; // Clear the sprite reference
      this.currentPosition = 0; // Reset the position index
    }
  }

  /**
   * Defines the predefined positions for enemy movement.
   * @private
   */
  #setPositions(): void {
    if (this.app) {
      this.positions = [
        { x: this.app.screen.width * 0.2, y: this.app.screen.height * 0.2 }, // Top-left position
        { x: this.app.screen.width * 0.8, y: this.app.screen.height * 0.2 }, // Top-right position
        { x: this.app.screen.width * 0.8, y: this.app.screen.height * 0.8 }, // Bottom-right position
        { x: this.app.screen.width * 0.2, y: this.app.screen.height * 0.8 } // Bottom-left position
      ];
    }
  }
}

export default AnimatedEnemy;
