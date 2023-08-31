let isPrinting = false;

document.getElementById('send').addEventListener('click', sendUserInput);
//拿到选中项的值  option中value值
// console.log(select.text()); //拿到选中项的文本

// Trigger send button with enter key
document.getElementById('userInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendUserInput();
  } // 这段代码添加了一个事件监听器，当用户在id为'userInput'的元素上按下键盘上的任意键时，
  // 会触发一个回调函数。如果按下的键是Enter键，则会阻止默认行为（即防止在文本框中输入回车符）并调用名为sendUserInput()的函数。
});

function sendUserInput() {
  if (isPrinting) return; // Don't allow another message until current is fully printed
  // 此代码首先检查打印过程当前是否正在进行。如果是，则返回并且不允许用户发送另一条消息，直到当前消息完全打印为止。

  let userInput = document.getElementById('userInput').value;

  // 接下来，它从 ID 为“userInput”的 HTML 元素中检索用户输入的值。

  if (userInput.trim() === '') return; // Prevent sending empty messages
  // 然后它检查用户输入是否为空或仅包含空格字符。如果是，则返回并阻止发送空消息。

  document.getElementById('userInput').value = ''; // Clear the input field
  // 最后，它将“userInput”HTML 元素的值设置为空字符串，从而有效地清除输入字段。

  // Display the user's message immediately
  const messagesDiv = document.getElementById('messages');
  let select = document.getElementById('search-select');
  let index = select.selectedIndex;
  let value = select.options[index].value.bold().fontcolor('red');
  if (value !== '搜索') {
    userInput += `<p>${value}</p>`;
  }
  // alert(`${value}`);
  messagesDiv.innerHTML += `<p class="message userMessage">${userInput}</p>`;
  // messagesDiv.innerHTML += `<p>${select}</p>`;
  // 这段代码首先获取了一个 ID 为 "messages" 的 HTML 元素，并将用户输入的消息作为一个带有 "message userMessage" 类的段落元素添加到该元素中。

  // Hide the API key note
  document.getElementById('api-key-note').style.display = 'none';
  // 接下来，它隐藏了一个 ID 为 "api-key-note" 的 HTML 元素。

  // Disable userInput and send button while AI is printing
  document.getElementById('userInput').disabled = true;
  document.getElementById('send').disabled = true;
  // 最后，它禁用了 ID 为 "userInput" 和 "send" 的 HTML 元素，以防止用户在 AI 正在打印消息时再次发送消息。

  chrome.runtime.sendMessage(
    { message: 'generate_text', userInput: userInput },
    (response) => {
      // 这段代码使用 `chrome.runtime.sendMessage` 方法向浏览器扩展发送一个包含用户输入消息和指令的对象。指令是 "generate_text"，表示需要生成一段 AI 文本。
      // Display the AI's response word by word
      let words = response.data.split(' ');
      let aiMessageElement = document.createElement('p');
      aiMessageElement.classList.add('message', 'aiMessage');
      messagesDiv.appendChild(aiMessageElement);
      // 当浏览器扩展返回响应时，代码将响应文本分割成单个单词，并创建一个包含 "message" 和 "aiMessage" 类的段落元素。接着将该段落元素添加到 ID 为 "messages" 的 HTML 元素中。

      isPrinting = true;
      // 最后，代码将布尔变量 `isPrinting` 设置为 `true`，表示当前正在打印 AI 的响应。

      let i = 0;
      let intervalId = setInterval(() => {
        if (i < words.length) {
          aiMessageElement.textContent += words[i] + ' ';
          i++;
        } else {
          clearInterval(intervalId);
          // 这段代码使用 `setInterval` 方法创建一个定时器，以每 80 毫秒的速度逐字逐句地显示 AI 的响应。
          // 在每个定时器周期内，代码检查是否还有单词需要显示，如果有，则将下一个单词添加到段落元素中，并将计数器 `i` 加 1。
          isPrinting = false;
          // Re-enable userInput and send button after AI has finished printing
          document.getElementById('userInput').disabled = false;
          document.getElementById('send').disabled = false;
          // 当所有单词都已经显示完毕时，代码清除定时器，将布尔变量 `isPrinting` 设置为 `false`，并重新启用 ID 为 "userInput" 和 "send" 的 HTML 元素，以便用户可以再次发送消息。
        }
      }, 80); // Adjust the speed of "streaming" here
    }
  );
}


var oContent =document.getElementById('content');
oContent.onmouseup = function(){
  alert(selectText());
};  

function selectText(){
  if(document.Selection){       
    //ie浏览器
    return document.selection.createRange().text;     	 
  }else{    
    //标准浏览器
    return window.getSelection().toString();	 
  }	 
}

var oContent =document.getElementById('content');
oContent.onmouseup = function(){
  document.execCommand("Copy");	
  alert("复制成功")
}; 
