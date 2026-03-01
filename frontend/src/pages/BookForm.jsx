import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getBookById,
  createBook,
  updateBook,
} from "../api/booksApi";
import { getAuthors } from "../api/authorsApi";

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: "",
    description: "",
    genre: "",
    amountSold: 0,
    publicationDate: "",
    isAvailable: true,
    authorId: ""
  });

  const [authors, setAuthors] = useState([]);

  // Cargar autores para dropdown
  useEffect(() => {
    getAuthors().then((response) => {
      setAuthors(response.data);
    });
  }, []);

  // Si es edición, cargar libro
  useEffect(() => {
    if (id && id !== "new") {
      getBookById(id).then((response) => {
        const data = response.data;

        // Convert server ISO instant to a value usable by datetime-local input (no timezone)
        if (data && data.publicationDate) {
          try {
            data.publicationDate = new Date(data.publicationDate).toISOString().slice(0, 16);
          } catch (e) {
            // leave as-is on parse error
          }
        }

        setBook({
          ...data,
          authorId: data.author?.id || ""
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setBook({
      ...book,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert local datetime-local value to an ISO_INSTANT string for backend Instant fields
    const isoPublicationDate = book.publicationDate
      ? new Date(book.publicationDate).toISOString()
      : null;

    const payload = {
      ...book,
      publicationDate: isoPublicationDate,
      author: { id: book.authorId }
    };

    if (id === "new") {
      await createBook(payload);
    } else {
      await updateBook(id, payload);
    }

    navigate("/books");
  };

  return (
    <div>
      <h2>{id === "new" ? "Crear Libro" : "Editar Libro"}</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Título"
          value={book.title}
          onChange={handleChange}
        />

        <input
          name="description"
          placeholder="Descripción"
          value={book.description}
          onChange={handleChange}
        />

        <input
          name="genre"
          placeholder="Género"
          value={book.genre}
          onChange={handleChange}
        />

        <input
          name="amountSold"
          type="number"
          value={book.amountSold}
          onChange={handleChange}
        />

        <input
          name="publicationDate"
          type="datetime-local"
          value={book.publicationDate}
          onChange={handleChange}
        />

        <label>
          Disponible:
          <input
            type="checkbox"
            name="isAvailable"
            checked={book.isAvailable}
            onChange={handleChange}
          />
        </label>

        <select
          name="authorId"
          value={book.authorId}
          onChange={handleChange}
        >
          <option value="">Seleccionar autor</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name} {author.lastName}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}