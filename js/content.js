console.log("PinFix is active");
// content.js

function loadPinitScript() {
  var script = document.createElement("script");
  script.src = chrome.runtime.getURL("js/pinit.js") + "?" + Math.random();
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

loadPinitScript();

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
        .querySelector("a").innerText;
    } catch (error) {
      tweetUser = null;
    }
    if (tweetUser === null) {
      try {
        tweetUser = find_elements_with_tags_and_attributes(
          tweet,
          "div",
          "data-testid",
          "User-Name"
        )[1]
          .querySelector("div")
          .querySelector("div")
          .querySelector("a").innerText;
      } catch (error) {
        tweetUser = null;
      }
    }
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
    if (tweetUrl === null) {
      try {
        tweetUrl = tweet
          .querySelector(
            'div[class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu"]'
          )
          .querySelector("a").href;
      } catch (error) {
        tweetUrl = null;
      }
    }
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
      let pinDescription = `${tweetContent} \n by ${tweetUser}`;
      tweetImgs.forEach((image) => {
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
          PinUtils.pinOne({
            url: tweetUrl,
            title: `by ${tweetUser}`,
            media: `${image.src}`,
            description: `${pinDescription}`,
          });
        });

        image.parentNode.insertBefore(container, image);
        container.appendChild(image);
        container.appendChild(button);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  main();
});
window.addEventListener("scroll", main);
