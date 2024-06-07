//Test version identificator
console.log("Pim from the smiling friends");

function find_elements_with_tags_and_attributes(
  element,
  tagName,
  attributeName,
  attributeValue
) {
  let stack = [element];
  let result = [];

  while (stack.length > 0) {
    let current = stack.pop();
    if (
      current.tagName.toLowerCase() === tagName.toLowerCase() &&
      current.getAttribute(attributeName) === attributeValue
    ) {
      result.push(current);
    }

    for (let child of current.children) {
      stack.push(child);
    }
  }
  return result;
}

function main() {
  const tweetContainer = document.querySelectorAll(
    "article[data-testid='tweet']"
  );
  tweetContainer.forEach((tweet) => {
    //Get tweet User
    try {
      tweetUser = find_elements_with_tags_and_attributes(
        tweet,
        "div",
        "data-testid",
        "User-Name"
      )[0]
        .querySelector("div")
        .querySelector("div")
        .querySelector("a").href;
    } catch (error) {
      tweetUser = null;
    }
    //Get tweet Url
    try {
      tweetUrl = find_elements_with_tags_and_attributes(
        tweet,
        "div",
        "data-testid",
        "User-Name"
      )[0]
        .querySelector('div[class="css-175oi2r r-18u37iz r-1wbh5a2 r-1ez5h0i"]')
        .querySelector('div[class="css-175oi2r r-18u37iz r-1q142lx"]')
        .querySelector("a").href;
    } catch (error) {
      tweetUrl = null;
    }
    //Get tweet imgs
    let tweetImgs = null;
    try {
      tweetImgs = [];

      let tweetImgDivs = find_elements_with_tags_and_attributes(
        tweet,
        "div",
        "data-testid",
        "tweetPhoto"
      );

      for (let tweetImgDiv of tweetImgDivs) {
        let imgs = tweetImgDiv.querySelectorAll("img");
        tweetImgs.push(...imgs);
      }
    } catch (error) {
      tweetImgs = null;
    }

    //Testing
    if (tweetUrl !== null && tweetUser !== null && tweetImgs !== null) {
      console.log(tweetUrl);
      console.log(tweetUser);
      console.log(tweetImgs);

      //Add a pinterest save button to each image
      tweetImgs.forEach((image) => {
        // Remove any existing button
        const existingButton =
          image.parentNode.querySelector(".floating-button");
        if (existingButton) {
          existingButton.remove();
        }

        const container = document.createElement("div");
        container.classList.add("image-container");

        const button = document.createElement("button");
        button.classList.add("floating-button");
        button.innerText = "Save";

        button.addEventListener("click", () => {
          alert("Button clicked on image: " + image.src);
          // Add your desired functionality here
        });

        image.parentNode.insertBefore(container, image);
        container.appendChild(image);
        container.appendChild(button);
      });
    }
  });
}

// Add event listener to the window object
window.addEventListener("scroll", main);
