import { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/booksApi";
import { useNavigate } from "react-router-dom";

export default function BooksList() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const loadBooks = async () => {
    const response = await getBooks();
    setBooks(response.data);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    await deleteBook(id);
    loadBooks();
  };

  return (
    <div>
      <h2>Libros</h2>
      <button className="btn-primary" onClick={() => navigate("/books/new")}>
        Crear Libro
      </button>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Género</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td data-label="Title">{book.title}</td>
                <td data-label="Genre">{book.genre}</td>
                <td data-label="Actions">
                  <button className="btn-secondary" onClick={() => navigate(`/books/${book.id}`)}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(book.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}