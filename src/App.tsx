import React, { useEffect, useState } from 'react';
import {
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Modal,
} from '@chakra-ui/react';
import './App.css';
import TableBookItem from './TableBookItem';
import { BiBookAdd, BiPrinter } from 'react-icons/bi';

import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import AddBookModal from './AddBookModal';

type book = {
  name: string;
  author: string;
  released: string;
};
function App() {
  const [bookItems, setBookItems] = useState<book[] | null>(null);
  const [scannedBook, setScannedBook] = useState<number>();

  const [showAddBook, setShowAddBook] = useState(false);

  async function fetchCatalog() {
    const snapshot = await getDocs(collection(db, 'books'));
    let bookData: book[] = [];
    snapshot.docs.forEach((doc) => {
      bookData.push(doc.data() as book);
    });
    setBookItems(bookData);
  }

  async function fetchBook() {
    if (scannedBook == undefined) return;
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${scannedBook}+isbn&maxResults=1&key=${
        import.meta.env.VITE_BOOKSAPI
      }`
    );
    const data = await response.json();
    const book = {
      name: data.items[0].volumeInfo.title,
      author: data.items[0].volumeInfo.authors[0],
      released: data.items[0].volumeInfo.publishedDate,
    };
    setScannedBook(undefined);
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

  let logo: JSX.Element = <h1>Otter</h1>;
  if (import.meta.env.VITE_LOGOURL)
    logo = <img src={import.meta.env.VITE_LOGOURL} />;
  return (
    <>
      <div className="bg-pb-red h-20 flex justify-between items-center px-8">
        {/* LOGO */}
        <div className="text-2xl">{logo}</div>
        {/* BUTTONS */}
        <div>
          <Button onClick={enableShowAddBook}>
            <BiBookAdd />
            Add Book
          </Button>
          <Button className="ml-2">
            <BiPrinter />
            Print List
          </Button>
        </div>
      </div>
      {/* BODY */}
      <div className="mx-auto mx mt-4 max-w-4xl">
        <Heading>Library Catalog</Heading>
        <TableContainer className="mt-4">
          <Table variant="simple">
            <TableCaption>Catalog</TableCaption>
            <Thead>
              <Tr>
                <Th>Author</Th>
                <Th>Book Name</Th>
                <Th>Released</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              <TableBookItem bookItems={bookItems as book[]} />
            </Tbody>
          </Table>
        </TableContainer>
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
