const { nanoid } = require('nanoid');
const notes = require('./notes');

const addBooks = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newNote = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
  });
  response.code(400);
  return response;
};

const getBooks = (request, h) => {
  const books = notes.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
  const books2 = notes.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
    reading: book.reading === 'true',
    finished: book.finished === 'true',
  }));

  const { name, reading, finished } = request.query;

  if (reading) {
    const bookReaded = books2.filter((book) => book.reading);
    const response = h.response({
      status: 'success',
      data: {
        books: bookReaded,
      },
    });
    response.code(200);
    return response;
  }

  if (finished) {
    const bookFinished = books2.filter((book) => book.finished);
    const response = h.response({
      status: 'success',
      data: {
        books: bookFinished,
      },
    });
    response.code(200);
    return response;
  }

  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books,
      },
    });
    response.code(200);
    return response;
  }

  if (name) {
    const bookDicod = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: bookDicod,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const getIdBooks = (request, h) => {
  const { bookId } = request.params;

  const book = notes.filter((n) => n.id === bookId)[0];

  if (book === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const editBooks = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = notes.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    notes[index].name = name;
    notes[index].year = year;
    notes[index].author = author;
    notes[index].summary = summary;
    notes[index].publisher = publisher;
    notes[index].pageCount = pageCount;
    notes[index].readPage = readPage;
    notes[index].reading = reading;
    notes[index].updatedAt = updatedAt;

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBooks = (request, h) => {
  const { bookId } = request.params;
  const index = notes.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBooks,
  getBooks,
  getIdBooks,
  editBooks,
  deleteBooks,
};
