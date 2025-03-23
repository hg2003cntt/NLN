import React, { useEffect, useState } from 'react';
import ApiService from '../../../service/apiService';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from 'recharts';


const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#a4de6c'];

const ArticleChart = () => {
  const [dateStats, setDateStats] = useState([]);
  const [topicStats, setTopicStats] = useState([]);
  const [fromDate, setFromDate] = useState('2024-05-05');
  const [toDate, setToDate] = useState('2025-12-31');

  const fetchDateStats = async () => {
    try {
      const res = await ApiService.getArticleByDate(fromDate, toDate);
      const formatted = Object.entries(res).map(([date, count]) => ({ date, count }));
      setDateStats(formatted);
    } catch (err) {
      console.error('Error fetching date stats:', err);
    }
  };

  const fetchTopicStats = async () => {
    try {
      const res = await ApiService.getArticleByTopic();
      const filtered = Object.entries(res)
        .filter(([_, value]) => value > 0)
        .map(([name, value]) => ({ name, value }));
      setTopicStats(filtered);
    } catch (err) {
      console.error('Error fetching topic stats:', err);
    }
  };

  useEffect(() => {
    fetchDateStats();
    fetchTopicStats();
  }, [fromDate, toDate]);

  return (
    <div className="article-chart-container">
      <h2 className="article-chart-title">Thống kê bài viết</h2>

      <div className="article-chart-filter">
        <label>
          Từ ngày:
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        </label>
        <label>
          Đến ngày:
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        </label>
      </div>

      <div className="article-chart-wrapper fixed-2-cols">
        <div className="chart-block">
          <h3 className="font-semibold text-lg mb-2">Bài viết theo thời gian</h3>
          {dateStats.length === 0 ? (
            <p className="text-gray-500 italic">Không có bài viết nào được đăng trong khoảng thời gian bạn chọn.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dateStats}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value) => [value, 'Bài viết']}
                  labelFormatter={(label) => `Ngày: ${label}`}
                />
                <Bar dataKey="count" fill="#8884d8" name="Bài viết" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="chart-block">
          <h3 className="font-semibold text-lg mb-2">Bài viết theo chủ đề</h3>
          {topicStats.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có bài viết nào thuộc bất kỳ chủ đề nào.</p>
          ) : (
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={topicStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {topicStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => {
                    const total = topicStats.reduce((sum, item) => sum + item.value, 0);
                    const percent = ((value / total) * 100).toFixed(1);
                    return [`${value} bài viết (${percent}%)`, props.payload.name];
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleChart;