console.log("This app is running");

function extractTweetData(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    let tweetContainer = null;
    try {
        tweetContainer = doc.querySelector('div[data-testid="tweet"]');
    } catch (error) {
        console.error("Error selecting tweet container:", error);
    }
    let imageUrl = null;
    let tweetUrl = null;
    let tweetText = "";

    if (tweetContainer) {
        try {
            const tweetImage = tweetContainer.querySelector('div[data-testid="tweetPhoto"] img');
            if (tweetImage) {
                imageUrl = tweetImage.src;
            }
        } catch (error) {
            console.error("Error selecting tweet image:", error);
        }

        try {
            const tweetLink = tweetContainer.querySelector('a[href^="/status/"]');
            if (tweetLink) {
                tweetUrl = tweetLink.href;
            }
        } catch (error) {
            console.error("Error selecting tweet link:", error);
        }

        try {
            const tweetContent = tweetContainer.querySelector('div[data-testid="tweetText"]');
            if (tweetContent) {
                const contentTextNodes = tweetContent.childNodes;
                contentTextNodes.forEach(node => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        tweetText += node.textContent.trim() + " ";
                    }
                });
            }
        } catch (error) {
            console.error("Error selecting tweet content:", error);
        }
    }

    tweetData = {
        imageUrl,
        tweetUrl,
        tweetText: tweetText.trim()
    }
    console.log(tweetData)

    return tweetData;
}


function handleScroll() {
    extractTweetData(document.documentElement.innerHTML);
}

window.addEventListener("scroll", handleScroll);

// Initial call in case there are tweets present on page load
extractTweetData(document.documentElement.innerHTML);