import React, { useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Home, BedDouble, Bath, IndianRupee, Brain, Building2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { houseData, featureNames, formatInr } from './data';
import { createAndTrainModel, predict } from './model';

function App() {
  const [squareFeet, setSquareFeet] = useState<number>(1000);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [model, setModel] = useState<{
    model: tf.LayersModel;
    featureMean: tf.Tensor;
    featureStd: tf.Tensor;
    labelMean: tf.Tensor1D;
    labelStd: tf.Tensor1D;
  } | null>(null);
  const [isTraining, setIsTraining] = useState(true);

  useEffect(() => {
    async function trainModel() {
      const trainedModel = await createAndTrainModel(
        houseData.trainFeatures,
        houseData.trainLabels
      );
      setModel(trainedModel);
      setIsTraining(false);
    }
    trainModel();
  }, []);

  useEffect(() => {
    if (model && !isTraining) {
      const predictedPrice = predict(
        model.model,
        [squareFeet, bedrooms, bathrooms],
        model.featureMean,
        model.featureStd,
        model.labelMean,
        model.labelStd
      );
      setPrediction(predictedPrice);
    }
  }, [squareFeet, bedrooms, bathrooms, model, isTraining]);

  const chartData = houseData.trainFeatures.map((features, index) => ({
    squareFeet: features[0],
    price: houseData.trainLabels[index],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Building2 className="w-12 h-12 text-indigo-600 mr-4" />
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              House Price Prediction
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Enter house details to get an estimated price in Indian Rupees
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 backdrop-blur-lg bg-opacity-90">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-medium text-lg">
                <Home className="w-6 h-6 mr-2 text-indigo-600" />
                Square Feet
              </label>
              <input
                type="number"
                value={squareFeet}
                onChange={(e) => setSquareFeet(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                min="500"
                max="3000"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-medium text-lg">
                <BedDouble className="w-6 h-6 mr-2 text-purple-600" />
                Bedrooms
              </label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                min="1"
                max="4"
              />
            </div>

            <div className="space-y-3">
              <label className="flex items-center text-gray-700 font-medium text-lg">
                <Bath className="w-6 h-6 mr-2 text-pink-600" />
                Bathrooms
              </label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-200"
                min="1"
                max="4"
              />
            </div>
          </div>

          <div className="mt-12 text-center">
            {isTraining ? (
              <div className="flex items-center justify-center space-x-3 bg-indigo-50 rounded-xl p-6">
                <Brain className="w-8 h-8 animate-pulse text-indigo-600" />
                <span className="text-xl font-medium text-indigo-700">
                  Training AI Model...
                </span>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-8 shadow-lg">
                <div className="text-3xl font-bold text-white flex items-center justify-center mb-2">
                  <IndianRupee className="w-8 h-8 mr-2" />
                  {prediction ? formatInr(prediction) : 'N/A'}
                </div>
                <p className="text-indigo-100 text-lg">Estimated Property Value</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-lg bg-opacity-90">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Price Trends by Square Footage
          </h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                  dataKey="squareFeet" 
                  name="Square Feet"
                  label={{ value: 'Square Feet', position: 'bottom' }}
                />
                <YAxis
                  name="Price"
                  label={{ value: 'Price (₹)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatInr(value), 'Price']}
                  labelFormatter={(label) => `${label} sq ft`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="url(#colorGradient)" 
                  strokeWidth={3}
                  name="Property Value"
                  dot={{ stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;