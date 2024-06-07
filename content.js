//Test version identificator
console.log("Spongebob");

function find_elements_with_tags_and_attributes(
  element,
  tagName,
  attributeName,
  attributeValue,
  wildcard = false
) {
  let stack = [element];

  while (stack.length > 0) {
    let current = stack.pop();
    if (wildcard === false) {
      if (
        current.tagName.toLowerCase() === tagName.toLowerCase() &&
        current.getAttribute(attributeName) === attributeValue
      ) {
        return current;
      }

      for (let child of current.children) {
        stack.push(child);
      }
    } else {
      if (
        current.tagName.toLowerCase() === tagName.toLowerCase() &&
        current.getAttribute(attributeName).href.search(attributeValue) !== -1
      ) {
        return current;
      }

      for (let child of current.children) {
        stack.push(child);
      }
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
    tweetUser = find_elements_with_tags_and_attributes(
      tweet,
      "div",
      "data-testid",
      "User-Name"
    )
      .querySelector("div")
      .querySelector("div")
      .querySelector("a").href;
    console.log(tweetUser);
    tweetUrl = find_elements_with_tags_and_attributes(
      tweet,
      "div",
      "href",
      new RegExp(`/${tweetUser.replace("https://x.com/", "")}/status/.*`), // create a regex pattern
      wildcard = true // set wildcard to true
    );
  });
}

// Add event listener to the window object
window.addEventListener("scroll", main);
