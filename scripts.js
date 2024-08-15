window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);

  for (let i = 1; i <= 10; i++) {
    const videoUrl = urlParams.get(`video${i}`);
    const urlElement = document.getElementById(`url${i}`);
    const deleteElement = document.getElementById(`delete${i}`);

    if (urlElement && deleteElement) {
      if (videoUrl) {
        urlElement.value = videoUrl;
        embedVideo(i, videoUrl);
      }

      // イベントリスナーを設定
      urlElement.addEventListener("blur", function () {
        const updatedUrl = convertToEmbedUrl(urlElement.value.trim());
        updateUrlParam(i, updatedUrl);
      });

      // 削除ボタンのイベントリスナーを設定
      deleteElement.addEventListener("click", function () {
        deleteVideo(i);
      });
    }
  }
};

function convertToEmbedUrl(url) {
  let newUrl = url;

  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    newUrl = url
      .replace("youtube.com/watch?v=", "youtube.com/embed/")
      .replace("youtu.be/", "youtube.com/embed/");
    if (newUrl.includes("&")) {
      newUrl = newUrl.substring(0, newUrl.indexOf("&"));
    }
  } else if (url.includes("nicovideo.jp")) {
    newUrl = url
      .replace("www.nicovideo.jp/watch", "embed.nicovideo.jp/watch")
      .replace("sp.nicovideo.jp/watch", "embed.nicovideo.jp/watch");
  } else if (url.includes("tiktok.com")) {
    const contentID = url.split("video/")[1].split("?")[0];
    newUrl = `https://www.tiktok.com/embed/${contentID}`;
  }

  return newUrl;
}

function embedVideo(playerNumber, url) {
  const iframeContainer = document.getElementById(`videoFrame${playerNumber}`);
  if (iframeContainer) {
    let height = 200;
    if (url.includes("tiktok.com")) {
      height = 700;
    } else if (url.includes("bilibili.com")) {
      height = 500;
    }
    iframeContainer.innerHTML =
      "<iframe src='${url}' height='" +
      height +
      "px' width='100%' frameborder='0' allowfullscreen></iframe>";
  }
}

function updateUrlParam(playerNumber, url) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(`video${playerNumber}`, url);

  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, "", newUrl);

  embedVideo(playerNumber, url);
}

function deleteVideo(playerNumber) {
  document.getElementById(`url${playerNumber}`).value = "";
  const iframeContainer = document.getElementById(`videoFrame${playerNumber}`);
  if (iframeContainer) {
    iframeContainer.innerHTML = "";
  }

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete(`video${playerNumber}`);
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, "", newUrl);
}
