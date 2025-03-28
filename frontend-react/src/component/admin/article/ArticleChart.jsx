import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ApiService from "../../../service/apiService";

const ArticleChart = () => {
  const [postStatsByDate, setPostStatsByDate] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [topWriters, setTopWriters] = useState([]);
  const [topCommenters, setTopCommenters] = useState([]);

  useEffect(() => {
    const fromDate = "2024-01-01";
    const toDate = new Date().toISOString().split("T")[0];

    ApiService.getPostStatsByDate(fromDate, toDate).then((data) => {
      const formatted = Object.entries(data).map(([date, count]) => ({ date, count }));
      setPostStatsByDate(formatted);
    });

    ApiService.getTopInteractedPosts().then(setTopPosts);
    ApiService.getTopWriters().then(setTopWriters);
    ApiService.getTopCommenters().then(setTopCommenters);
  }, []);

  const formattedPosts = topPosts.map(post => ({
    ...post,
    totalInteraction: post.likeCount + post.cmtCount,
    formattedTitle: post.title.length > 30 ? post.title.slice(0, 30) + "..." : post.title
  }));

  return (
    <div className="article-chart-container">
      <h2 className="article-chart-title">📊 Thống kê nội dung</h2>

      <div className="chart-section row full-width">
        <div className="chart-card full-half">
          <h3>Bài viết theo ngày</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postStatsByDate} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4facfe" name="Số bài viết" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-half">
          <h3>Top bài viết tương tác</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={formattedPosts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                dataKey="formattedTitle"
                type="category"
                interval={0}
                width={200}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Legend />
              <Bar dataKey="likeCount" fill="#00c49f" name="Lượt thích" />
              <Bar dataKey="cmtCount" fill="#ff8042" name="Bình luận" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-section row full-width">
        <div className="chart-card full-half">
          <h3>Top người viết</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topWriters} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} />
              <Tooltip />
              <Bar dataKey="postCount" fill="#ffbb28" name="Số bài viết" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card full-half">
          <h3>Top người bình luận</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCommenters} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={140} />
              <Tooltip />
              <Bar dataKey="commentCount" fill="#ff6384" name="Số bình luận" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ArticleChart;