import { Howl, HowlOptions } from "howler";

// List of available sounds with their file paths
const soundList: Record<string, string[]> = {
  levelSound: ["assets/sounds/levelBgSound.mp3"], // Background music for levels
  menuBgSound: ["assets/sounds/wildWestSound.mp3"], // Background music for the menu
  shotSound: ["assets/sounds/shotSound.mp3"], // Sound effect for shooting
  winLevelSound: ["assets/sounds/winLevelSound.mp3"], // Sound effect for winning a level
  gameOverSound: ["assets/sounds/gameOverSound.mp3"], // Sound effect for game over
  gunShotSound: ["assets/sounds/gunShotSound.mp3"] // Sound effect for gunshots
};

// Class to manage sound playback using Howler.js
class SoundController extends Howl {
  sound: keyof typeof soundList; // Key representing the sound being played

  /**
   * Constructor to initialize the sound controller.
   * @param {keyof typeof soundList} sound - The key of the sound to play.
   * @param {boolean} [loop=true] - Whether the sound should loop.
   */
  constructor(sound: keyof typeof soundList, loop: boolean = true) {
    const options: HowlOptions = {
      volume: 0.1, // Set the initial volume
      loop, // Enable or disable looping
      src: soundList[sound] // Set the source file for the sound
    };
    super(options); // Initialize the Howl instance with the options
    this.sound = sound; // Store the sound key
  }
}

export default SoundController;
