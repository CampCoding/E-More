import React, { useEffect, useState } from 'react';
import { booksData } from './data';
import './books.css';
import Footer from '../../components/Footer/Footer';
import { Axios } from '../../components/axios';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
const Books = () => {
  const [books, setBooks] = useState([]);
  const [pageLoading, setPageLoading] = useState(false);
  const getBooks = () => {
    setBooks(booksData);
    Axios({
      method: 'POST'
      // url: BASE_URL + BASES_ROUTES?.admin + API_ROUTES?.pdf?.BASE_ROUTE + API_ROUTES?.pdf?.ROUTES?.select,
    })
      .then((res) => {
        if (res.status == 'success') {
          // setBooks(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .finally(() => {
        setPageLoading(false);
      });
  };
  useEffect(() => {
    getBooks();
  }, []);
  return (
    <>
      <div className="books_page">
        <h4>Our Books Of This Courses</h4>
        <div className="books">
          {pageLoading ? (
            <div style={{ width: '100vw' }}>
              <Skeleton height={34} count={12} />
            </div>
          ) : (
            books.map((item, index) => {
              return (
                <div className="book">
                  <img src={require("../../assets/book.png")} alt="" />
                  <h4>{item.book_name}</h4>
                </div>
              );
            })
          )}
        </div>
      </div>
      {}
    </>
  );
};

export default Books;
