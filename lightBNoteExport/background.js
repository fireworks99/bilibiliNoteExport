// author: https://github.com/fireworks99/
chrome.action.onClicked.addListener(() => {
  getCurrentTabId((tabId) => {
    chrome.scripting.executeScript({
      target: {tabId: tabId},
      func: main
    });
  })
})

// The body of this function will be executed as a content script inside the current page
function main() {

  //function: element to string
  function e2s(obj){
    let o = document.createElement("div");
    o.appendChild(obj);
    return o.innerHTML;
  }

  //function: second to hh:mm:ss
  function s2hms(ss) {
    let s = parseInt(ss);
    let hour = 0;
    let min = 0;
    let result;
    if(s >= 3600) {
      hour = Math.floor(s / 3600);
      min = Math.floor((s - hour * 3600) / 60);
      s = (s - hour * 3600) % 60;
      result = `${hour.toString().padStart(2,'0')}:${min.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }else if (s < 3600 && s >= 60) {
      min = Math.floor(s / 60);
      s = s % 60;
      result = `${min.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }else {
      result = `${min.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    }
    return result;
  }

  //enlarge all images
  // {
  //   let qlImagePreview = document.getElementsByClassName("ql-image-preview");
  //   for (let i = 0; i < qlImagePreview.length; i++) {
  //     qlImagePreview[i].style.width = "100%";
  //   }
  //   let imgPreview = document.getElementsByClassName("img-preview");
  //   for (let i = 0; i < imgPreview.length; i++) {
  //     imgPreview[i].style.width = "100%";
  //   }
  // }

  //process time tags
  let note = document.getElementsByClassName("note-single-item--selected");
  let url;
  if(note.length > 0) url = 'https:' + note[0].getElementsByTagName("a")[0].getAttribute("href");
  else url = 'https://www.bilibili.com' + window.location.pathname + '?note=open';
  const style = `margin-top: 10px;background: #e6f4ff;border-radius: 12px;height: 22px;line-height: 19px;display: inline-block;padding: 0 12px;font-size: 12px;color: #2392e5;border: 1px solid #e6f4ff;cursor: pointer;font-weight: 700;`
  let tags = document.getElementsByClassName('ql-tag-blot');
  for (let i = 0; i < tags.length; i++) {
    let index = tags[i].getAttribute('data-index');
    let t = tags[i].getAttribute('data-seconds');
    let tStr = s2hms(t);
    let title = tags[i].getAttribute('data-title');
    let count = tags[i].getAttribute('data-cid-count');

    if (count === '1') {
      tags[i].getElementsByClassName("time-tag-item__text")[0].innerHTML = `<a href="${url}&p=${index}&t=${t}" target="_blank" style="${style}">${tStr}</a>`
    } else {
      tags[i].getElementsByClassName("time-tag-item__text")[0].innerHTML = `<a href="${url}&p=${index}&t=${t}" target="_blank" style="${style}">${title} P${index} - ${tStr}</a>`
    }
  }

  //fix missing highlight
  let spans = document.getElementsByTagName('span');
  for (let i = 0; i < spans.length; i++) {
    if(/ql-bg-*/.test(spans[i].className)) {
      spans[i].style = "-webkit-print-color-adjust: exact";
    }
  }

  //get the note.Remove other elements.
  let app = document.getElementById("app");
  let divs = document.getElementsByClassName("ql-editor");

  app.innerHTML = e2s(divs[0]);
  document.body.innerHTML = e2s(app);

  window.print();
}

function getCurrentTabId(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}
