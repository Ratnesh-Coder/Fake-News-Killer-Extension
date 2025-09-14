// This function sends text to the local Python API server for prediction.
const detectFakeNews = async (text) => {
    try {
        const apiUrl = 'http://127.0.0.1:5000/predict';
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });

        if (!response.ok) {
            throw new Error(`API server error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        return { data: result }; // The result will be { prediction: 'FAKE' } or { prediction: 'REAL' }

    } catch (error) {
        console.error('Error during local API call:', error);
        return { error: 'Could not connect to the local AI server. Is it running?' };
    }
};

// Handle messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'detect_news') {
        detectFakeNews(request.text).then(sendResponse);
        return true; // Indicates that the response will be sent asynchronously
    }
});
