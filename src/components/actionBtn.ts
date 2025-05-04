import { Text, Container, Graphics, Sprite, Texture } from "pixi.js";

export type ActionButton = {
  parentContainer: Container; // The container to which the button will be added
  text: string; // The text displayed on the button
  xAxis: number; // X-coordinate for the button's position
  yAxis: number; // Y-coordinate for the button's position
  pointerAction: () => void; // Function to execute when the button is clicked
  iconImage?: Texture; // Optional icon texture for the button
  width?: number; // Optional width of the button (default is 200)
  height?: number; // Optional height of the button (default is 50)
};

export const actionBtn = ({
  parentContainer,
  text,
  xAxis,
  yAxis,
  pointerAction,
  iconImage,
  width = 200,
  height = 50
}: ActionButton) => {
  const button = new Container();

  // Create the button background with rounded corners and a solid color
  const background = new Graphics()
    .roundRect(0, 0, width, height, 10) // Draw a rounded rectangle
    .fill("cbf3f0"); // Set the fill color for the background

  // Add an optional icon to the button
  if (iconImage) {
    const icon = Sprite.from(iconImage);
    icon.anchor.set(0.5); // Center the icon's anchor point
    icon.position.set(25, 25); // Position the icon inside the button
    icon.setSize(24); // Set the size of the icon
    icon.zIndex = 1; // Ensure the icon appears above the background
    button.addChild(icon);
  }

  // Create and style the button's text label
  const label = new Text({
    text: text, // Set the button's text
    style: {
      fontFamily: "Arial", // Font family for the text
      fill: "black", // Text color
      fontSize: 24, // Font size
      align: "center", // Center-align the text
      fontWeight: "bold" // Make the text bold
    }
  });

  label.anchor.set(0.5); // Center the text's anchor point
  label.position.set(100, 25); // Position the text inside the button

  // Add the background and text label to the button
  button.addChild(background, label);

  // Set the button's position on the screen
  button.position.set(xAxis, yAxis);

  // Enable pointer events for the button
  button.eventMode = "static"; // Use the new API instead of `interactive = true`
  button.cursor = "pointer"; // Change the cursor to a hand on hover

  // Attach the click event handler
  button.on("pointerdown", pointerAction);

  // Add hover effects for the button
  button.on("pointerover", () => {
    background.tint = "#2ec4b6"; // Change the background color on hover
  });

  button.on("pointerout", () => {
    background.tint = "#cbf3f0"; // Revert the background color when not hovering
  });

  // Add the button to the specified parent container
  parentContainer.addChild(button);

  // Return the button instance
  return button;
};
