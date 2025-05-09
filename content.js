async function calculator(rangeBegin, range) {
  const here = window.location.href;
  if (!here.includes('playlist')) {
    return [`no`, 0];
  }
  let targetTimeElements = visibleElementsFinder('badge-shape-wiz__text');
  if (targetTimeElements.length != indexFinder()) {
    await uploadThemAsync();
    targetTimeElements = visibleElementsFinder('badge-shape-wiz__text');
  }
  targetTimeElements = targetTimeElements.splice(rangeBegin, range);
  let totalSeconds = 0;
  targetTimeElements.forEach((el) => {
    let timeText = el.textContent.trim();
    let timeParts = timeText.split(':').map(Number);

    if (timeParts.length === 3) {
      totalSeconds += timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
    } else if (timeParts.length === 2) {
      totalSeconds += timeParts[0] * 60 + timeParts[1];
    }
  });
  //console.log(targetTimeElements.length);
  const info =
    targetTimeElements.length == indexFinder()
      ? `<strong>${
          targetTimeElements.length
        }</strong>/<strong>${indexFinder()}</strong>`
      : `(<strong>${rangeBegin + 1}</strong> - <strong>${
          rangeBegin + range
        }</strong>)`;
  return [
    `<p>${info} videos were included in the calculation!</p>`,
    totalSeconds,
  ];
}

function visibleElementsFinder(cl) {
  vElements = document.getElementsByClassName(cl);
  return Array.from(vElements).filter(isElementVisible);
}

// önceki metod
// function indexFinder() {
//   const a = visibleElementsFinder('style-scope yt-formatted-string');
//   let pre = '';
//   for (let i = 0; i < a.length; i++) {
//     if (a[i].textContent.includes('video')) break;
//     else pre = a[i].textContent;
//   }
//   return pre ;
// }
function indexFinder() {
  const a = visibleElementsFinder(
    'yt-core-attributed-string yt-content-metadata-view-model-wiz__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color'
  );
  let pre = a[1] !== undefined ? a[1].textContent : 0;
  return parseInt(pre);
}

function isElementVisible(el) {
  let style = getComputedStyle(el);
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    el.offsetWidth > 0 &&
    el.offsetHeight > 0
  );
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrape') {
    (async () => {
      const i = indexFinder();
      const begin = message.begin <= i ? message.begin : 1;
      const end = message.end <= i ? message.end : i;

      const data = await calculator(begin - 1, end - begin + 1);

      sendResponse({ data: data });
    })();
    return true;
  }
  if (message.action === 'scrollT') {
    if (
      document.documentElement.scrollHeight - window.scrollY >=
      window.scrollY
    )
      window.scrollTo(0, document.documentElement.scrollHeight);
    else window.scrollTo(0, 0);
  }
  if (message.action === 'c') {
    window.location.href =
      'https://docs.google.com/forms/d/e/1FAIpQLSdydgQnMK0WGsteJJ70hq_vlzJ-BCytLT4ouloZMbgnm2_sxw/viewform?usp=header';
  }
});

function scrollPage() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      window.scrollBy(0, window.innerHeight);
      if (
        document.documentElement.scrollHeight <=
        window.scrollY + window.innerHeight
      ) {
        clearInterval(interval);
        resolve();
      }
    }, 5);
  });
}
// async function uploadThemv2() {
//   const y = window.scrollY;
//   let s = -200;
//   window.scrollTo(0, 0);
//   while (true) {
//     const uploaded = visibleElementsFinder('badge-shape-wiz__text').length;
//     if (uploaded == totalVideos) break;
//     s += 200;
//     window.scrollTo(0, s);
//     await new Promise((resolve) => setTimeout(resolve, 5)); // 1 saniye bekleme
//     console.log(uploaded + ' != ' + totalVideos);
//   }
//   window.scrollTo(0, y);
// }

async function uploadThemAsync() {
  const y = window.scrollY;
  let i = 0;

  const scrollInterval = () => {
    return new Promise(async (resolve) => {
      const scrollStep = async () => {
        window.scrollTo(0, i);
        i += 200;

        if (i >= document.documentElement.scrollHeight) {
          window.scrollTo(0, y);
          resolve();
          return;
        }

        await new Promise((res) => setTimeout(res, 5));
        await scrollStep(); // Bir sonraki adıma geç
      };

      await scrollStep(); // İlk kaydırma adımını başlat
    });
  };

  window.scrollTo(0, document.documentElement.scrollHeight);
  await new Promise((resolve) => setTimeout(resolve, 250)); // Sayfanın yüklenmesini bekleyin
  await scrollInterval(); // Sayfanın sonuna kadar kaydırmayı başlatın
}
