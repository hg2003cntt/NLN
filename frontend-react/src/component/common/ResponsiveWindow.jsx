import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

const ResponsiveComponent = () => {
  const { width, height } = useWindowSize();

  return (
    <div style={{
      width: width * 0.8,  // 80% của màn hình
      height: height * 0.6, // 60% của màn hình
      background: "lightblue",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      margin: "auto",
      borderRadius: "10px"
    }}>
      <h2>Width: {width}px | Height: {height}px</h2>
    </div>
  );
};

export default ResponsiveComponent;
