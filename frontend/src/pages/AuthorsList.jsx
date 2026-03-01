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
      <h2>Autores</h2>
      <button className="btn-primary" onClick={() => navigate("/authors/new")}>
        Crear Autor
      </button>
      <div className="table-wrapper">
        <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Género</th>
            <th>Nacionalidad</th>
            <th>Acciones</th>
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
                <button className="btn-secondary" onClick={() => navigate(`/authors/${author.id}`)}>
                  Editar
                </button>
                <button className="btn-danger" onClick={() => handleDelete(author.id)}>
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