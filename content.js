console.log("Active");

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
    // Get tweet User
    let tweetUser;
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
    // Get tweet Url
    let tweetUrl;
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
    // Get tweet imgs
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
    // Get tweet content
    let tweetContent;
    try {
      tweetContent = find_elements_with_tags_and_attributes(
        tweet,
        "div",
        "data-testid",
        "tweetText"
      )[0].querySelector("span").innerText;
    } catch (error) {
      tweetContent = null;
    }

    if (tweetUrl !== null && tweetUser !== null && tweetImgs !== null) {
      // Add a Pinterest save button to each image
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
        button.innerText = "Pin";
        button.addEventListener("click", () => {
          // Create the Pinterest save button
          const pinUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(
            tweetUrl
          )}&media=${encodeURIComponent(
            image.src
          )}&description=${encodeURIComponent(tweetUser)}`;

          // Open the Pinterest pin creation in a new tab
          window.open(pinUrl, "_blank");
        });

        image.parentNode.insertBefore(container, image);
        container.appendChild(image);
        container.appendChild(button);
      });
    }
  });
}

main();

// Add event listener to the window object
window.addEventListener("scroll", main);
