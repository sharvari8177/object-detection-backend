const express = require('express');
const fetch = require('axios');
const {GoogleAuth} = require('google-auth-library');

const app = express();
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "200mb", extended: true, parameterLimit:50000}))
app.use(express.text({ limit: '200mb' }))

// Google Cloud project and model details
const projectId = '812822770933';
const location = 'us-central1';
const modelId = '4882352795837005824 ';
// Construct the URL for your model's endpoint
const modelUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/812822770933/locations/us-central1/endpoints/4882352795837005824:predict`;

// Initialize the Google Auth library with your Google Cloud service account
const auth = new GoogleAuth({
  keyFilename: "server\\object-detection-408817-3734ecf69f38.json", // Ensure this path is correct
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

// Function to get access token
async function getAccessToken() {
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

app.post('/predict', async (req, res) => {
  // Assuming imageData is base64-encoded
  const {imageData} = req.body; 
  const modelInputData = {
    "instances": [{ "content": imageData }],
    "parameters": {
      "confidenceThreshold": 0.5,
      "maxPredictions": 5
    }
  };

  try {
    const accessToken = await getAccessToken();
    console.log(accessToken)
    // console.log(" data = ", modelInputData)
    const modelResponse = await fetch(modelUrl, {
      method: 'POST',
      body: (modelInputData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // Use the OAuth token
      }
    });

    const predictionResult = await modelResponse.json();

    // Assuming the model returns labels and scores like this:
    // predictionResult.predictions = [{label: "TrainTrack", score: 0.9}, {label: "SafeArea", score: 0.1}];
    
    let isDangerous = false;
    let message = "Situation is safe.";
    
    for (const prediction of predictionResult.predictions) {
      // Example: Check if the 'TrainTrack' label has a score higher than 0.5
      if (prediction.label === 'TrainTrack' && prediction.score >= 0.5) {
        isDangerous = true;
        message = "Dangerous situation detected! Stand away from the train track.";
        break; // Break the loop if a dangerous situation is detected
      }
    }
    
    res.json({ isDangerous, message });
    
  } catch (error) {
    console.error('Error calling model: ', error.message);
    res.status(500).send('Failed to make prediction');
  }
});

const port = 3000;
app.listen(port, "192.168.0.119", () => console.log(`Server listening on port ${port}`));
