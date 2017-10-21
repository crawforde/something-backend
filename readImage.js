const Vision = require('@google-cloud/vision');
const vision = Vision();

function textDetect(path){
  let detections;
  return vision.textDetection({source: {filename: path}})
  .then((results) => {
    detections = results[0].fullTextAnnotation.text;
    return detections
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
}

module.exports = textDetect
