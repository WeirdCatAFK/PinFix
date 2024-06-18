console.log("PinFix is active");

//Load local copy of pinterest js script
const script = document.createElement("script");
script.src = chrome.runtime.getURL("js/pinit.js") + "?" + Math.random();
script.async = true;
script.defer = true;
document.head.appendChild(script);

let pageColor;

function processTweet(tweet) {
  let tweetUser;
  try {
    tweetUser = tweet
      .querySelectorAll('div[data-testid="User-Name"]')[0]
      .querySelector("a").innerText;
  } catch (error) {
    tweetUser = null;
  }
  if (tweetUser === null) {
    try {
      tweetUser = tweet
        .querySelectorAll('div[data-testid="User-Name"]')[1]
        .querySelector("a").innerText;
    } catch (error) {
      tweetUser = null;
    }
  }

  let tweetUrl;
  try {
    tweetUrl = tweet
      .querySelectorAll('div[data-testid="User-Name"]')[0]
      .querySelector("a").href;
  } catch (error) {
    tweetUrl = null;
  }
  if (tweetUrl === null) {
    try {
      tweetUrl = tweet.querySelector("div.css-175oi2r a").href;
    } catch (error) {
      tweetUrl = null;
    }
  }

  let tweetImgs = null;
  try {
    tweetImgs = [];
    let tweetImgDivs = tweet.querySelectorAll('div[data-testid="tweetPhoto"]');
    for (let tweetImgDiv of tweetImgDivs) {
      let imgs = tweetImgDiv.querySelectorAll("img");
      tweetImgs.push(...imgs);
    }
  } catch (error) {
    tweetImgs = null;
  }

  let tweetContent;
  try {
    tweetContent = tweet
      .querySelectorAll('div[data-testid="tweetText"]')[0]
      .querySelector("span").innerText;
  } catch (error) {
    tweetContent = null;
  }

  if (tweetUrl !== null && tweetUser !== null && tweetImgs !== null) {
    tweetImgs.forEach((image) => {
      const existingButton = image.parentNode.querySelector(".floating-button");
      if (existingButton) {
        existingButton.remove();
      }
      const container = document.createElement("div");
      container.classList.add("image-container");

      const button = document.createElement("button");
      button.classList.add("floating-button");
      button.innerText = "Pin";

      try {
        pageColor =
          document.querySelectorAll("a.css-175oi2r")[1].style.backgroundColor;
      } catch (error) {
        console.log(error);
        pageColor = "rgb(200, 35, 44)";
      }
      button.style.backgroundColor = pageColor;

      button.addEventListener("click", () => {
        const pinData = {
          url: tweetUrl,
          media: image.src,
          description: `${tweetContent} \n by ${tweetUser}`,
          title: `by ${tweetUser}`,
        };
        console.log("Pin Data:", pinData); // Log para depuración
        PinUtils.pinOne(pinData);
      });

      image.parentNode.insertBefore(container, image);
      container.appendChild(image);
      container.appendChild(button);
    });
  }
}

function main() {
  const tweetContainer = document.querySelectorAll(
    "article[data-testid='tweet']"
  );

  tweetContainer.forEach((tweet) => {
    if (!tweet.classList.contains("processed")) {
      tweet.classList.add("processed");
      observer.observe(tweet);
    }
  });
}

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        processTweet(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }
);

document.addEventListener("DOMContentLoaded", function () {
  main();
});
window.addEventListener("scroll", main);
