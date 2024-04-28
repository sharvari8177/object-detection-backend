//imports from libraries
const auth = require("google-auth-library");
//imports from other files
const { predictImageObjectDetection } = require("../logic");

async function authenticateImplicitWithAdc(image) {
  predictImageObjectDetection(image);
}

module.exports = { authenticateImplicitWithAdc };
