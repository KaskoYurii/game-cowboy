import { Container, Sprite } from "pixi.js";
import GameStore from "@/store/gameStore";

export const levelRating = (parentContainer: Container | null): void => {
  if (parentContainer) {
    let stars = 0;
    const levelTime = GameStore.levelTime;

    // Determine the number of stars based on the level completion time
    if (levelTime > 40) {
      stars = 3; // Award 3 stars for a time greater than 40 seconds
    } else if (levelTime > 20 && levelTime < 40) {
      stars = 2; // Award 2 stars for a time between 20 and 40 seconds
    } else if (levelTime < 20) {
      stars = 1; // Award 1 star for a time less than 20 seconds
    }

    // Create a container for the star rating
    const ratingContainer = new Container();
    ratingContainer.x = (parentContainer.width - 100) / 2; // Center the container horizontally
    ratingContainer.y = (parentContainer.height + 50) / 2; // Position the container vertically
    ratingContainer.zIndex = 1; // Ensure the container appears above other elements

    const starSize = 24; // Define the size of each star
    const starSpacing = 10; // Define the spacing between stars

    // Add stars to the rating container based on the calculated number
    for (let i = 0; i < stars; i++) {
      const star = Sprite.from(GameStore.images.star); // Create a star sprite
      star.width = starSize; // Set the width of the star
      star.height = starSize; // Set the height of the star
      star.x = i * (starSize + starSpacing); // Position the star with spacing
      ratingContainer.addChild(star); // Add the star to the rating container
    }

    // Add the rating container to the parent container
    parentContainer.addChild(ratingContainer);
  }
};
