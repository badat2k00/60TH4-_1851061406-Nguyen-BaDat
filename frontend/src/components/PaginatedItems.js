import React, { useEffect, useState } from 'react';

import ReactPaginate from 'react-paginate';

  
  function PaginatedItems({ itemsPerPage,setCurrentItems,items }) {
    const [itemOffset, setItemOffset] = useState(0);
    useEffect(()=>{
    const endOffset = itemOffset + itemsPerPage;
    setCurrentItems(items.slice(itemOffset, endOffset));
    },[itemOffset,itemsPerPage,setCurrentItems,items])
    const pageCount = Math.ceil(items.length / itemsPerPage);

    const handlePageClick = (e) => {
      const newOffset = (e.selected * itemsPerPage) % items.length;
      setItemOffset(newOffset);
    };
  
    return (
      <>
        <ReactPaginate className='flex justify-center gap-1  '
          breakLabel="..."
          nextLabel="sau >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="< trước"
          renderOnZeroPageCount={null}
        />
      </>
    );
  }
  
export default PaginatedItems;