function calculator() {
  const here = window.location.href;
  if (!here.includes('playlist')) {
    return `There is no playlist!`;
  }

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

  return `${
    targetTimeElements.length
  } videos were included in the calculation! <br>
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
    const data = calculator();
    sendResponse({ data: data });
  }
});
