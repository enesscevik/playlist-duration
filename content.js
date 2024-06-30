function calculator() {
  timeElements = document.getElementsByClassName('badge-shape-wiz__text');

  let targetTimeElements = Array.from(timeElements).filter(isElementVisible);

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

  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds % 3600) / 60);
  let seconds = totalSeconds % 60;

  return `     Total: ${hours}h ${minutes}m ${seconds}s (${targetTimeElements.length})`;
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

let newText = '';
function renderer() {
  const here = window.location.href;
  if (here.includes('playlist')) {
    newText = original + calculator();
    const targetAdr = document.querySelector(
      '#page-manager > ytd-browse:nth-child(1) > yt-page-header-renderer > yt-page-header-view-model > div.page-header-view-model-wiz__page-header-content > div.page-header-view-model-wiz__page-header-headline > div > yt-content-metadata-view-model > div:nth-child(2) > span:nth-child(1)'
    );
    try {
      targetAdr.textContent = newText;
    } catch {
      console.log('error');
    }
  } else console.log('here is not a playlist');
}

const targetAdrr = document.querySelector(
  '#page-manager > ytd-browse:nth-child(1) > yt-page-header-renderer > yt-page-header-view-model > div.page-header-view-model-wiz__page-header-content > div.page-header-view-model-wiz__page-header-headline > div > yt-content-metadata-view-model > div:nth-child(2) > span:nth-child(1)'
);
targetAdrr.addEventListener('click', () => {
  renderer();
});
let original = '';
try {
  targetAdrr.style.cursor = 'pointer';
  original = targetAdrr.textContent;
} catch {
  original = '? video';
}
targetAdrr.addEventListener('mouseover', function () {
  // Açıklama içeriğini oluştur ve ekleyin
  const ind = targetAdrr.textContent.indexOf('video');
  original = targetAdrr.textContent.substring(0, ind + 5);
  newText = original;
  targetAdrr.textContent = 'Click to calculate the duration!';

  targetAdrr.addEventListener('mouseout', function () {
    targetAdrr.textContent = newText;
  });
});
