// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


const JUYPTER_ORIGIN = 'https://8888/';
// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
	if (!tab.url) return;
	await chrome.sidePanel.setOptions({
	  tabId,
	  path: 'sidepanel.html',
	  enabled: true
	});
});


let conversationHistory = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'generate_text') {
    chrome.storage.local.get(['openai_key'], function (result) {
      console.log(result.openai_key);
      const openai_key = result.openai_key;

      conversationHistory.push({ role: 'user', content: request.userInput });

      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openai_key}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: conversationHistory,
          max_tokens: 1000,
          temperature: 0.3,
          user: 'unique-user-id', // Replace with a unique identifier for your end-user
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Add the AI's message to the conversation history
          conversationHistory.push({
            role: 'assistant',
            content: data.choices[0].message.content,
          });
          sendResponse({ data: data.choices[0].message.content });
        })
        .catch((error) => console.error('Error:', error));
    });
    // Must return true to indicate that the response is sent asynchronously
    return true;
  }
});