import { useState } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3001/create-pass-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to get save URL");
      const data = await response.json();

      // Redirect to Google Wallet Save URL
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(
        "Could not connect to the backend server. Make sure it is running on port 3001.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Travel Pass Demo</h1>
        <p>Thêm thẻ di chuyển vào Google Wallet của bạn</p>
      </header>

      <main className="main">
        <div className="card-preview">
          <div className="travel-card">
            <div className="card-header">
              <span className="logo">V-PASS</span>
              <span className="type">TRAVEL PASS</span>
            </div>
            <div className="card-body">
              <div className="route">
                <div className="point">
                  <span className="label">FROM</span>
                  <span className="value">SGN</span>
                </div>
                <div className="arrow">→</div>
                <div className="point">
                  <span className="label">TO</span>
                  <span className="value">HAN</span>
                </div>
              </div>
              <div className="details">
                <div className="detail">
                  <span className="label">EXPIRES</span>
                  <span className="value">31 DEC 2026</span>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <div className="barcode-placeholder">|||| || ||||| || |||</div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button
            className="wallet-button"
            onClick={handleAddToWallet}
            disabled={loading}
          >
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRr0NHg7BxVC0u5htMQh8plDk2OI_4SfeeadA&s"
                  alt="Google Wallet"
                />
                <span>Add to Google Wallet</span>
              </>
            )}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2024 vPassed Demo. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
