document.addEventListener('DOMContentLoaded', () => {
    const checkButton = document.getElementById('checkButton');
    const inputText = document.getElementById('inputText');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsCard = document.getElementById('results');
    const resultIcon = document.getElementById('resultIcon');
    const predictionResult = document.getElementById('predictionResult');
    const predictionSubtext = document.getElementById('predictionSubtext');
    const errorMessageDiv = document.getElementById('errorMessage');
    const sourcesSection = document.getElementById('sourcesSection');
    const sourcesList = document.getElementById('sourcesList');

    const realIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="color: #059669;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    const fakeIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" style="color: #DC2626;"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>`;

    const getSelectedText = () => window.getSelection().toString().trim();

    // On popup open, try to get highlighted text
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: getSelectedText,
            }, (results) => {
                if (chrome.runtime.lastError || !results?.[0]?.result) return;
                inputText.value = results[0].result;
                if (inputText.value) runDetection();
            });
        }
    });

    const runDetection = async () => {
        const text = inputText.value.trim();
        if (!text) {
            showError("Please enter some text to analyze.");
            return;
        }

        // --- Set UI to loading state ---
        checkButton.disabled = true;
        inputText.disabled = true;
        loadingIndicator.classList.remove('hidden');
        resultsCard.classList.remove('visible');
        errorMessageDiv.classList.add('hidden');
        sourcesSection.classList.add('hidden');

        try {
            const response = await chrome.runtime.sendMessage({ action: 'detect_news', text });
            if (response?.error) throw new Error(response.error);
            updateResults(response.data);
        } catch (error) {
            console.error('Error in detection process:', error);
            showError(error.message);
        } finally {
            // --- Reset UI from loading state ---
            checkButton.disabled = false;
            inputText.disabled = false;
            loadingIndicator.classList.add('hidden');
        }
    };

    const updateResults = (data) => {
        const { prediction, sources } = data;
        const isReal = prediction === 'REAL';

        resultIcon.innerHTML = isReal ? realIconSVG : fakeIconSVG;
        predictionResult.textContent = prediction;
        predictionSubtext.textContent = isReal 
            ? 'Model prediction suggests this is credible.' 
            : 'Model prediction suggests this is unreliable.';
        
        resultsCard.classList.remove('result-real', 'result-fake');
        predictionResult.classList.remove('real-text', 'fake-text');

        if (isReal) {
            resultsCard.classList.add('result-real');
            predictionResult.classList.add('real-text');
        } else {
            resultsCard.classList.add('result-fake');
            predictionResult.classList.add('fake-text');
        }

        // Populate and show the sources section
        sourcesList.innerHTML = '';
        if (sources && sources.length > 0) {
            sources.forEach(source => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = source.url;
                a.title = source.title; // Show full title on hover
                a.textContent = source.title;
                a.target = '_blank'; // Open link in a new tab
                a.rel = 'noopener noreferrer'; // Security best practice
                li.appendChild(a);
                sourcesList.appendChild(li);
            });
            sourcesSection.classList.remove('hidden');
        } else {
            // If no sources, explicitly hide the section
            sourcesSection.classList.add('hidden');
        }
        
        resultsCard.classList.add('visible');
    };

    const showError = (message) => {
        errorMessageDiv.querySelector('p').textContent = message;
        errorMessageDiv.classList.remove('hidden');
    }

    checkButton.addEventListener('click', runDetection);
});

