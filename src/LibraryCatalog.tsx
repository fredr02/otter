import React from 'react';
import {
  Heading,
  TableContainer,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Table,
} from '@chakra-ui/react';

import { book } from './App';

import TableBookItem from './TableBookItem';

type LibraryCatalogProps = {
  deleteBook: (book: book) => Promise<void>;
  bookItems: book[];
};

export function LibraryCatalog({ deleteBook, bookItems }: LibraryCatalogProps) {
  return (
    <>
      {' '}
      <Heading className="pl-3">Library Catalog</Heading>
      <TableContainer className="mt-4">
        <Table variant="simple" size="sm">
          <TableCaption>Catalog</TableCaption>
          <Thead>
            <Tr>
              <Th>Author</Th>
              <Th>Book Name</Th>
              <Th>Released</Th>
              <Th className="print:hidden">Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            <TableBookItem
              deleteBook={deleteBook}
              bookItems={bookItems as book[]}
            />
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
