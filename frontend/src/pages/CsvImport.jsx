import { useState } from "react";
import { uploadCSVFile } from "../api/importApi";
import { useNavigate } from "react-router-dom";

export default function CsvImport() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
    setError(null);
    setSuccess(false);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setMessage("");

    if (!file) {
      setError("Por favor selecciona un archivo CSV");
      return;
    }

    if (!file.name.endsWith(".csv")) {
      setError("El archivo debe tener extensión .csv");
      return;
    }

    setLoading(true);

    try {
      const response = await uploadCSVFile(file);
      setSuccess(true);
      setMessage(response.data || "Archivo importado exitosamente");

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        setFile(null);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
        navigate("/authors");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error al procesar el archivo";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Importar Autores y Libros desde CSV</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="file-input" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Selecciona archivo CSV:
          </label>
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={loading}
            style={{ marginBottom: 0 }}
          />
          {file && (
            <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.5rem" }}>
              📄 {file.name}
            </p>
          )}
        </div>

        <button type="submit" disabled={!file || loading}>
          {loading ? "Procesando..." : "Importar"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          background: "#fee2e2",
          border: "1px solid #fecaca",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: "1.5rem",
          maxWidth: "600px",
          margin: "1.5rem auto"
        }}>
          <h3 style={{ color: "#991b1b", marginTop: 0 }}>❌ Error:</h3>
          <p style={{ color: "#7f1d1d", margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Éxito */}
      {success && (
        <div style={{
          background: "#dcfce7",
          border: "1px solid #86efac",
          borderRadius: "8px",
          padding: "1rem",
          marginTop: "1.5rem",
          maxWidth: "600px",
          margin: "1.5rem auto"
        }}>
          <h3 style={{ color: "#166534", marginTop: 0 }}>✅ Importación exitosa!</h3>
          <p style={{ color: "#15803d", margin: "0.5rem 0" }}>
            {message}
          </p>
          <p style={{ fontSize: "0.875rem", color: "#15803d" }}>
            Redirigiendo a autores...
          </p>
        </div>
      )}

      {/* Instrucciones */}
      <div style={{
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "2rem",
        maxWidth: "600px",
        margin: "2rem auto"
      }}>
        <h3 style={{ color: "#1e40af", marginTop: 0 }}>📋 Formato del CSV esperado:</h3>
        <p style={{ fontSize: "0.875rem", color: "#1e3a8a", margin: "0.5rem 0" }}>
          <strong>Encabezados requeridos:</strong>
        </p>
        <code style={{
          display: "block",
          background: "white",
          padding: "0.75rem",
          borderRadius: "6px",
          fontSize: "0.75rem",
          overflowX: "auto",
          color: "#1f2937",
          wordBreak: "break-word"
        }}>
          name,lastName,genre,nationality,birthdate,title,description,book_genre,is_available,amount_sold,publication_date
        </code>
        <p style={{ fontSize: "0.875rem", color: "#1e3a8a", margin: "0.75rem 0 0.5rem 0" }}>
          <strong>Campos requeridos:</strong>
        </p>
        <ul style={{ fontSize: "0.875rem", color: "#1e3a8a", margin: "0", paddingLeft: "1.5rem" }}>
          <li>name (nombre del autor)</li>
          <li>lastName (apellido del autor)</li>
          <li>title (título del libro)</li>
        </ul>
        <p style={{ fontSize: "0.875rem", color: "#1e3a8a", marginTop: "0.75rem" }}>
          <strong>Fechas:</strong> Formato ISO (ej: 2008-12-30T20:16:00Z)
        </p>
        <p style={{ fontSize: "0.875rem", color: "#1e3a8a" }}>
          <strong>is_available:</strong> true o false
        </p>
      </div>
    </div>
  );
}
