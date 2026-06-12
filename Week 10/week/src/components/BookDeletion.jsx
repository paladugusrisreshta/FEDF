import { useState } from "react";

function BookDeletion() {

  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Java Programming"
    },
    {
      id: 2,
      title: "Python Fundamentals"
    },
    {
      id: 3,
      title: "React Development"
    }
  ]);

  const [loading, setLoading] = useState(false);

  const deleteBook = async (id) => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1200));

    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    setLoading(false);
  };

  return (
    <main className="app-shell">
      <section className="glass-card deletion-card">
        <p className="eyebrow">Manage books</p>
        <h2>Book Deletion System</h2>
        <p className="subtle-text">
          Remove outdated books with a smooth loading animation and polished controls.
        </p>

        {loading && <div className="loading-pill">Deleting book...</div>}

        <ul className="book-list">
          {books.map(book => (
            <li key={book.id} className="book-item">
              <span>{book.title}</span>
              <button
                className="danger-btn"
                onClick={() => deleteBook(book.id)}
                disabled={loading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default BookDeletion;
