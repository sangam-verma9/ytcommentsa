import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import axios from 'axios';

export default function AnalysisPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState('');

const processData = (data) => {
  const sentiments = {
    Agree: 0,
    Disagree: 0,
    Neutral: 0,
  };

  const monthlyDistribution = {};

  // Count sentiments and group by month
  data.comments.forEach((comment) => {
    const sentiment = comment.sentiment || 'Neutral';
    sentiments[sentiment] += 1;

    const month = new Date(comment.postedAt).toLocaleString('default', { month: 'short' });
    monthlyDistribution[month] = (monthlyDistribution[month] || 0) + 1;
  });

  // Compute percentages
  const totalComments = data.comments.length; // Total comments directly from data
  const agreePercentage = ((sentiments.Agree / totalComments) * 100).toFixed(2);
  const disagreePercentage = ((sentiments.Disagree / totalComments) * 100).toFixed(2);
  const neutralPercentage = ((sentiments.Neutral / totalComments) * 100).toFixed(2);

  // Convert monthlyDistribution object to an array
  const monthlyData = Object.entries(monthlyDistribution).map(([month, count]) => ({
    month,
    count,
  }));

  return {
    totalComments, // Use the actual total
    agreeCount: sentiments.Agree,
    disagreeCount: sentiments.Disagree,
    neutralCount: sentiments.Neutral,
    agreePercentage,
    disagreePercentage,
    neutralPercentage,
    monthlyDistribution: monthlyData,
  };
};

  useEffect(() => {
    if (!state?.link) {
      navigate('/');
      return;
    }

    const fetchAnalysis = async () => {
      try {
        const response = await axios.post('https://ytcomment-ttqb.onrender.com', { link: state.link });
        const processedData = processData(response.data); // Process the fetched data
        setAnalysisData(processedData);
        console.log(processedData);
      } catch (err) {
        setError('Failed to fetch analysis data.');
      }
    };

    fetchAnalysis();
  }, [state, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold mb-4">Error</h1>
          <p>{error}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Analysis Results</h1>
        {analysisData && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Sentiment Analysis</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Agree</span>
                    <span>{analysisData.agreePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${analysisData.agreePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Disagree</span>
                    <span>{analysisData.disagreePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${analysisData.disagreePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Neutral</span>
                    <span>{analysisData.neutralPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gray-500 h-2 rounded-full"
                      style={{ width: `${analysisData.neutralPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Total Comments</h2>
                <p className="text-4xl font-bold">{analysisData.totalComments}</p>
                <p className="text-lg mt-2">
                  {analysisData.agreeCount} Agree, {analysisData.disagreeCount} Disagree, {analysisData.neutralCount} Neutral
                </p>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Comment Distribution</h2>
              <BarChart width={600} height={300} data={analysisData.monthlyDistribution}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </div>

            <button
              onClick={() => navigate('/')}
              className="mt-6 bg-purple-500 px-4 py-2 rounded-lg text-white hover:bg-purple-600"
            >
              Back to Input
            </button>
          </>
        )}
      </div>
    </div>
  );
}
