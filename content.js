// This script is injected into web pages to enable text selection tracking.
document.addEventListener("mouseup", function () {
  var selectedText = window.getSelection().toString();
  if (selectedText && selectedText.trim() !== "") {
    chrome.runtime.sendMessage({ action: "updateSelection", text: selectedText });
  }
});
