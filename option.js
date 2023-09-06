// document.getElementById('save').addEventListener('click', () => {
//   const openai_key = document.getElementById('openai_key').value;
//   chrome.storage.local.set({ openai_key: openai_key }, () => {
//     console.log('OpenAI key saved');
//    alert('OpenAI key saved successfully');
   
//   });
// });

// // Load the saved OpenAI key when the options page is opened
// chrome.storage.local.get('openai_key', (data) => {
//   if (data.openai_key) {
//     document.getElementById('openai_key').value = data.openai_key;
//   }
// });


//点击save后跳转函数
document.getElementById('save').addEventListener('click', async () => {
  //获取用户的openai key
  const openai_key = document.getElementById('openai_key').value;
  
  // 弹窗
  const isValid = await isValidOpenAIKey(openai_key);
  
  if (!isValid) {
    alert('Invalid OpenAI API key. Please check your API key.');
    return;
  }

  // 保存openAI key
  chrome.storage.local.set({ openai_key: openai_key }, () => {
    console.log('OpenAI key saved');
    alert('OpenAI key saved successfully');
  });
});

// 页面打开时将加载保存的openAI密钥
chrome.storage.local.get('openai_key', (data) => {
  if (data.openai_key) {
    document.getElementById('openai_key').value = data.openai_key;
  }
});

//新增：判断openai key是否有效
async function isValidOpenAIKey(key) {
  //制定open AI的一个端点
  const url = 'https://api.openai.com/v1/engines'; // or any other endpoint

  try {
    //Get请求
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${key}`
      }
    });
//检查响应是否正常
    if (response.ok) {
      return true; // API key 有效
    } else {
      return false; // API key 无效
    }
  } catch (error) {
    return false; //API key无效
  }
}
