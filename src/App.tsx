import { Catalog } from './components/Catalog';
import React, { useEffect, useState } from 'react';
import { parseFullName } from 'parse-full-name';
import { Button } from '@chakra-ui/react';
import './App.css';
import { BiBookAdd, BiPrinter } from 'react-icons/bi';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import AddBookModal from './AddBookModal';

export type book = {
  name: string;
  author: string;
  released: string;
  id: string;
};

function App() {
  const [bookItems, setBookItems] = useState<book[] | null>(null);
  const [scannedBook, setScannedBook] = useState<string | undefined>();

  const [showAddBook, setShowAddBook] = useState(false);

  async function fetchCatalog() {
    const snapshot = await getDocs(collection(db, 'books'));
    const bookData: book[] = [];
    snapshot.docs.forEach((doc) => {
      bookData.push({ ...doc.data(), id: doc.id } as book);
    });
    sortCatalog(bookData);
  }

  function sortCatalog(bookData: book[]) {
    setBookItems(
      bookData.sort((a, b) => {
        if (a.author <= b.author) {
          return -1;
        } else {
          return 1;
        }
      })
    );
  }

  async function fetchBook() {
    if (scannedBook == undefined) return;
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${scannedBook}+isbn&maxResults=1&key=${
        import.meta.env.VITE_BOOKSAPI
      }`
    );
    const data = await response.json();

    const parsedName = parseFullName(data.items[0].volumeInfo.authors[0]);
    const book = {
      name: data.items[0].volumeInfo.title,
      author: `${parsedName.last}, ${parsedName.first}`,
      released: data.items[0].volumeInfo.publishedDate,
    };
    setScannedBook(undefined);
    postBook(book as book);
    console.log(data);
  }
  async function postBook(book: book) {
    const docRef = await addDoc(collection(db, 'books'), book);
    sortCatalog([...(bookItems as book[]), { ...book, id: docRef.id }]);
  }
  async function deleteBook(book: book) {
    const docRef = doc(db, `books/${book.id}`);
    deleteDoc(docRef);
    setBookItems((p) => {
      // Fix this. ESLINT is forcing this below
      if (!p) return p;
      return p.filter((item) => {
        return item.id != book.id;
      });
    });
  }
  useEffect(() => {
    fetchCatalog();
  }, []);

  useEffect(() => {
    fetchBook();
  }, [scannedBook]);

  function enableShowAddBook() {
    setShowAddBook(true);
  }
  function print() {
    window.print();
  }

  let logo: JSX.Element = <h1>Otter</h1>;
  if (import.meta.env.VITE_LOGOURL)
    logo = (
      <img src={import.meta.env.VITE_LOGOURL} className="w-[100px] md:w-auto" />
    );
  return (
    <>
      <div className="print:hidden bg-pb-red h-20 flex justify-between items-center md:px-8 px-2">
        {/* LOGO */}
        <div className="text-2xl">{logo}</div>
        {/* BUTTONS */}
        <div>
          <Button onClick={enableShowAddBook}>
            <BiBookAdd />
            Add Book
          </Button>
          <Button onClick={print} className="ml-2">
            <BiPrinter />
            Print List
          </Button>
        </div>
      </div>
      {/* BODY */}
      <div className="mx-auto mx mt-4 max-w-4xl">
        <Catalog
          bookItems={bookItems as book[]}
          name="Library Catalog"
          deleteBook={deleteBook}
        />
      </div>
      {showAddBook ? (
        <AddBookModal
          show={showAddBook}
          setScannedBook={setScannedBook}
          setShowAddBook={setShowAddBook}
        />
      ) : null}
    </>
  );
}

export default App;
