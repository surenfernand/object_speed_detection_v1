import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';

let model;

export const loadModel = async () => {
  await tf.ready();
  model = await cocoSsd.load();
  return model;
};

export const detectObjects = async (base64) => {
  if (!model) await loadModel();

  const uIntArray = tf.util.encodeString(base64, 'base64').buffer;
  const raw = new Uint8Array(uIntArray);
  const imageTensor = decodeJpeg(raw);

  const predictions = await model.detect(imageTensor);
  return predictions; 
};
