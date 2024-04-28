//imports from libraries
const aiplatform = require("@google-cloud/aiplatform");
//imports from other files
const { projectId, location, endpointId } = require("./utils/constants");

//Configurations for calling model
const { instance, params, prediction } =
  aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;
const { PredictionServiceClient } = aiplatform.v1;
const clientOptions = {
  apiEndpoint: "us-central1-aiplatform.googleapis.com",
};
const predictionServiceClient = new PredictionServiceClient(clientOptions);


//Prediction function
async function predictImageObjectDetection(image) {
  // Configure the endpoint resource
  const endpoint = `projects/${projectId}/locations/${location}/endpoints/${endpointId}`;

  const parametersObj = new params.ImageObjectDetectionPredictionParams({
    confidenceThreshold: 0.5,
    maxPredictions: 5,
  });
  const parameters = parametersObj.toValue();

  const instanceObj = new instance.ImageObjectDetectionPredictionInstance({
    content: image,
  });

  const instanceVal = instanceObj.toValue();
  const instances = [instanceVal];

  const request = {
    endpoint,
    instances,
    parameters,
  };

  // Predict request
  const [response] = await predictionServiceClient.predict(request);

  console.log("Predict image object detection response");
  console.log(`\tDeployed model id : ${response.deployedModelId}`);
  const predictions = response.predictions;
  console.log("Predictions :");
  for (const predictionResultVal of predictions) {
    const predictionResultObj =
      prediction.ImageObjectDetectionPredictionResult.fromValue(
        predictionResultVal
      );
    for (const [i, label] of predictionResultObj.displayNames.entries()) {
      console.log(`\tDisplay name: ${label}`);
      console.log(`\tConfidences: ${predictionResultObj.confidences[i]}`);
      console.log(`\tIDs: ${predictionResultObj.ids[i]}`);
      console.log(`\tBounding boxes: ${predictionResultObj.bboxes[i]}\n\n`);
    }
  }
}


module.exports = {predictImageObjectDetection}