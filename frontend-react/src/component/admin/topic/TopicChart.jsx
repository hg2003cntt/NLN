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
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Tạo màu ngẫu nhiên
};

const TopicChart = ({ fetchChartData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchChartData();
        const formattedData = data.map((topic, index) => ({
          name: topic.name,
          value: topic.value,
          color: COLORS[index % COLORS.length] || generateRandomColor(),
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
      }
    };

    fetchData();
  }, [fetchChartData]);

  return (
    <div className="topic-chart">
      <h1 className="chart-title">Tỷ lệ chủ đề được sử dụng cho các bài viết</h1>
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
