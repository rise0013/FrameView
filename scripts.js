window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);

  for (let i = 1; i <= 10; i++) {
    const videoUrl = urlParams.get(`video${i}`);
    const videoTitle = urlParams.get(`title${i}`);
    const urlElement = document.getElementById(`url${i}`);
    const titleElement = document.getElementById(`title${i}`);
    const deleteElement = document.getElementById(`delete${i}`);

    if (urlElement && titleElement && deleteElement) {
      if (videoUrl) {
        urlElement.value = videoUrl;
        embedVideo(i, convertToEmbedUrl(videoUrl)); // 埋め込み用URLを使用
      }
      if (videoTitle) {
        titleElement.value = videoTitle;
      }

      // URL入力欄のイベントリスナーを設定
      urlElement.addEventListener("blur", function () {
        const originalUrl = urlElement.value.trim();
        const updatedUrl = convertToEmbedUrl(originalUrl);
        updateUrlAndTitleParam(i, originalUrl, titleElement.value.trim());
        embedVideo(i, updatedUrl); // 埋め込み用URLを使用してiframeを生成
      });

      // タイトル入力欄のイベントリスナーを設定
      titleElement.addEventListener("blur", function () {
        updateUrlAndTitleParam(
          i,
          urlElement.value.trim(),
          titleElement.value.trim()
        );
      });

      // 削除ボタンのイベントリスナーを設定
      deleteElement.addEventListener("click", function () {
        deleteVideoAndTitle(i);
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
  if (iframeContainer && url) {
    let height = 200;
    if (url.includes("tiktok.com")) {
      height = 600;
    } else if (url.includes("bilibili.com")) {
      height = 350;
    }
    iframeContainer.innerHTML =
      "<iframe src='" +
      url +
      "' height='" +
      height +
      "px' width='100%' frameborder='0' allowfullscreen></iframe>";
  } else if (iframeContainer) {
    iframeContainer.innerHTML = ""; // URLがない場合はiframeを消去
  }
}

function updateUrlAndTitleParam(playerNumber, originalUrl, title) {
  const urlParams = new URLSearchParams(window.location.search);
  if (originalUrl) {
    urlParams.set(`video${playerNumber}`, originalUrl);
  } else {
    urlParams.delete(`video${playerNumber}`);
  }

  if (title) {
    urlParams.set(`title${playerNumber}`, title);
  } else {
    urlParams.delete(`title${playerNumber}`);
  }

  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, "", newUrl);
}

function deleteVideoAndTitle(playerNumber) {
  document.getElementById(`url${playerNumber}`).value = "";
  document.getElementById(`title${playerNumber}`).value = "";
  const iframeContainer = document.getElementById(`videoFrame${playerNumber}`);
  if (iframeContainer) {
    iframeContainer.innerHTML = "";
  }

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.delete(`video${playerNumber}`);
  urlParams.delete(`title${playerNumber}`);
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState(null, "", newUrl);
}
