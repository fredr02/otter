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
} from '@chakra-ui/react';
import './App.css';
import TableBookItem from './TableBookItem';

import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

type book = {
  name: string;
  author: string;
  released: number;
};
function App() {
  const [bookItems, setBookItems] = useState<book[] | null>(null);

  async function fetchData() {
    const snapshot = await getDocs(collection(db, 'books'));
    let bookData: book[] = [];
    snapshot.docs.forEach((doc) => {
      bookData.push(doc.data() as book);
    });
    setBookItems(bookData);
  }

  useEffect(() => {
    fetchData();
  }, []);

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
          <Button>Add Book</Button>
          <Button className="ml-2">Print List</Button>
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
    </>
  );
}

export default App;
