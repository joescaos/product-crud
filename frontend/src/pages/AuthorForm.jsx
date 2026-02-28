import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAuthorById,
  createAuthor,
  updateAuthor,
} from "../api/authorsApi";

export default function AuthorForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [author, setAuthor] = useState({
    name: "",
    lastName: "",
    genre: "",
    nationality: "",
    birthdate: ""
  });

  useEffect(() => {
    if (id && id !== "new") {
      getAuthorById(id).then((response) => {
        const data = response.data;
        if (data && data.birthdate) {
          // Convert server ISO instant to a value usable by datetime-local input (no timezone)
          try {
            data.birthdate = new Date(data.birthdate).toISOString().slice(0, 16);
          } catch (e) {
            // leave as-is on parse error
          }
        }
        setAuthor(data);
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setAuthor({
      ...author,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert local datetime-local value to an ISO_INSTANT string for backend Instant fields
    const isoBirthdate = author.birthdate
      ? new Date(author.birthdate).toISOString()
      : null;

    const payload = {
      ...author,
      birthdate: isoBirthdate,
    };

    if (id === "new") {
      await createAuthor(payload);
    } else {
      await updateAuthor(id, payload);
    }

    navigate("/authors");
  };

  return (
    <div>
      <h2>{id === "new" ? "Create Author" : "Edit Author"}</h2>

      <form className="form-card"onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={author.name}
          onChange={handleChange}
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={author.lastName}
          onChange={handleChange}
        />

        <input
          name="genre"
          placeholder="Genre"
          value={author.genre}
          onChange={handleChange}
        />

        <input
          name="nationality"
          placeholder="Nationality"
          value={author.nationality}
          onChange={handleChange}
        />

        <input
          name="birthdate"
          type="datetime-local"
          value={author.birthdate}
          onChange={handleChange}
        />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}