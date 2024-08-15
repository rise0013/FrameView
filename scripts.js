window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);

  for (let i = 1; i <= 10; i++) {
    const videoUrl = urlParams.get(`video${i}`);
    const urlElement = document.getElementById(`url${i}`);
    const deleteElement = document.getElementById(`delete${i}`);

    // 要素が存在する場合にのみ処理を行う
    if (urlElement && deleteElement) {
      if (videoUrl) {
        urlElement.value = videoUrl;
        embedVideo(i, videoUrl);
      }

      // イベントリスナーを設定
      urlElement.addEventListener("blur", function () {
        updateUrlParam(i);
      });

      // 削除ボタンのイベントリスナーを設定
      deleteElement.addEventListener("click", function () {
        deleteVideo(i);
      });
    }
  }
};

function embedVideo(playerNumber, url) {
  const iframeContainer = document.getElementById(`videoFrame${playerNumber}`);
  if (iframeContainer) {
    iframeContainer.innerHTML = `<iframe src="${url}" height="300px" width="100%" frameborder="0"></iframe>`;
  }
}

function updateUrlParam(playerNumber) {
  const inputUrl = document.getElementById(`url${playerNumber}`).value.trim();
  if (inputUrl) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(`video${playerNumber}`, inputUrl);

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState(null, "", newUrl);

    embedVideo(playerNumber, inputUrl);
  }
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
