# Fake-News-Killer-Extension

# Description
A browser extension that utilises a custom-trained AI model to analyse text for credibility, providing a clear verdict (FAKE/REAL), an AI-powered analysis, and cross-referenced sources. It's designed to help users navigate the news with clarity and to promote credible information online.

# Features
Text Analysis: Get a credibility score on any text.
AI-Powered Analysis: Receive a detailed breakdown of why a score was given.
Live Web Cross-Referencing: See a list of potential sources to verify the information.
Immediate FAKE/REAL Verdict: Get a quick, clear verdict based on the model's analysis, helping you make an initial assessment in seconds.
Simple UI: A clean and intuitive pop-up interface for quick checks.

# Getting Started
Follow these steps to load the extension in your browser.

1. Project Setup
Ensure your project folder contains the following files and folders:
manifest.json
popup.html
js/ (folder containing popup.js and tailwind.js)
images/ (folder containing icon16.svg, icon48.svg, and icon128.svg)
dist/ (folder containing background.js)

2. Set Up the Local AI Server
The extension uses a local Python API server to run the AI model. The manifest.json file specifies that the extension connects to http://127.0.0.1:5000. You will need to have a local server running on this address that accepts a POST request to the /predict endpoint with a JSON body containing the text to be analyzed.

3. Load the Extension in Your Browser
Open your browser and navigate to chrome://extensions.
Enable Developer mode in the top-right corner.
Click the Load unpacked button.
Select your project's main folder.
The "Fake News Detector" extension should now appear in your browser's toolbar.

# How It Works
The browser extension operates through three main scripts:
content.js: This script runs on the active tab and is responsible for detecting and retrieving highlighted text on the page when requested by the popup.
popup.js: This is the main script for the extension's user interface. It listens for user input or selected text, then sends a message to the background script to initiate the fake news detection process. It also handles updating the popup's UI with the results, including displaying the verdict (REAL/FAKE) and any associated sources.
background.js: This service worker acts as the intermediary between the popup and the local AI server. It receives the text from popup.js and sends it to the local Python API server at http://127.0.0.1:5000/predict via a POST request. It then returns the result, which includes the prediction and sources, back to popup.js to be displayed to the user.
