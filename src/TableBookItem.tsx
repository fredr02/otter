import React from 'react';
import { Tr, Td, Button } from '@chakra-ui/react';
import { book } from './App';

type TableBookItemProps = {
  bookItems: book[];
  deleteBook: (item: book) => void;
};
const TableBookItem = ({ bookItems, deleteBook }: TableBookItemProps) => {
  if (bookItems) {
    return (
      <>
        {bookItems.map((item) => (
          <Tr key={item.id}>
            <Td>{item.author}</Td>
            <Td>{item.name}</Td>
            <Td>{item.released}</Td>
            <Td className="print:hidden">
              <Button
                onClick={() => {
                  deleteBook(item);
                }}
              >
                Delete
              </Button>
            </Td>
          </Tr>
        ))}
      </>
    );
  }

  return <></>;
};

export default TableBookItem;
