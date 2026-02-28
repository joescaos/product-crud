import API from "./axiosConfig";

export const getBooks = () => API.get("/books");

export const getBookById = (id) => API.get(`/books/${id}`);

export const createBook = (data) => API.post("/books", data);

export const updateBook = (id, data) => API.put(`/books/${id}`, data);

export const deleteBook = (id) => API.delete(`/books/${id}`);