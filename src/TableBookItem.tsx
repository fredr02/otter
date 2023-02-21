import React from 'react';
import { Tr, Td, Button } from '@chakra-ui/react';

type TableBookItemProps = {
  bookItems: { name: string; author: string; released: number }[];
};
const TableBookItem = ({ bookItems }: TableBookItemProps) => {
  if (bookItems) {
    return (
      <>
        {bookItems.map((item) => (
          <Tr key={item.name}>
            <Td>{item.author}</Td>
            <Td>{item.name}</Td>
            <Td>{item.released}</Td>
            <Td>
              <Button>Delete</Button>
            </Td>
          </Tr>
        ))}
      </>
    );
  }

  return <></>;
};

export default TableBookItem;