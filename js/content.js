console.log("PinFix is active");

function pinFirst(url, description) {
  const pinterestBaseURL = "https://www.pinterest.com/pin/create/button/";
  const params = new URLSearchParams({ url, description });
  const pinterestURL = `${pinterestBaseURL}?${params.toString()}`;

  window.open(pinterestURL, "_blank", "width=600,height=400");
}

function pinNext(url, media, description) {
  const baseUrl = "https://www.pinterest.com/pin/create/button/";
  const params = new URLSearchParams({
    url: url,
    media: media,
    description: description,
  });
  const pinterestURL = `${baseUrl}?${params.toString()}`;

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
    const timeElement = tweet.querySelector("time");
    if (timeElement) {
      const link = timeElement.closest("a");
      if (link) {
        return link.href;
      }
    }
    // Fallback to original logic
    return tweet
      .querySelectorAll(
        'div[class="css-175oi2r r-16y2uox r-1pi2tsx r-13qz1uu"]'
      )[0]
      .querySelector("a").href;
  } catch {
    return null;
  }
}

// Scans the tweet for media and separates them into 'video' or 'image' types.

function getTweetMedia(tweet) {
  try {
    const mediaItems = [];

    // VIDEOS / GIFS
    const videoPlayers = tweet.querySelectorAll(
      'div[data-testid="videoPlayer"]'
    );

    videoPlayers.forEach((player) => {
      const video = player.querySelector("video");
      if (video && video.poster) {
        mediaItems.push({
          type: "video",
          container: player, // Attach button to the player container
          src: video.poster,
        });
      }
    });

    // IMAGES
    const tweetPhotoDivs = tweet.querySelectorAll(
      'div[data-testid="tweetPhoto"]'
    );

    tweetPhotoDivs.forEach((container) => {
      if (container.querySelector('div[data-testid="videoPlayer"]')) return;

      const imgs = container.querySelectorAll("img");
      imgs.forEach((img) => {
        if (img.closest('[data-testid="Tweet-User-Avatar"]')) return;

        mediaItems.push({
          type: "image",
          element: img,
          src: img.src,
        });
      });
    });

    return mediaItems;
  } catch (e) {
    console.error("PinFix Error:", e);
    return [];
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
function getMediaItemUrl(mediaItem) {
  try {
    const element = mediaItem.element || mediaItem.container;

    // Find the closest anchor tag wrapping this media
    const link = element.closest("a");

    if (link && link.href) {
      if (link.href.includes("/status/")) {
        const urlObj = new URL(link.href);
        const match = urlObj.pathname.match(/(\/[^\/]+\/status\/\d+)/);
        if (match) {
          return urlObj.origin + match[1];
        }
      }
    }
  } catch (e) {
    // Fallback to null if anything fails
    return null;
  }
  return null;
}

function processTweet(tweet) {
  const tweetUser = getTweetUser(tweet);
  const mainTweetUrl = getTweetURL(tweet); // This is the container tweet's URL
  const mediaItems = getTweetMedia(tweet);
  let tweetContent = getTweetContent(tweet);

  if (tweetUser && mainTweetUrl && mediaItems && mediaItems.length > 0) {
    tweetContent = tweetContent
      ? `${tweetContent} \n by ${tweetUser}`
      : `by ${tweetUser}`;

    mediaItems.forEach((item, index) => {
      const button = document.createElement("button");
      button.classList.add("floating-button");
      button.innerText = "Pin";
      button.style.opacity = 0;
      button.style.zIndex = "9999";

      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();

        const specificUrl = getMediaItemUrl(item);
        const pinUrl = specificUrl || mainTweetUrl;

        const pinData = {
          url: pinUrl,
          media: item.src,
          description: tweetContent,
        };

        if (index === 0) {
          pinFirst(pinData.url, pinData.description);
        } else {
          pinNext(pinData.url, pinData.media, pinData.description);
        }
      });

      // Videos and gifs
      if (item.type === "video") {
        const container = item.container;
        if (container.querySelector(".floating-button")) return;
        container.style.position = "relative";
        container.appendChild(button);
        container.addEventListener("mouseenter", () => {
          button.style.opacity = 1;
        });
        container.addEventListener("mouseleave", () => {
          button.style.opacity = 0;
        });
      }

      // Original Images
      else if (item.type === "image") {
        const image = item.element;
        // Safety check to ensure we have a valid structure
        if (!image.parentNode || !image.parentNode.parentNode) return;

        const grandparent = image.parentNode.parentNode;

        if (grandparent.querySelector(".floating-button")) return;

        const container = document.createElement("div");
        container.classList.add("image-container");

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
      }
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
