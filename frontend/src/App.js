import { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  // Handle CSV file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload CSV file
  const uploadFile = async () => {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay

      const res = await fetch("http://127.0.0.1:8000/api/upload/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();

      if (!data.success) {
        alert("Upload failed");
        return;
      }

      setSummary(data);
      alert("Upload successful");

      setFile(null);
      fileInputRef.current.value = "";

      // Update history locally
      setHistory((prev) => [data, ...prev]);
    } catch (error) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Fetch upload history
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/summaries/")
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);

  // Prepare data for the bar chart
  const getEquipmentTypeChartData = () => {
    if (!summary || !summary.type_distribution) return null;
    const labels = Object.keys(summary.type_distribution);
    const values = Object.values(summary.type_distribution);

    return {
      labels,
      datasets: [
        {
          label: "Equipment Count",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  };

const formatCSVValue = (value) => {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    value = JSON.stringify(value);
  }

  value = String(value);

  value = value.replace(/"/g, '""');

  return `"${value}"`;
};

const exportHistoryToCSV = (historyData) => {
  if (!historyData || !historyData.length) {
    alert("No data to export!");
    return;
  }

  const averagesKeys = new Set();
  const typeDistKeys = new Set();

  historyData.forEach(item => {
    if (item.averages && typeof item.averages === "object") {
      Object.keys(item.averages).forEach(k => averagesKeys.add(k));
    }
    if (item.type_distribution && typeof item.type_distribution === "object") {
      Object.keys(item.type_distribution).forEach(k => typeDistKeys.add(k));
    }
  });

  const baseHeaders = ["success", "rows", "columns", "column_names", "message"];

  const headers = [
    ...baseHeaders,
    ...Array.from(averagesKeys).sort(),        
    ...Array.from(typeDistKeys).sort()         
  ];


  const rows = historyData.map(item => {
    const baseValues = baseHeaders.map(h => {
      if (h === "column_names" && Array.isArray(item[h])) {
        return formatCSVValue(item[h].join(", "));
      }
      return formatCSVValue(item[h]);
    });

    const averagesValues = Array.from(averagesKeys).map(
      k => formatCSVValue(item.averages ? item.averages[k] : "")
    );

    const typeDistValues = Array.from(typeDistKeys).map(
      k => formatCSVValue(item.type_distribution ? item.type_distribution[k] : "")
    );

    return [...baseValues, ...averagesValues, ...typeDistValues];
  });

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "upload_history_flattened.csv";
  link.click();
};

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "15px 20px",
          textAlign: "center",
        }}
      >
        <h1>CSV Upload Dashboard</h1>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
        {/* Upload Section */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            backgroundColor: "#ffffff",
            padding: "20px",
            marginBottom: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2>Upload CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          />
          <br />
          <br />
          <button
            onClick={uploadFile}
            disabled={loading}
            style={{
              display: "inline-block",
              backgroundColor: loading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: "bold",
              transition: "background-color 0.3s, transform 0.2s",
              marginBottom: "15px",
            }}
            onMouseEnter={(e) =>
              !loading && (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>

        {/* Summary Section */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#fff",
            padding: "15px",
            marginBottom: "20px",
          }}
        >
          <h2>CSV Summary</h2>
          {!summary && <p>Please upload a CSV file to see summary.</p>}
          {summary && (
            <div>
              <p>
                <strong>Rows:</strong> {summary.rows}
              </p>
              <p>
                <strong>Columns:</strong> {summary.columns}
              </p>
              <p>
                <strong>Column Names:</strong>
              </p>
              <ul>
                {summary.column_names.map((col, idx) => (
                  <li key={idx}>{col}</li>
                ))}
              </ul>
              <p>{summary.message}</p>
            </div>
          )}
        </div>

        {/* Bar Chart Section */}
        {summary && getEquipmentTypeChartData() && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#fff",
              padding: "15px",
              marginBottom: "20px",
            }}
          >
            <h2>Equipment Type Distribution</h2>
            <div style={{ maxWidth: "700px", height: "300px", margin: "0 auto" }}>
              <Bar
                data={getEquipmentTypeChartData()}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                    title: { display: true, text: "Equipment Type vs Count" },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* History Section */}
        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "20px",
            borderRadius: "8px",
            backgroundColor: "white",
          }}
        >
          {/* Header with Clear & Export */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h2>Upload History</h2>
            <div>
              <button
                onClick={() => setHistory([])}
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                  marginRight: "5px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a71d2a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#dc3545")}
              >
                Clear History
              </button>
              <button
                onClick={() => exportHistoryToCSV(history)}
                style={{
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1c7430")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#28a745")}
              >
                Export CSV
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p>No previous uploads found.</p>
          ) : (
            history.map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  margin: "10px 0",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  backgroundColor: "#fdfdfd",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <p>
                  <strong>Rows:</strong> {item.rows}
                </p>
                <p>
                  <strong>Columns:</strong> {item.columns}
                </p>
                <p>
                  <strong>Column Names:</strong> {item.column_names.join(", ")}
                </p>
                <p style={{ fontSize: "12px", color: "#555" }}>
                  <strong>Uploaded At:</strong> {item.uploaded_at}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
