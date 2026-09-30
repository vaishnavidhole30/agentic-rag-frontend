import { useState } from "react";
import "./App.css";

function App() {
  const [paper, setPaper] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://localhost:8080/api/papers";

  // Upload research paper
  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Please select a PDF file.");
      return;
    }

    setUploading(true);
    setMessage("");
    setAnswer("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      setPaper(data);
      setMessage("Research paper uploaded successfully.");
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to upload the paper. Please make sure the backend is running."
      );
    } finally {
      setUploading(false);
    }
  };

  // Ask question
  const handleAskQuestion = async () => {
    if (!paper) {
      setMessage("Please upload a research paper first.");
      return;
    }

    if (!question.trim()) {
      setMessage("Please enter a question.");
      return;
    }

    setLoading(true);
    setAnswer("");
    setMessage("");

    try {
      const encodedQuestion = encodeURIComponent(question);

      const response = await fetch(
        `${API_URL}/${paper.id}/agent-ask?question=${encodedQuestion}`
      );

      if (!response.ok) {
        throw new Error("Question failed");
      }

      const data = await response.text();

      setAnswer(data);
    } catch (error) {
      console.error(error);
      setMessage(
        "Unable to get an answer. Please make sure the backend and Ollama are running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-area">
          <div className="logo-icon">AI</div>
          <div>
            <h2>Agentic RAG</h2>
            <span>Research Paper Assistant</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI System Ready
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="badge">INTELLIGENT RESEARCH ASSISTANT</span>

          <h1>
            Ask Questions.
            <br />
            <span>Understand Research.</span>
          </h1>

          <p>
            Upload your research paper and let our Agentic RAG system
            retrieve, analyze, validate, and generate accurate answers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-container">

        {/* Upload Card */}
        <section className="card upload-card">

          <div className="card-header">
            <div className="step-number">01</div>
            <div>
              <h2>Upload Research Paper</h2>
              <p>Select a PDF research paper to begin.</p>
            </div>
          </div>

          <label className="upload-area">
            <input
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              hidden
            />

            <div className="upload-icon">↑</div>

            {uploading ? (
              <h3>Uploading paper...</h3>
            ) : (
              <h3>Click to upload your PDF</h3>
            )}

            <p>Only PDF files are supported</p>
          </label>

          {paper && (
            <div className="paper-info">
              <div className="pdf-icon">PDF</div>

              <div className="paper-details">
                <strong>
                  {paper.title || paper.fileName || "Research Paper"}
                </strong>

                <span>Paper ID: {paper.id}</span>
              </div>

              <div className="check">✓</div>
            </div>
          )}

          {message && (
            <div className="message">
              {message}
            </div>
          )}
        </section>

        {/* Question Card */}
        <section className="card question-card">

          <div className="card-header">
            <div className="step-number">02</div>

            <div>
              <h2>Ask Your Question</h2>
              <p>
                Our agents will retrieve and analyze relevant information.
              </p>
            </div>
          </div>

          <div className="question-box">
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Example: What is Agentic RAG and how does it differ from traditional RAG?"
              rows="4"
            />

            <button
              className="ask-button"
              onClick={handleAskQuestion}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Ask Agentic RAG →"}
            </button>
          </div>
        </section>

        {/* Workflow */}
        <section className="workflow-section">

          <div className="workflow-title">
            <span className="badge">AGENTIC WORKFLOW</span>
            <h2>How Your Question Is Processed</h2>
          </div>

          <div className="workflow">

            <div className="workflow-step">
              <div className="workflow-icon">Q</div>
              <h3>Query Agent</h3>
              <p>Classifies your question</p>
            </div>

            <div className="arrow">→</div>

            <div className="workflow-step">
              <div className="workflow-icon">R</div>
              <h3>Retrieval Agent</h3>
              <p>Finds relevant chunks</p>
            </div>

            <div className="arrow">→</div>

            <div className="workflow-step">
              <div className="workflow-icon">AI</div>
              <h3>LLM</h3>
              <p>Generates an answer</p>
            </div>

            <div className="arrow">→</div>

            <div className="workflow-step">
              <div className="workflow-icon">✓</div>
              <h3>Critic Agent</h3>
              <p>Validates the answer</p>
            </div>

          </div>
        </section>

        {/* Answer */}
        {loading && (
          <section className="card loading-card">
            <div className="loader"></div>

            <div>
              <h2>Agentic RAG is working...</h2>
              <p>
                Classifying query → Retrieving information → Generating
                answer → Validating response
              </p>
            </div>
          </section>
        )}

        {answer && !loading && (
          <section className="card answer-card">

            <div className="answer-header">
              <div className="answer-icon">AI</div>

              <div>
                <span className="answer-label">GENERATED ANSWER</span>
                <h2>Research Assistant Response</h2>
              </div>
            </div>

            <div className="answer-content">
              {answer}
            </div>

            <div className="validated">
              ✓ Answer generated using the Agentic RAG workflow
            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer>
        <p>
          Intelligent Research Paper Assistant
        </p>

        <span>
          Powered by Spring Boot • MySQL • Hugging Face • Ollama
        </span>
      </footer>

    </div>
  );
}

export default App;