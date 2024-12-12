import React, { useEffect, useState } from 'react';
import { Product } from '../../types/productTypes';
import axios, { AxiosResponse } from 'axios';
import ProductCard from './ProductCard';
import { useNavigate, useLocation } from 'react-router-dom';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const url = process.env.REACT_APP_API_BASE_URL as string;
  const limit = 12;
  const navigate = useNavigate();
  const location = useLocation();

  const getProducts = async (page: number) => {
    try {
      const response: AxiosResponse<{
        products: Product[];
        total: number;
        page: number;
        pages: number;
      }> = await axios.get(`${url}/products`, {
        params: {
          page,
          limit,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page') || '1', 10);
    setCurrentPage(page);
    getProducts(page);
  }, [location.search]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setLoading(true);
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  return (
    <div className="product-page-container flex flex-col items-center m-auto pb-12 pt-8">
      <h1 className="text-3xl font-bold">Our Products</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid border-gray-200 border-t-gray-500 rounded-full" />
        </div>
      ) : (
        <>
          <div className="products-list grid grid-cols-1 gap-x-6 gap-y-8 mt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                _id={product._id}
                name={product.name}
                description={product.description}
                quantity={product.quantity}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </>
      )}
      <div className="pagination mt-8 flex items-center">
        <button
          className="px-2 py-1 rounded-sm bg-gray-200 disabled:bg-white"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          &lt;
        </button>
        <span className="px-4 py-2 m-1">{currentPage}</span>
        <button
          className="px-2 py-1 rounded-sm bg-gray-200 disabled:bg-white"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Products;
