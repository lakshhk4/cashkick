"use client";
import { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const customData = {
    griezmann: { positive: 4, negative: 0, neutral: 1 },
    kohli: { positive: 2, negative: 0, neutral: 3 },
    // Add more elements as needed
    anotherPlayer: { positive: 3, negative: 2, neutral: 1 },
  };

  function parseData(playerData) {
    const uniqueData = [
      { name: "Positive", value: playerData.positive },
      { name: "Negative", value: playerData.negative },
      { name: "Neutral", value: playerData.neutral },
    ];

    return uniqueData;
  }

  return (
    <div className="m-20">
      {Object.keys(customData).map((player, index) => {
        console.log(player);
        return (
          <div key={index} className="bg-white mb-4">
            <span className="text-black m-20">{player}</span>
            <BarChart
              width={730}
              height={250}
              data={parseData(customData[player])}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        );
      })}
    </div>
  );
}

export default Analytics;
