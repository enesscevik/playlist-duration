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
        if (response.data == 'no') {
          res.innerHTML = `<p style="transform: translateY(10px)"><b>There is no playlist!</b></p>`;
          setTimeout(() => {
            res.style.display = 'none';
            cal.style.display = 'unset';
          }, 1500);
        } else res.innerHTML = response.data;
      }
    );
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
