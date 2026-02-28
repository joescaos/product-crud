import { BrowserRouter, Routes, Route } from "react-router-dom";
import BooksList from "./pages/BooksList";
import BookForm from "./pages/BookForm";
import AuthorsList from "./pages/AuthorsList";
import AuthorForm from "./pages/AuthorForm";
import CsvImport from "./pages/CsvImport";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <div className="nav-content">
          <a href="/books">Books</a>
          <a href="/authors">Authors</a>
          <a href="/import-csv">Import CSV</a>
        </div>
      </nav>
      <main>
        <div className="container">
          <Routes>
            <Route path="/books" element={<BooksList />} />
            <Route path="/books/:id" element={<BookForm />} />
            <Route path="/authors" element={<AuthorsList />} />
            <Route path="/import-csv" element={<CsvImport />} />
            <Route path="/authors/:id" element={<AuthorForm />} />
          </Routes>
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;