let timeDuration = 0;
let xx = 1;
let resTitle = '';
document.getElementById('calculate').addEventListener('click', () => {
  const res = document.getElementById('result');
  const cal = document.getElementById('calculator');
  cal.style.display = 'none';
  res.style.display = 'flex';
  res.innerHTML = '';
  res.classList.add('loading');
  const b = document.getElementById('beginId').value;
  const begin = b ? (b > 0 ? Number(b) : 1) : 1;
  const e = document.getElementById('endId').value;
  const end = e ? (Number(e) >= Number(begin) ? Number(e) : 999) : 999;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'scrape', begin: begin, end: end },
      (response) => {
        res.classList.remove('loading');
        if (response.data[0] === `no`) {
          res.innerHTML = `<p style="transform: translateY(10px)"><b>Playlist does not exist!</b></p>`;
          setTimeout(() => {
            res.style.display = 'none';
            cal.style.display = 'unset';
          }, 1500);
        } else {
          resTitle = response.data[0];
          timeDuration = response.data[1];
          res.innerHTML = `<p>${resTitle}</p> <label id="rangeNumber" for="range"><br></label>
      <input
        type="range"
        id="range"
        value="${xx}"
        min="0.25"
        max="10"
        step="0.05"
      />
      ${convertToTimeFormat(timeDuration, xx)}
      `;
        }
      }
    );
  });
});

function convertToTimeFormat(total, speed) {
  const totalSeconds = total / speed;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `<table id = "resultTable"><tr><td>(${speed}x)</td><td>${hours}h</td><td>${minutes}m</td><td>${Math.ceil(
    seconds
  )}s</td></tr></table>`;
}

document.getElementById('contact').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'c' }, () => {});
    window.close();
  });
});

document.getElementById('scrollTop').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: 'scrollT' },
      (response) => {}
    );
  });
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let tab = tabs[0];
    let url = tab.url;
    if (!url.startsWith('https://www.youtube.com/')) {
      //chrome.tabs.remove(tab.id);
      window.close();
    }
  });

  const buttons = document.getElementsByClassName('calcButton');

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    const tooltip = button.querySelector('.tooltip');

    let hovertimer;
    button.addEventListener('mouseover', (event) => {
      hovertimer = setTimeout(() => {
        tooltip.textContent = button.getAttribute('data-tooltip');
        tooltip.style.display = 'block';
        tooltip.style.left = `${event.pageX + 10}px`; // Sağ tarafta biraz boşluk bırak
        tooltip.style.top = `${event.pageY + 10}px`; // Alt tarafta biraz boşluk bırak
      }, 1000);
    });

    button.addEventListener('mouseout', () => {
      clearTimeout(hovertimer);
      tooltip.style.display = 'none';
    });

    button.addEventListener('click', () => {
      clearTimeout(hovertimer);
      tooltip.style.display = 'none';
    });
  }
});

document.getElementById('calTab').addEventListener('click', () => {
  document.getElementById('result').style.display = 'none';
  document.getElementById('calculator').style.display = 'unset';
});

setTimeout(() => {
  document.getElementById('calculator').style.display = 'unset';
}, 1000);

document.getElementById('all').addEventListener('click', () => {
  document.getElementById('beginId').value = '0';
  document.getElementById('endId').value = '999';
});

document.addEventListener('change', function (event) {
  if (event.target && event.target.type === 'range') {
    xx = document.getElementById('range').value;
    const res = document.getElementById('result');
    res.innerHTML = `<p>${resTitle}</p> <label id="rangeNumber" for="range"><br></label>
  <input
    type="range"
    id="range"
    value="${xx}"
    min="0.25"
    max="10"
    step="0.05"
  />
  ${convertToTimeFormat(timeDuration, xx)}
  `;
  }
});

document.addEventListener('input', function (event) {
  if (event.target && event.target.type === 'range') {
    document.getElementById(
      'rangeNumber'
    ).textContent = `(${event.target.value}x)`;
  }
});
