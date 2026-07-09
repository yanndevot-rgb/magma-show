import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    try {
      const res = await fetch(`${API}?action=getPrestations`);
      const json = await res.json();
      setShows(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
      setShows([]);
    }
  }

  async function openShow(name) {
    setSelectedShow(name);
    setActiveFile(null);
    setFiles([]);

    try {
      const res = await fetch(
        `${API}?action=getFiles&show=${encodeURIComponent(name)}`
      );
      const json = await res.json();
      setFiles(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
      setFiles([]);
    }
  }

  function getId(url) {
    return url?.match(/[-\w]{25,}/)?.[0] || "";
  }

  function isVideo(file) {
    const name = (file?.name || "").toLowerCase();
    return name.endsWith(".mp4") || name.endsWith(".mov") || name.endsWith(".avi");
  }

  function openFile(file) {
    if (!file?.url) return;

    if (isVideo(file)) {
      window.open(file.url, "_blank");
      return;
    }

    setActiveFile(file);
  }

  function openDownload(file) {
    if (!file?.url) return;
    window.open(file.url, "_blank");
  }

  return (
    <div style={styles.app}>
      <div style={styles.left}>
        <h3 style={styles.title}>🎭 MAGMA SHOW</h3>

        <button style={styles.btn} onClick={loadShows}>
          Rafraîchir
        </button>

        <div>
          {shows.map((s, i) => {
            const name = s.name || s;

            return (
              <div
                key={i}
                onClick={() => openShow(name)}
                style={{
                  ...styles.item,
                  background: selectedShow === name ? "#333" : "#1a1a1a"
                }}
              >
                🎬 {name}
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.right}>
        {!selectedShow && (
          <div style={styles.empty}>Choisis un spectacle</div>
        )}

        {selectedShow && (
          <>
            <h2>{selectedShow}</h2>

            <div>
              {files.map((f, i) => (
                <div key={i} style={styles.fileRow}>
                  <span onClick={() => openFile(f)} style={styles.fileName}>
                    {isVideo(f) ? "🎬" : "📄"} {f.name}
                  </span>

                  <button
                    style={styles.downloadBtn}
                    onClick={() => openDownload(f)}
                  >
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {activeFile && (
        <div style={styles.modal}>
          <div style={styles.modalBox}>
            <button
              style={styles.close}
              onClick={() => setActiveFile(null)}
            >
              ✕
            </button>

            <h3>{activeFile.name}</h3>

            <iframe
              title={activeFile.name}
              style={styles.viewer}
              src={`https://drive.google.com/file/d/${getId(
                activeFile.url
              )}/preview`}
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    height: "100vh",
    background: "#0f0f0f",
    color: "white",
    fontFamily: "Arial"
  },

  left: {
    width: 260,
    background: "#111",
    padding: 15
  },

  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10
  },

  btn: {
    width: "100%",
    padding: 8,
    marginBottom: 10,
    cursor: "pointer"
  },

  item: {
    padding: 10,
    marginTop: 8,
    cursor: "pointer",
    borderRadius: 6
  },

  right: {
    flex: 1,
    padding: 20
  },

  empty: {
    opacity: 0.6,
    fontSize: 18
  },

  fileRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 10,
    background: "#1a1a1a",
    borderRadius: 6
  },

  fileName: {
    cursor: "pointer"
  },

  downloadBtn: {
    cursor: "pointer"
  },

  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.95)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modalBox: {
    width: "90%",
    height: "90%",
    position: "relative"
  },

  close: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 10,
    cursor: "pointer"
  },

  viewer: {
    width: "100%",
    height: "90%",
    border: "none"
  }
};