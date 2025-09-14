// This script listens for a request from the popup and sends back the highlighted text.
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Check if the message is a request for selected text.
    if (request.type === "get_selected_text") {
        const selectedText = window.getSelection().toString().trim();
        // Send the selected text back as a response.
        sendResponse({ text: selectedText });
    }
});