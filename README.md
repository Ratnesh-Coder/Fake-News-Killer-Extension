# 📰 Fake News Killer Extension

### AI-Powered Browser Extension for News Credibility Analysis

**Fake News Killer Extension** is a Chrome browser extension that uses a **locally hosted AI/ML model** to analyze news text and provide an immediate `REAL` or `FAKE` prediction.

The extension connects to the **Fake News Killer API**, running locally at `http://127.0.0.1:5000`, and displays the prediction along with relevant online sources returned by the API.

It is designed to provide users with a quick and simple way to analyze potentially misleading news content directly from their browser.

---

# ✨ Features

### 🤖 Local AI Analysis

The extension communicates with a locally running Python API server rather than directly sending the analyzed text to a cloud AI service.

```text
Browser Extension
       │
       ▼
Local Flask API
127.0.0.1:5000
       │
       ▼
Machine Learning Model
```

### 📰 REAL / FAKE Verdict

After analysis, the extension displays a clear prediction:

```text
REAL
```

or

```text
FAKE
```

The result is accompanied by a short explanation indicating that it is a **model prediction**.

### 🔎 Selected Text Detection

The extension can retrieve highlighted text from the currently active webpage.

Users can:

1. Highlight news text.
2. Open the extension.
3. Have the selected text populated automatically.
4. Run the verification.

### 📋 Manual Text Input

Users can also manually paste news content into the extension popup.

```text
Paste news text here...
          │
          ▼
       Verify
          │
          ▼
      AI Analysis
```

### 🌐 Online Source Cross-Referencing

The extension displays online sources returned by the Fake News Killer API.

Each source is presented as a clickable link and opens in a new browser tab.

### ⚡ Simple Popup Interface

The extension provides a compact browser popup containing:

- News text input
- Verify button
- Loading indicator
- REAL/FAKE result
- Result icon
- Model explanation
- Online sources
- Error messages

---

# 🔄 How It Works

The extension consists of three main JavaScript components:

```text
                        Browser
                           │
                           ▼
                    Extension Popup
                       popup.html
                           │
                           ▼
                        popup.js
                           │
                    Chrome Runtime
                           │
                           ▼
                   background.js
                           │
                           ▼
                 Local Flask API
             http://127.0.0.1:5000
                           │
                           ▼
                  /predict Endpoint
                           │
                           ▼
                Machine Learning Model
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
             Prediction           Sources
              REAL/FAKE          Online URLs
                 │                   │
                 └─────────┬─────────┘
                           ▼
                     JSON Response
                           │
                           ▼
                       popup.js
                           │
                           ▼
                    Results Display
```

---

# 🧩 Extension Architecture

## 1. `popup.html`

`popup.html` defines the user interface displayed when the extension icon is clicked.

The popup contains:

- Extension title
- Text input area
- Verify button
- Loading animation
- Prediction result
- Prediction explanation
- Online source list
- Error message area

The popup has a fixed width of approximately **400px**.

---

## 2. `popup.js`

`popup.js` controls the main extension interface and detection workflow.

Its responsibilities include:

- Detecting selected text
- Populating the input field
- Validating user input
- Sending detection requests
- Displaying the loading state
- Processing API responses
- Displaying REAL/FAKE results
- Displaying source links
- Handling errors

### Detection Flow

```text
User opens popup
       │
       ▼
Check selected text
       │
       ├── Text found ─────► Populate input
       │
       └── No text ────────► Wait for user input
                                  │
                                  ▼
                              Click Verify
                                  │
                                  ▼
                           Validate text
                                  │
                                  ▼
                       Send message to background
                                  │
                                  ▼
                           Receive API result
                                  │
                                  ▼
                         Update popup UI
```

---

# 📄 3. `content.js`

`content.js` runs on the active webpage and is responsible for retrieving highlighted text when requested.

It listens for:

```javascript
get_selected_text
```

and returns the currently selected text from the webpage.

Conceptually:

```text
Web Page
   │
   ▼
Highlighted Text
   │
   ▼
content.js
   │
   ▼
Selected Text
   │
   ▼
Extension
```

---

# ⚙️ 4. `background.js`

`background.js` is the extension's **Manifest V3 service worker**.

It acts as an intermediary between the popup and the local AI API.

When it receives a `detect_news` request, it sends:

```http
POST http://127.0.0.1:5000/predict
```

with:

```json
{
  "text": "News article text..."
}
```

The API response is then returned to `popup.js`.

---

# 🧠 Local AI Architecture

The extension itself does **not contain the machine-learning model**.

Instead, it communicates with the separate **Fake News Killer API**.

```text
┌───────────────────────────┐
│     Chrome Extension      │
│                           │
│  popup.html               │
│  popup.js                 │
│  content.js               │
│  background.js            │
└─────────────┬─────────────┘
              │
              │ HTTP POST
              ▼
┌───────────────────────────┐
│   Fake News Killer API    │
│                           │
│ Flask REST API             │
│ TF-IDF Vectorizer          │
│ Passive Aggressive Model   │
│ Online Source Search       │
└─────────────┬─────────────┘
              │
              ▼
       JSON Prediction
              │
       ┌──────┴──────┐
       ▼             ▼
    REAL/FAKE      Sources
```

---

# 🔌 API Integration

The extension expects the local API to be available at:

```text
http://127.0.0.1:5000
```

The prediction endpoint is:

```http
POST /predict
```

Therefore, the complete endpoint is:

```text
http://127.0.0.1:5000/predict
```

### Request

```json
{
  "text": "Your news article text goes here..."
}
```

### Expected Response

```json
{
  "prediction": "REAL",
  "sources": [
    {
      "title": "Example News Source",
      "url": "https://example.com/article"
    }
  ]
}
```

The extension extracts:

```text
prediction
sources
```

and displays them in the popup.

---

# 📊 Result Display

## REAL Result

When the model returns:

```text
REAL
```

the extension displays a green result card and a success icon.

The popup explains:

```text
Model prediction suggests this is credible.
```

---

## FAKE Result

When the model returns:

```text
FAKE
```

the extension displays a red result card and a warning icon.

The popup explains:

```text
Model prediction suggests this is unreliable.
```

> ⚠️ These are automated model predictions and should not be interpreted as definitive proof of whether a claim is true or false.

---

# 🌐 Online Sources

If the API returns sources, the extension creates a list of clickable links.

For example:

```text
Top Online Sources:

• Example News Article
• Related News Source
• Reference Article
```

Each link:

- Opens in a new tab
- Uses `noopener noreferrer`
- Displays the source title
- Links to the URL returned by the API

If no sources are returned, the source section remains hidden.

---

# 🛡️ Manifest V3

The extension uses:

```text
Manifest Version 3
```

The manifest defines:

```json
{
  "manifest_version": 3,
  "name": "Fake News Detector",
  "version": "1.0"
}
```

The background component is implemented as a service worker:

```json
"background": {
  "service_worker": "dist/background.js"
}
```

---

# 🔐 Permissions

The extension currently requests:

| Permission | Purpose |
|---|---|
| `activeTab` | Access the currently active browser tab |
| `scripting` | Execute the selected-text retrieval script |
| `storage` | Provides access to Chrome extension storage |

The extension also allows communication with the local API through its Content Security Policy:

```text
http://127.0.0.1:5000
```

---

# 🚀 Getting Started

## Prerequisites

Before using the extension, make sure you have:

- Google Chrome or another Chromium-based browser
- Python 3.8+
- Fake News Killer API
- Required Python dependencies for the API
- The extension source code

The extension requires the Fake News Killer API to be running locally.

---

# 🧠 Step 1 — Start the AI API

Clone and configure the **Fake News Killer API** project.

Start the Flask server:

```bash
python api_server.py
```

The API should become available at:

```text
http://127.0.0.1:5000
```

The prediction endpoint should be:

```text
http://127.0.0.1:5000/predict
```

---

# 🧩 Step 2 — Load the Extension

Open Chrome and navigate to:

```text
chrome://extensions
```

Enable:

```text
Developer mode
```

Then click:

```text
Load unpacked
```

Select the root directory containing:

```text
manifest.json
```

The extension should now appear in the browser's extension list.

---

# ▶️ Step 3 — Use the Extension

After installing the extension:

1. Open a webpage containing news or other text.
2. Highlight the text you want to analyze.
3. Click the **Fake News Detector** extension icon.
4. The selected text can be automatically loaded into the popup.
5. Click **Verify**.
6. Wait for the local AI model to process the text.
7. Review the `REAL` or `FAKE` prediction.
8. Review the online sources returned by the API.

You can also paste text manually into the popup instead of selecting text from a webpage.

---

# 🧪 Example Workflow

```text
Open News Article
        │
        ▼
Highlight Text
        │
        ▼
Open Extension
        │
        ▼
Selected Text Loaded
        │
        ▼
Click "Verify"
        │
        ▼
Local API Request
        │
        ▼
Machine Learning Analysis
        │
        ├───────────────┐
        ▼               ▼
    Prediction       Online Sources
     REAL/FAKE
        │               │
        └───────┬───────┘
                ▼
          Display Results
```

---

# ⚠️ Troubleshooting

## "Could not connect to the local AI server"

This generally means the extension cannot reach:

```text
http://127.0.0.1:5000
```

Make sure the API server is running:

```bash
python api_server.py
```

Then verify that the API is listening on port `5000`.

---

## No Selected Text

If highlighted text is not automatically populated:

1. Make sure text is actually selected.
2. Open the extension after selecting the text.
3. Try copying and pasting the text manually.
4. Reload the extension from `chrome://extensions` if necessary.

---

## Prediction Does Not Appear

Check:

1. The Flask API is running.
2. `/predict` is available.
3. The request contains a `text` field.
4. The browser extension has been loaded correctly.
5. The extension service worker has no errors.

Chrome provides service-worker logs through:

```text
chrome://extensions
→ Fake News Detector
→ Inspect views / Service worker
```

---

# 🔒 Privacy Model

The extension is designed around a **local API architecture**.

The current background service worker sends analyzed text to:

```text
http://127.0.0.1:5000/predict
```

which refers to the user's local machine.

```text
User Browser
     │
     │ News Text
     ▼
Local Extension
     │
     ▼
127.0.0.1:5000
     │
     ▼
Local AI API
```

The extension's current API endpoint is explicitly configured to use localhost rather than a remote API server.

> **Important:** The online-source functionality is handled by the API. The API may access external web sources when performing source cross-referencing.

---

# 🚧 Current Limitations

The current implementation is a prototype and has several limitations:

- The extension depends on a locally running API server.
- The API must be started manually.
- No production authentication mechanism is implemented.
- No confidence score is displayed.
- The model prediction is limited to `REAL` or `FAKE`.
- The extension currently targets a Chromium-style extension environment.
- The extension does not itself perform independent fact verification.
- Online sources are dependent on the API's search functionality.
- The current extension version is `1.0`.

---

# 🔗 Related Project

The extension works together with the **Fake News Killer API**.

### Fake News Killer API

The backend provides:

- Machine-learning classification
- TF-IDF text processing
- Passive Aggressive classification
- REAL/FAKE predictions
- Online source cross-referencing
- REST API functionality

The architecture is:

```text
┌──────────────────────┐
│   Fake News Killer   │
│      Website         │
└──────────┬───────────┘
           │
           │ Download
           ▼
┌──────────────────────┐
│ Browser Extension    │
└──────────┬───────────┘
           │
           │ POST /predict
           ▼
┌──────────────────────┐
│   Fake News Killer   │
│        API           │
└──────────┬───────────┘
           │
           ├── TF-IDF
           ├── ML Model
           └── Online Sources
```

---

# 🎓 Project Objective

The Fake News Killer Extension demonstrates how a browser extension can be integrated with a locally hosted machine-learning API to provide users with a simple interface for analyzing potentially misleading news.

The project combines:

- Browser Extension Development
- JavaScript
- HTML/CSS
- Chrome Manifest V3
- Machine Learning
- Natural Language Processing
- REST APIs
- Online Source Cross-Referencing
- Local AI Processing

---

# 👨‍💻 Author

**Ratnesh**

Engineering Student

GitHub:

**https://github.com/Ratnesh-Coder**

---

# 📄 License

This project is currently maintained as a **personal/student project**.

If a formal open-source license is added in the future, the license information will be updated here.

---

## 📰 Fake News Killer

### *Clarity in a Click.*

A browser extension that connects a simple user interface with a locally hosted machine-learning API to help analyze potentially misleading news content.
