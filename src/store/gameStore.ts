import levelConfig from "@/utils/levelConfig.json";
import AnimatedEnemy, { spriteEvents } from "@/utils/EnemyAnimation";
import LevelTimer from "@/components/levelTimer";
import { Application, Assets, Texture } from "pixi.js";
import { failGameWindow } from "@/components/failGameWindow";
import { winLevelWindow } from "@/components/winLevelWindow";
import { pauseGameWindow } from "@/components/pauseGameWindow";
import EnemyCounter from "@/components/enemyCounter";
import SoundController from "@/utils/SoundController";

type LevelSettings = {
  name: string; // Name of the level
  enemy_count: number; // Number of enemies in the level
  animation_speed: number; // Speed of enemy animations
  level: number; // Level number
};

type ImageAssets = {
  background: Texture; // Background texture
  soundOff: Texture; // Sound off icon texture
  soundOn: Texture; // Sound on icon texture
  pause: Texture; // Pause icon texture
  star: Texture; // Star icon texture
  clock: Texture; // Clock icon texture
};

class GameStore {
  app: Application | null; // Reference to the PixiJS application
  levels: Array<LevelSettings>; // Array of level configurations
  currentLevel: number; // Current level number
  gameStarted: boolean; // Flag indicating if the game has started
  gameOver: boolean; // Flag indicating if the game is over
  gamePaused: boolean; // Flag indicating if the game is paused
  gameWon: boolean; // Flag indicating if the game is won
  levelTime: number; // Time spent in the current level
  gameBoosterLeft: number; // Number of boosters left
  gameMuted: boolean; // Flag indicating if the game is muted
  images: ImageAssets; // Loaded image assets
  enemies: Array<AnimatedEnemy>; // Array of enemy instances
  levelTimer: null | LevelTimer; // Instance of the level timer
  enemyKilledCount: number; // Number of enemies killed
  enemyCounter: null | EnemyCounter; // Instance of the enemy counter
  menuSound: null | SoundController; // Background menu sound
  levelSound: null | SoundController; // Background level sound
  shotSound: null | SoundController; // Sound for shooting
  winLevelSound: null | SoundController; // Sound for winning a level
  gameOverSound: null | SoundController; // Sound for game over
  gunShotSound: null | SoundController; // Sound for gunshots

  constructor() {
    // Initialize default values
    this.app = null;
    this.levels = Object.values(levelConfig);
    this.currentLevel = 1;
    this.gameStarted = false;
    this.gameOver = false;
    this.gamePaused = false;
    this.gameWon = false;
    this.levelTime = 0;
    this.gameBoosterLeft = 3;
    this.gameMuted = false;
    this.images = {
      background: Texture.EMPTY,
      soundOff: Texture.EMPTY,
      soundOn: Texture.EMPTY,
      pause: Texture.EMPTY,
      star: Texture.EMPTY,
      clock: Texture.EMPTY
    };
    this.enemies = [];
    this.levelTimer = null;
    this.enemyKilledCount = 0;
    this.enemyCounter = null;
    this.menuSound = null;
    this.levelSound = null;
    this.shotSound = null;
    this.winLevelSound = null;
    this.gameOverSound = null;
    this.gunShotSound = null;
  }

  // Initialize the game store with the application instance
  async init(app: Application): Promise<void> {
    this.app = app;
    this.initSounds(); // Initialize sounds
    await this.loadAssets(); // Load game assets
  }

  // Set a specific property in the game store
  setData<K extends keyof this>(key: K, value: this[K]): void {
    this[key] = value;
  }

  // Load game assets
  async loadAssets(): Promise<void> {
    Assets.addBundle("images", {
      background: "assets/images/sceneBackground.png",
      soundOff: "assets/images/soundOff.png",
      soundOn: "assets/images/soundOn.png",
      pause: "assets/images/pause.png",
      star: "assets/images/star.png",
      clock: "assets/images/clock.png"
    });
    this.images = await Assets.loadBundle("images");
  }

  // Initialize sound controllers
  initSounds(): void {
    this.menuSound = new SoundController("menuBgSound");
    this.levelSound = new SoundController("levelSound");
    this.shotSound = new SoundController("shotSound");
    this.winLevelSound = new SoundController("winLevelSound", false);
    this.gameOverSound = new SoundController("gameOverSound", false);
    this.gunShotSound = new SoundController("gunShotSound", false);
  }

  // Set the current level
  setCurrentLevel(level: number): void {
    this.currentLevel = level;
  }

  // Start the game
  async startGame(): Promise<void> {
    this.gameStarted = true;
    const levelSettings = this.levels[this.currentLevel - 1];

    // Initialize enemies
    for (let i = 0; i < levelSettings.enemy_count; i++) {
      const enemyInstance = new AnimatedEnemy(
        this.app,
        levelSettings.animation_speed,
        i
      );
      await enemyInstance.init();
      this.enemies.push(enemyInstance);
      spriteEvents.on(`spriteTouched_${enemyInstance.enemy?.label}`, () => {
        this.setKillEnemy(enemyInstance);
      });
    }

    // Play sounds and initialize UI components
    this.menuSound?.stop();
    this.levelSound?.play();
    this.shotSound?.play();
    this.levelTimer = new LevelTimer(this.app);
    this.levelTimer.init();
    this.enemyCounter = new EnemyCounter(this.app);
    this.enemyCounter?.init();
  }

  // Handle enemy kill logic
  setKillEnemy(enemyInstance: AnimatedEnemy): void {
    if (this.gamePaused) return;
    const levelSettings = this.levels[this.currentLevel - 1];

    if (enemyInstance.enemy) {
      this.gunShotSound?.play();
      this.enemyKilledCount++;
      enemyInstance.stopAnimation();
      this.enemyCounter?.updateText();
    }

    if (this.enemyKilledCount === levelSettings.enemy_count) {
      this.setWinLevel();
    }
  }

  // Handle game over logic
  setGameOver(): void {
    failGameWindow(this.app);
    this.levelSound?.stop();
    this.gameOverSound?.play();
    this.gameOver = true;
    this.eraseLevel();
  }

  // Handle level win logic
  setWinLevel(): void {
    winLevelWindow(this.app);
    this.levelSound?.stop();
    this.gameWon = true;
    this.levelTimer?.stop();
    this.winLevelSound?.play();
    this.eraseLevel();
  }

  // Start playing background music
  startMusic(): void {
    this.menuSound?.play();
  }

  // Toggle mute/unmute for all sounds
  muteUnmuteMusic(): void {
    this.menuSound?.mute(!this.gameMuted);
    this.levelSound?.mute(!this.gameMuted);
    this.shotSound?.mute(!this.gameMuted);
    this.winLevelSound?.mute(!this.gameMuted);
    this.gunShotSound?.mute(!this.gameMuted);
    this.gameMuted = !this.gameMuted;
  }

  // Toggle game pause state
  setGamePaused(): void {
    if (!this.gameStarted) return;
    this.gamePaused = !this.gamePaused;

    if (this.gamePaused) {
      this.levelTimer?.pause();
      this.levelSound?.stop();
      this.shotSound?.stop();
      pauseGameWindow(this.app);
    } else {
      this.levelTimer?.init();
      this.levelSound?.play();
      this.shotSound?.play();
    }

    this.enemies.forEach((enemyContainer: AnimatedEnemy) => {
      enemyContainer.pauseAnimation();
    });
  }

  // Reset the current level
  eraseLevel(): void {
    this.enemies.forEach((enemy: AnimatedEnemy) => {
      enemy.stopAnimation();
    });
    this.enemies = [];
    this.gameStarted = false;
    this.gameBoosterLeft = 3;
    this.levelTime = 0;
    this.enemyKilledCount = 0;
    this.shotSound?.stop();

    if (this.enemyCounter) {
      this.enemyCounter.enemyCounterContainer?.destroy();
      this.enemyCounter = null;
    }
  }

  // Start a new game
  playNewGame(): void {
    this.levels = Object.values(levelConfig);
    this.currentLevel = 1;
    this.gameStarted = false;
    this.gameOver = false;
    this.gamePaused = false;
    this.gameWon = false;
    this.levelTime = 0;
    this.gameBoosterLeft = 3;
    this.gameMuted = false;
    this.enemies = [];
    this.levelTimer = null;
    this.enemyKilledCount = 0;
    this.enemyCounter = null;
    this.startGame();
  }

  // Start the next level
  startNextLevel(): void {
    if (this.currentLevel === this.levels.length) return;
    this.currentLevel++;
    this.startGame();
  }

  // Use a booster to add extra time
  useBooster(): void {
    if (this.gameBoosterLeft === 0 || !this.gameStarted || this.gamePaused)
      return;
    this.levelTimer?.addBusterTime();
    this.gameBoosterLeft--;
  }
}

export default new GameStore();
