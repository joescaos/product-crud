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
      <h2>Books</h2>
      <button onClick={() => navigate("/books/new")}>
        Create Book
      </button>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td data-label="Title">{book.title}</td>
                <td data-label="Genre">{book.genre}</td>
                <td data-label="Actions">
                  <button onClick={() => navigate(`/books/${book.id}`)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(book.id)}>
                    Delete
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