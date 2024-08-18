async function calculator(rangeBegin, range) {
  const here = window.location.href;
  if (!here.includes('playlist')) {
    return 'no';
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
  console.log(targetTimeElements.length);
  const info =
    targetTimeElements.length == indexFinder()
      ? `<strong>${
          targetTimeElements.length
        }</strong>/<strong>${indexFinder()}</strong>`
      : `(<strong>${rangeBegin + 1}</strong> - <strong>${
          rangeBegin + range
        }</strong>)`;
  return `<p>${info} videos were included in the calculation!</p>
  <table id="resultTable"> 
    ${convertToTimeFormat(totalSeconds, 1)} ${convertToTimeFormat(
    totalSeconds,
    1.25
  )} ${convertToTimeFormat(totalSeconds, 1.5)} ${convertToTimeFormat(
    totalSeconds,
    1.75
  )} ${convertToTimeFormat(totalSeconds, 2)}
  </table>`;
}

function visibleElementsFinder(cl) {
  vElements = document.getElementsByClassName(cl);
  return Array.from(vElements).filter(isElementVisible);
}

function indexFinder() {
  const a = visibleElementsFinder('style-scope yt-formatted-string');
  let pre = '';
  for (let i = 0; i < a.length; i++) {
    if (a[i].textContent.includes('video')) break;
    else pre = a[i].textContent;
  }
  return pre;
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

function convertToTimeFormat(total, speed) {
  const totalSeconds = total / speed;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `<tr><td>(${speed}x)</td><td>${hours}h</td><td>${minutes}m</td><td>${Math.ceil(
    seconds
  )}s</td></tr>`;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'scrape') {
    (async () => {
      const i = Number(indexFinder());
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

// function uploadThem() {
//   const y = window.scrollY;
//   let i = 0;
//   const scrollInterval = () => {
//     window.scrollTo(0, i);
//     i += 200;
//     if (i >= document.documentElement.scrollHeight) {
//       window.scrollTo(0, y);
//       return;
//     }
//     setTimeout(scrollInterval, 5);
//   };
//   window.scrollTo(0, document.documentElement.scrollHeight);
//   setTimeout(scrollInterval, 250);
// }
