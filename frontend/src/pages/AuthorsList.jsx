import { useEffect, useState } from "react";
import { getAuthors, deleteAuthor } from "../api/authorsApi";
import { useNavigate } from "react-router-dom";

export default function AuthorsList() {
  const [authors, setAuthors] = useState([]);
  const navigate = useNavigate();

  const loadAuthors = async () => {
    const response = await getAuthors();
    setAuthors(response.data);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleDelete = async (id) => {
    await deleteAuthor(id);
    loadAuthors();
  };

  return (
    <div>
      <h2>Authors</h2>
      <button onClick={() => navigate("/authors/new")}>
        Create Author
      </button>
      <div className="table-wrapper">
        <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Last Name</th>
            <th>Genre</th>
            <th>Nationality</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {authors.map((author) => (
            <tr key={author.id}>
              <td data-label="Name">{author.name}</td>
              <td data-label="Last Name">{author.lastName}</td>
              <td data-label="Genre">{author.genre}</td>
              <td data-label="Nationality">{author.nationality}</td>
              <td data-label="Actions">
                <button onClick={() => navigate(`/authors/${author.id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(author.id)}>
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