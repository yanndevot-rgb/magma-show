import { useEffect, useState } from "react";
import "./App.css";

const API =
  "[script.google.com](https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec)";

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

    try {
      const res = await fetch(`${API}?action=getFiles&show=${name}`);
      const json = await res.json();
      setFiles(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
      setFiles([]);
    }
  }

  function getId(url) {
    return url?.match(/[-\w]{25,}/)?.[0];
  }

  function openDownload(file) {
    if (!file?.url) return;
    window.open(file.url, "_blank");
  }

  return (
    <div className="app">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h3 className="title">🎭 MAGMA SHOW</h3>

        <button className="btn" onClick={loadShows}>
          Rafraîchir
        </button>

        <div className="show-list">
          {shows.map((s, i) => {
            const name = s.name || s;
            return (
              <div
                key={i}
                onClick={() => openShow(name)}
                className={`show-item ${selectedShow === name ? "active" : ""}`}
              >
                🎬 {name}
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        {!selectedShow && (
          <div className="empty">Choisis un spectacle</div>
        )}

        {selectedShow && (
          <>
            <h2>{selectedShow}</h2>

            <div className="file-list">
              {files.map((f, i) => (
                <div key={i} className="file-row">
                  <span
                    onClick={() => setActiveFile(f)}
                    className="file-name"
                  >
                    📄 {f.name}
                  </span>

                  <button
                    className="download-btn"
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

      {/* MODAL PLAYER */}
      {activeFile && (
        <div className="modal" onClick={() => setActiveFile(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-btn"
              onClick={() => setActiveFile(null)}
            >
              ✕
            </button>

            <h3 className="modal-title">{activeFile.name}</h3>

            <div className="video-wrapper">
              <iframe
                src={`[drive.google.com](https://drive.google.com/file/d/${getId()
                  activeFile.url
                )}/preview`}
                allow="autoplay"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
