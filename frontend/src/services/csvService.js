/**
 * Service para parsear CSV de autores y libros
 * Agrupa libros por autor (por coincidencia de name + lastName)
 */

export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('El archivo CSV debe contener encabezados y al menos una fila de datos');
  }

  // Obtener encabezados
  const headers = parseCSVLine(lines[0]);

  // Parsear datos
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((header, idx) => {
        row[header] = values[idx] || '';
      });
      rows.push(row);
    }
  }

  return rows;
}

/**
 * Parsea una línea CSV respetando comillas
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

/**
 * Agrupa los datos por autor
 * Retorna un objeto con estructura:
 * {
 *   authorsMap: Map de (name+lastName) -> authorData,
 *   booksMap: Map de (name+lastName) -> [libros]
 * }
 */
export function groupAuthorsByRow(rows) {
  const authorsMap = new Map();
  const booksMap = new Map();

  rows.forEach((row) => {
    const authorKey = `${row.name}|${row.lastName}`;

    // Guardar datos del autor si no existe
    if (!authorsMap.has(authorKey)) {
      authorsMap.set(authorKey, {
        name: row.name,
        lastName: row.lastName,
        genre: row.genre || '',
        nationality: row.nationality || '',
        birthdate: row.birthdate || ''
      });
    }

    // Guardar libro asociado
    if (!booksMap.has(authorKey)) {
      booksMap.set(authorKey, []);
    }

    const book = {
      title: row.title || '',
      description: row.description || '',
      genre: row.book_genre || '',
      isAvailable: row.is_available === 'true' || row.is_available === 'TRUE' || row.is_available === '1',
      amountSold: parseInt(row.amount_sold || 0, 10),
      publicationDate: row.publication_date || ''
    };

    booksMap.get(authorKey).push(book);
  });

  return { authorsMap, booksMap };
}

/**
 * Valida que los datos del CSV sean válidos
 */
export function validateCSVData(rows) {
  const errors = [];

  if (!rows || rows.length === 0) {
    errors.push('El archivo CSV no contiene datos');
    return errors;
  }

  rows.forEach((row, idx) => {
    const lineNumber = idx + 2; // +2 porque comienza en línea 1 (encabezados en línea 0)

    if (!row.name || !row.name.trim()) {
      errors.push(`Línea ${lineNumber}: El campo "name" es requerido`);
    }

    if (!row.lastName || !row.lastName.trim()) {
      errors.push(`Línea ${lineNumber}: El campo "lastName" es requerido`);
    }

    if (!row.title || !row.title.trim()) {
      errors.push(`Línea ${lineNumber}: El campo "title" es requerido`);
    }

    if (row.birthdate && !isValidDate(row.birthdate)) {
      errors.push(`Línea ${lineNumber}: Fecha de nacimiento inválida: ${row.birthdate}`);
    }

    if (row.publication_date && !isValidDate(row.publication_date)) {
      errors.push(`Línea ${lineNumber}: Fecha de publicación inválida: ${row.publication_date}`);
    }

    if (row.amount_sold && isNaN(parseInt(row.amount_sold, 10))) {
      errors.push(`Línea ${lineNumber}: "amount_sold" debe ser un número`);
    }
  });

  return errors;
}

/**
 * Valida si una fecha en formato ISO es válida
 */
function isValidDate(dateString) {
  try {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  } catch {
    return false;
  }
}
