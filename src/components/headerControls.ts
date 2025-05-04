import { Application, Container } from "pixi.js";
import { actionBtn } from "@/components/actionBtn";
import GameStore from "@/store/gameStore";

export const headerControls = (app: Application) => {
  const headerContainer = new Container();
  headerContainer.setSize(app.screen.width, 100); // Set the size of the header container
  headerContainer.position.set(app.screen.width - 400, 10); // Position the header container at the top-right corner

  // Function to add a mute button to the header
  const addMuteBtn = () => {
    actionBtn({
      parentContainer: headerContainer,
      text: "", // No text for the mute button
      xAxis: headerContainer.width / 2 - 25, // Position the button horizontally
      yAxis: headerContainer.height, // Position the button vertically
      pointerAction: muteMusic, // Action to mute/unmute music
      iconImage: GameStore.images.soundOff, // Icon for the mute button
      width: 50 // Set the button width
    });
  };

  // Function to pause the game
  const pauseGame = () => {
    if (!GameStore.gamePaused) GameStore.setGamePaused(); // Toggle the game's paused state
  };

  // Function to add a pause button to the header
  const addPauseBtn = () => {
    actionBtn({
      parentContainer: headerContainer,
      text: "", // No text for the pause button
      xAxis: headerContainer.width / 2, // Position the button horizontally
      yAxis: 0, // Position the button vertically
      pointerAction: pauseGame, // Action to pause the game
      iconImage: GameStore.images.pause, // Icon for the pause button
      width: 50 // Set the button width
    });
  };

  // Function to add a booster button to the header
  const addBoosterBtn = (): void => {
    actionBtn({
      parentContainer: headerContainer,
      text: "", // No text for the booster button
      xAxis: (headerContainer.width + 70) / 2, // Position the button horizontally
      yAxis: 0, // Position the button vertically
      pointerAction: addBuster, // Action to use a booster
      iconImage: GameStore.images.clock, // Icon for the booster button
      width: 50 // Set the button width
    });
  };

  // Function to mute or unmute the game music
  const muteMusic = (): void => {
    GameStore.muteUnmuteMusic(); // Toggle the music state
  };

  // Function to use a booster
  const addBuster = (): void => {
    GameStore.useBooster(); // Activate a booster
  };

  // Add all buttons to the header container
  addMuteBtn(); // Add the mute button
  addPauseBtn(); // Add the pause button
  addBoosterBtn(); // Add the booster button

  // Add the header container to the application's stage
  app.stage.addChild(headerContainer);
};
