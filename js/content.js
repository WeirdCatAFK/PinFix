console.log("PinFix is active");

function pinToPinterest(url, description, media) {
  const pinterestBaseURL = "https://www.pinterest.com/pin-builder/";
  const params = new URLSearchParams({ url, description, media });
  const pinterestURL = `${pinterestBaseURL}?${params.toString()}`;

  window.open(pinterestURL, "_blank", "width=600,height=400");
}

function getTweetUser(tweet) {
  try {
    return tweet
      .querySelectorAll('div[data-testid="User-Name"]')[0]
      .querySelector("a").innerText;
  } catch {
    try {
      return tweet
        .querySelectorAll('div[data-testid="User-Name"]')[1]
        .querySelector("a").innerText;
    } catch {
      return null;
    }
  }
}

function getTweetURL(tweet) {
  try {
    return tweet
      .querySelectorAll(
        'div[class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu"]'
      )[0]
      .querySelector("a").href;
  } catch {
    try {
      return tweet.querySelector(
        'div[class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu"]'
      ).href;
    } catch {
      return null;
    }
  }
}

function getTweetImages(tweet) {
  try {
    const tweetImgs = [];
    const tweetImgDivs = tweet.querySelectorAll(
      'div[data-testid="tweetPhoto"]'
    );
    tweetImgDivs.forEach((tweetImgDiv) => {
      const imgs = tweetImgDiv.querySelectorAll("img");
      tweetImgs.push(...imgs);
    });
    return tweetImgs;
  } catch {
    return null;
  }
}

function getTweetContent(tweet) {
  try {
    return tweet
      .querySelectorAll('div[data-testid="tweetText"]')[0]
      .querySelector("span").innerText;
  } catch {
    return null;
  }
}

function processTweet(tweet) {
  const tweetUser = getTweetUser(tweet);
  const tweetUrl = getTweetURL(tweet);
  const tweetImgs = getTweetImages(tweet);
  let tweetContent = getTweetContent(tweet);

  if (tweetUser && tweetUrl && tweetImgs) {
    // Handle null tweetContent
    tweetContent = tweetContent
      ? `${tweetContent} \n by ${tweetUser}`
      : `by ${tweetUser}`;

    tweetImgs.forEach((image) => {
      const existingButton =
        image.parentNode.parentNode.querySelector(".floating-button");
      if (existingButton) {
        existingButton.remove();
      }

      const container = document.createElement("div");
      container.classList.add("image-container");

      const button = document.createElement("button");
      button.classList.add("floating-button");
      button.innerText = "Pin";
      button.style.opacity = 0; // Initially hidden

      button.addEventListener("click", (event) => {
        event.preventDefault();
        const pinData = {
          url: tweetUrl,
          media: image.src,
          description: tweetContent,
        };
        pinToPinterest(pinData.url, pinData.description, pinData.media);
      });

      const grandparent = image.parentNode.parentNode;
      grandparent.appendChild(button);

      grandparent.addEventListener("mouseover", () => {
        button.style.opacity = 1;
      });

      grandparent.addEventListener("mouseleave", () => {
        setTimeout(() => {
          button.style.opacity = 0;
        }, 265);
      });

      container.appendChild(image);
      grandparent.insertBefore(container, button);
    });
  }
}

function observeTweets() {
  const tweetElements = document.querySelectorAll(
    "article[data-testid='tweet']"
  );

  tweetElements.forEach((tweet) => {
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

document.addEventListener("DOMContentLoaded", observeTweets);
window.addEventListener("scroll", observeTweets);
