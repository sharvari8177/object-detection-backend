const projectId = "812822770933";
const location = "us-central1";
const modelId = "4882352795837005824 ";
const endpointId = "1030367739551678464";
// Construct the URL for your model's endpoint
const modelUrl = `https://us-central1-aiplatform.googleapis.com/v1/projects/812822770933/locations/us-central1/endpoints/4882352795837005824:predict`;

module.exports = { projectId, location, modelId, endpointId, modelUrl };
