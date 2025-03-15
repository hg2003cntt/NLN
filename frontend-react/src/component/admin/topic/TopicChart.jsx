import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#D84315",
  "#9C27B0",
  "#E91E63",
];
const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random hex color
};

const TopicChart = ({ fetchChartData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    updateChart();
  }, [fetchChartData]);

  const updateChart = async () => {
    const data = await fetchChartData();
    const formattedData = data.map((topic, index) => ({
      name: topic.name,
      value: topic.value,
      color: COLORS[index % COLORS.length] || generateRandomColor(),
    }));
    setChartData(formattedData);
  };

  return (
    <div className="topic-chart">
      <div className="chart-title">
        <h1>Tỷ lệ chủ đề được sử dụng cho các bài viết</h1>
      </div>
      <div className="chart-pie">
        <ResponsiveContainer width="100%" height={380}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={180}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => {
                const total = chartData.reduce(
                  (acc, cur) => acc + cur.value,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return `${value} bài viết (${percentage}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopicChart;
