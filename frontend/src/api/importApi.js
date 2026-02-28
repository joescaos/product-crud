import API from "./axiosConfig";

/**
 * Envía un archivo CSV al backend para que lo procese
 * Retorna un mensaje de éxito del servidor
 */
export const uploadCSVFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post("/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
