const { authenticateImplicitWithAdc } = require("./auth/auth");

app.post("/predict", async (req, res) => {
  // Assuming imageData is base64-encoded
  const { imageData } = req.body;

  try {
    authenticateImplicitWithAdc(imageData);

    // // Assuming the model returns labels and scores like this:
    // // predictionResult.predictions = [{label: "TrainTrack", score: 0.9}, {label: "SafeArea", score: 0.1}];

    // let isDangerous = false;
    // let message = "Situation is safe.";

    // for (const prediction of predictionResult.predictions) {
    //   // Example: Check if the 'TrainTrack' label has a score higher than 0.5
    //   if (prediction.label === 'TrainTrack' && prediction.score >= 0.5) {
    //     isDangerous = true;
    //     message = "Dangerous situation detected! Stand away from the train track.";
    //     break; // Break the loop if a dangerous situation is detected
    //   }
    // }

    // res.json({ isDangerous, message });
  } catch (error) {
    console.error("Error calling model: ", error.message);
    res.status(500).send("Failed to make prediction");
  }
});
