import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Camera,
  Leaf,
  Activity,
} from "lucide-react";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // Sample images for reference
  const sampleImages = [
    { name: "Early Blight", url: "/api/placeholder/150/150" },
    { name: "Late Blight", url: "/api/placeholder/150/150" },
    { name: "Healthy Leaf", url: "/api/placeholder/150/150" },
  ];

  // Inline styles
  const styles = {
    app: {
      minHeight: "100vh",
      background:
        "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #f3e8ff 75%, #fdf2f8 100%)",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    header: {
      background: "white",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      borderBottom: "1px solid #e5e7eb",
    },
    headerContent: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "24px 16px",
    },
    headerTitleSection: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    headerIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "48px",
      height: "48px",
      background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
      borderRadius: "12px",
    },
    headerTitle: {
      fontSize: "2rem",
      fontWeight: "700",
      background: "linear-gradient(135deg, #22c55e 0%, #3b82f6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      margin: 0,
    },
    headerSubtitle: {
      color: "#6b7280",
      marginTop: "4px",
      fontSize: "0.9rem",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "32px 16px",
    },
    description: {
      textAlign: "center",
      marginBottom: "32px",
    },
    descriptionMain: {
      fontSize: "1.125rem",
      color: "#374151",
      marginBottom: "8px",
    },
    descriptionSub: {
      fontSize: "0.875rem",
      color: "#6b7280",
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: window.innerWidth >= 1024 ? "1fr 1fr" : "1fr",
      gap: "32px",
    },
    card: {
      background: "white",
      borderRadius: "16px",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      padding: "24px",
      marginBottom: "24px",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      color: "#111827",
    },
    uploadArea: {
      position: "relative",
      border: `2px dashed ${
        isDragOver ? "#3b82f6" : selectedFile ? "#22c55e" : "#d1d5db"
      }`,
      borderRadius: "12px",
      padding: "32px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      background: isDragOver ? "#eff6ff" : selectedFile ? "#f0fdf4" : "#fafafa",
    },
    uploadPlaceholder: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    },
    uploadIcon: {
      width: "64px",
      height: "64px",
      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    uploadMainText: {
      fontSize: "1.125rem",
      fontWeight: "500",
      color: "#111827",
      margin: 0,
    },
    uploadSubText: {
      fontSize: "0.875rem",
      color: "#6b7280",
      margin: "4px 0 0 0",
    },
    previewContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    },
    previewImage: {
      width: "192px",
      height: "192px",
      objectFit: "cover",
      borderRadius: "8px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    previewFilename: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#065f46",
      margin: 0,
    },
    buttonGroup: {
      marginTop: "24px",
      display: "flex",
      flexDirection: window.innerWidth >= 640 ? "row" : "column",
      gap: "12px",
    },
    btn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 24px",
      borderRadius: "12px",
      fontWeight: "500",
      fontSize: "0.9rem",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      textDecoration: "none",
      outline: "none",
    },
    btnPrimary: {
      background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
      color: "white",
      flex: 1,
      opacity: loading ? 0.5 : 1,
    },
    btnSecondary: {
      background: "#f3f4f6",
      color: "#374151",
      flex: "none",
    },
    errorMessage: {
      marginTop: "16px",
      padding: "16px",
      background: "#fef2f2",
      border: "1px solid #fecaca",
      borderRadius: "12px",
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
    errorText: {
      fontSize: "0.875rem",
      color: "#b91c1c",
      margin: 0,
    },
    samplesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "16px",
    },
    sampleItem: {
      textAlign: "center",
    },
    samplePlaceholder: {
      width: "100%",
      height: "96px",
      background: "linear-gradient(135deg, #dcfce7 0%, #dbeafe 100%)",
      borderRadius: "8px",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    sampleName: {
      fontSize: "0.75rem",
      color: "#6b7280",
      margin: 0,
    },
    predictionCard: {
      padding: "16px",
      background: "linear-gradient(135deg, #eff6ff 0%, #f3e8ff 100%)",
      borderRadius: "12px",
      border: "1px solid #dbeafe",
    },
    predictionHeader: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "8px",
    },
    predictionLabel: {
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#6b7280",
    },
    predictionDisease: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#111827",
      margin: "0 0 4px 0",
    },
    confidenceSection: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    confidenceHeader: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "0.875rem",
    },
    confidenceBar: {
      width: "100%",
      height: "12px",
      backgroundColor: "#e5e7eb",
      borderRadius: "6px",
      overflow: "hidden",
    },
    howItWorks: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    step: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
    stepNumber: {
      width: "24px",
      height: "24px",
      background: "#dbeafe",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.75rem",
      fontWeight: "700",
      color: "#3b82f6",
      flexShrink: 0,
    },
    stepText: {
      fontSize: "0.875rem",
      color: "#6b7280",
      margin: 0,
      marginTop: "2px",
    },
    footer: {
      background: "white",
      borderTop: "1px solid #e5e7eb",
      marginTop: "48px",
      textAlign: "center",
      padding: "24px 16px",
    },
    footerText: {
      fontSize: "0.875rem",
      color: "#6b7280",
      margin: 0,
    },
    spin: {
      animation: "spin 1s linear infinite",
    },
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setPrediction(null);
      setError(null);
    } else {
      setError("Please select a valid image file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const uploadImage = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message || "Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "#22c55e";
    if (confidence >= 0.6) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={styles.app}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin { animation: spin 1s linear infinite; }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerTitleSection}>
            <div style={styles.headerIcon}>
              <Leaf size={28} color="white" />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Potato Disease Detector</h1>
              <p style={styles.headerSubtitle}>
                AI-powered plant health analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      <div style={styles.container}>
        {/* Description */}
        <div style={styles.description}>
          <p style={styles.descriptionMain}>
            Upload an image of a potato leaf to detect diseases using advanced
            AI analysis
          </p>
          <p style={styles.descriptionSub}>
            Supports detection of Early Blight, Late Blight, and Healthy leaves
          </p>
        </div>

        <div style={styles.mainGrid}>
          {/* Upload Section */}
          <div>
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>
                <Camera size={20} color="#3b82f6" />
                Upload Potato Leaf Image
              </h2>

              {/* Upload Area */}
              <div
                style={styles.uploadArea}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                />

                {previewUrl ? (
                  <div style={styles.previewContainer}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={styles.previewImage}
                    />
                    <p style={styles.previewFilename}>{selectedFile?.name}</p>
                  </div>
                ) : (
                  <div style={styles.uploadPlaceholder}>
                    <div style={styles.uploadIcon}>
                      <Upload size={32} color="white" />
                    </div>
                    <div>
                      <p style={styles.uploadMainText}>
                        Drop your image here or click to browse
                      </p>
                      <p style={styles.uploadSubText}>
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={styles.buttonGroup}>
                {selectedFile && !prediction && (
                  <button
                    onClick={uploadImage}
                    disabled={loading}
                    style={{ ...styles.btn, ...styles.btnPrimary }}
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={20} className="spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Activity size={20} />
                        <span>Analyze Image</span>
                      </>
                    )}
                  </button>
                )}

                {(selectedFile || prediction) && (
                  <button
                    onClick={resetUpload}
                    style={{ ...styles.btn, ...styles.btnSecondary }}
                  >
                    <RefreshCw size={20} />
                    <span>Upload Another</span>
                  </button>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div style={styles.errorMessage}>
                  <AlertCircle
                    size={20}
                    color="#dc2626"
                    style={{ flexShrink: 0, marginTop: "2px" }}
                  />
                  <div>
                    <h4
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        color: "#991b1b",
                        margin: "0 0 4px 0",
                      }}
                    >
                      Error
                    </h4>
                    <p style={styles.errorText}>{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sample Images */}
            <div style={styles.card}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#111827",
                }}
              >
                Sample Images
              </h3>
              <div style={styles.samplesGrid}>
                {sampleImages.map((sample, index) => (
                  <div key={index} style={styles.sampleItem}>
                    <div style={styles.samplePlaceholder}>
                      <Leaf size={32} color="#22c55e" />
                    </div>
                    <p style={styles.sampleName}>{sample.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {prediction && (
              <div style={styles.card}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <h2 style={styles.sectionTitle}>
                    <CheckCircle size={20} color="#22c55e" />
                    Analysis Results
                  </h2>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Main Prediction */}
                  <div style={styles.predictionCard}>
                    <div style={styles.predictionHeader}>
                      <span style={styles.predictionLabel}>
                        Detected Disease
                      </span>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          color: getConfidenceColor(prediction.confidence),
                        }}
                      >
                        {(prediction.confidence * 100).toFixed(1)}% confident
                      </span>
                    </div>
                    <h3 style={styles.predictionDisease}>
                      {prediction.class || prediction.disease_name || "Unknown"}
                    </h3>
                    {prediction.description && (
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        {prediction.description}
                      </p>
                    )}
                  </div>

                  {/* Confidence Bar */}
                  <div style={styles.confidenceSection}>
                    <div style={styles.confidenceHeader}>
                      <span style={{ color: "#6b7280" }}>Confidence Level</span>
                      <span
                        style={{
                          fontWeight: "500",
                          color: getConfidenceColor(prediction.confidence),
                        }}
                      >
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div style={styles.confidenceBar}>
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "6px",
                          transition: "width 0.5s ease-in-out",
                          width: `${prediction.confidence * 100}%`,
                          backgroundColor: getConfidenceColor(
                            prediction.confidence
                          ),
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {prediction.recommendations && (
                    <div
                      style={{
                        padding: "16px",
                        background: "#fffbeb",
                        border: "1px solid #fed7aa",
                        borderRadius: "12px",
                      }}
                    >
                      <h4
                        style={{
                          fontWeight: "500",
                          color: "#92400e",
                          margin: "0 0 8px 0",
                        }}
                      >
                        Recommendations
                      </h4>
                      <p
                        style={{
                          fontSize: "0.875rem",
                          color: "#b45309",
                          margin: 0,
                        }}
                      >
                        {prediction.recommendations}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Card */}
            <div style={styles.card}>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "600",
                  marginBottom: "16px",
                  color: "#111827",
                }}
              >
                How it works
              </h3>
              <div style={styles.howItWorks}>
                <div style={styles.step}>
                  <div style={styles.stepNumber}>1</div>
                  <p style={styles.stepText}>
                    Upload a clear image of a potato leaf
                  </p>
                </div>
                <div style={styles.step}>
                  <div style={styles.stepNumber}>2</div>
                  <p style={styles.stepText}>
                    Our AI model analyzes the leaf for disease symptoms
                  </p>
                </div>
                <div style={styles.step}>
                  <div style={styles.stepNumber}>3</div>
                  <p style={styles.stepText}>
                    Get instant results with confidence scores and
                    recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Powered by advanced machine learning • Built for farmers and
          researchers
        </p>
      </footer>
    </div>
  );
};

export default App;
