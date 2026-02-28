import API from "./axiosConfig";

export const getAuthors = () => API.get("/authors");

export const getAuthorById = (id) => API.get(`/authors/${id}`);

export const createAuthor = (data) => API.post("/authors", data);

export const updateAuthor = (id, data) => API.put(`/authors/${id}`, data);

export const deleteAuthor = (id) => API.delete(`/authors/${id}`);