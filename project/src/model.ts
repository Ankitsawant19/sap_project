import * as tf from '@tensorflow/tfjs';

export async function createAndTrainModel(features: number[][], labels: number[]) {
  // Convert the data to tensors
  const xs = tf.tensor2d(features);
  const ys = tf.tensor1d(labels);

  // Normalize the data
  const featureMean = xs.mean(0);
  const featureStd = xs.sub(featureMean).square().mean(0).sqrt();
  const normalizedXs = xs.sub(featureMean).div(featureStd);

  const labelMean = ys.mean();
  const labelStd = ys.sub(labelMean).square().mean().sqrt();
  const normalizedYs = ys.sub(labelMean).div(labelStd);

  // Create the model
  const model = tf.sequential();
  model.add(tf.layers.dense({
    units: 10,
    activation: 'relu',
    inputShape: [3]
  }));
  model.add(tf.layers.dense({
    units: 1
  }));

  // Compile the model
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError'
  });

  // Train the model
  await model.fit(normalizedXs, normalizedYs, {
    epochs: 100,
    verbose: 0
  });

  return {
    model,
    featureMean,
    featureStd,
    labelMean,
    labelStd
  };
}

export function predict(
  model: tf.LayersModel,
  features: number[],
  featureMean: tf.Tensor,
  featureStd: tf.Tensor,
  labelMean: tf.Tensor1D,
  labelStd: tf.Tensor1D
): number {
  const normalizedFeatures = tf.tensor2d([features])
    .sub(featureMean)
    .div(featureStd);
  
  const normalizedPrediction = model.predict(normalizedFeatures) as tf.Tensor;
  const prediction = normalizedPrediction
    .mul(labelStd)
    .add(labelMean);
  
  return prediction.dataSync()[0];
}