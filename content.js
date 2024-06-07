//Test version identificator
console.log("Water");

function find_elements_with_tags_and_attributes(
  element,
  tagName,
  attributeName,
  attributeValue
) {
  let stack = [element];

  while (stack.length > 0) {
    let current = stack.pop();
    if (
      current.tagName.toLowerCase() === tagName.toLowerCase() &&
      current.getAttribute(attributeName) === attributeValue
    ) {
      return current;
    }

    for (let child of current.children) {
      stack.push(child);
    }
  }

  // Return null if no matching element is found
  return null;
}

// contentScript.js
function main() {
  const tweetContainer = document.querySelectorAll(
    "article[data-testid='tweet']"
  );
  tweetContainer.forEach((tweet) => {
    try {
      tweetUser = find_elements_with_tags_and_attributes(
        tweet,
        "div",
        "data-testid",
        "User-Name"
      )
        .querySelector("div")
        .querySelector("div")
        .querySelector("a").href;
    } catch (error) {
      tweetUser = null;
    }
    try {
      tweetUrl = find_elements_with_tags_and_attributes(
        tweet,
        "div",
        "data-testid",
        "User-Name"
      )
        .querySelector('div[class="css-175oi2r r-18u37iz r-1wbh5a2 r-1ez5h0i"]')
        .querySelector('div[class="css-175oi2r r-18u37iz r-1q142lx"]')
        .querySelector("a").href;
    } catch (error) {
      tweetUrl = null;
    }

    if (tweetUrl !== null && tweetUser !== null) {
      console.log(tweetUrl);
      console.log(tweetUser);
    }
  });
}

// Add event listener to the window object
window.addEventListener("scroll", main);
