//Test version identificator
console.log("Well Better than the dialectics");

// contentScript.js
function test() {
  const tweetText_Container = document.querySelectorAll(
    "div[data-testid='tweetText']"
  );
  const tweetTexts = [];

  tweetText_Container.forEach((aTag) => {
    tweetTexts.push(aTag.querySelector("span").textContent);
  });
}

function handleScroll() {
  test();
}

// Add event listener to the window object
window.addEventListener("scroll", handleScroll);
