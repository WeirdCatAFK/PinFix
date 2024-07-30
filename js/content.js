console.log("PinFix is active");

function pin(src, media, description) {
  const baseUrl = "https://www.pinterest.com/pin/create/button/";
  const params = new URLSearchParams({
    url: src,
    media: media,
    description: description,
  });

  const pinterestURL = `${baseUrl}?${params.toString()}`;

  window.open(pinterestURL, "_blank", "width=600,height=400");
}

//Gets most content of the tweet to be handled by the
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
      .querySelectorAll(
        'div[class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu"]'
      )[0]
      .querySelector("a").href;
  } catch (error) {
    tweetUrl = null;
  }
  if (tweetUrl === null) {
    try {
      tweetUrl = tweet.querySelector(
        'div[class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu"]'
      ).href;
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
  console.log(tweetImgs);

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

      button.addEventListener("click", (event) => {
        event.preventDefault();
        const pinData = {
          url: tweetUrl,
          media: image.src,
          description: tweetContent,
        };
        pin(pinData.url, pinData.media, pinData.description);
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
