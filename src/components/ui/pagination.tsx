import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  return (
    <div className="flex justify-center items-center mt-4 space-x-4">
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-slate-300 rounded disabled:opacity-50  text-black"
      >
        Anterior
      </button>
      <span className="text-sm">
        Página {currentPage} de {totalPages}
      </span>
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className="px-4 py-2  bg-blue-600 rounded disabled:opacity-50 text-white"
      >
        Próximo
      </button>
    </div>
  );
};

export default Pagination;
