document.getElementById('calcButton').addEventListener('click', () => {
  const res = document.getElementById('result');
  res.innerHTML = '';
  res.classList.add('loading');
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'scrape' }, (response) => {
      res.classList.remove('loading');
      res.innerHTML = response.data;
    });
  });
});
