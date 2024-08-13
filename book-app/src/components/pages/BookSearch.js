import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PriceFilter from "../layout/PriceFilter";
import Home from "./Home";
import BookCard from "../layout/BookCard";
import API, { endpoints } from "../../configs/API";
import { useSearchParams } from "react-router-dom";

const BookSearch = () => {
  const [books, setBooks] = React.useState([]);
  const [q] = useSearchParams();

  const loadBooks = async () => {
    try {
      const cate = q.get('cate') || '';
      const query = q.get('q') || '';
      const page = q.get('page') || '';
      let res = await API.get(`${endpoints["books"]}?cate=${cate}&q=${query}&page=${page}`);
      setBooks(res.data.results);
    }
    catch (ex) {
      console.error(ex);
    }
  };

  React.useEffect(() => {
    loadBooks();
  }, [q]);

  return (
    <div class="row">
      <PriceFilter />
      <div class="col-md-9 col-sm-12 bg-ligth mt-3">
        <div class="row">
          <h2 class="col-md-7 p-2 m-0">Kết quả tìm kiếm</h2>
          <div class="col-md-5 d-flex align-items-center justify-content-end">
            <p class="p-3">Sắp xếp</p>
            <div>
              <div class="select-container">
                <select
                  class="select-box"
                  name="SortBy"
                  id="SortBy"
                  style={{ transform: "translateY(-20%)" }}
                >
                  <option value="manual">Tùy chọn</option>
                  <option value="best-selling">Bán chạy nhất</option>
                  <option value="title-ascending">Tên A-Z</option>
                  <option value="title-descending">Tên Z-A</option>
                  <option value="price-ascending">Giá tăng dần</option>
                  <option value="price-descending">Giá giảm dần</option>
                  <option value="created-descending">Mới nhất</option>
                  <option value="created-ascending">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-wrap justify-content-around">
          {
            books.length > 0 && books.map((book, index) => (
              <>
                <div key={book.id} className={`col-lg-3 col-sm-4 mb-4 ${index === books.length - 1 ? 'me-auto' : ''}`}>
                  <BookCard book={book}></BookCard>
                </div>
                {/* <div key={book.id} className={`col-lg-3 col-sm-4 mb-4 ${index === books.length - 1 ? 'me-auto' : ''}`}>

                <BookCard book={book}></BookCard>
              </div>
              <div key={book.id} className={`col-lg-3 col-sm-4 mb-4 ${index === books.length - 1 ? 'me-auto' : ''}`}>
                <BookCard book={book}></BookCard>
              </div>
              <div key={book.id} className={`col-lg-3 col-sm-4 mb-4 ${index === books.length - 1 ? 'me-auto' : ''}`}>
                <BookCard book={book}></BookCard>
              </div>
              <div key={book.id} className={`col-lg-3 col-sm-4 mb-4 ${index === books.length - 1 ? 'me-auto' : ''}`}>
                <BookCard book={book}></BookCard>
              </div>
              <div key={book.id} className={`col-lg-3 col-sm-4 mb-4 ${index === books.length - 1 ? 'me-auto' : ''}`}>
                <BookCard book={book}></BookCard>
              </div>
              <div key={book.id} className={`col-lg-3 col-sm-4 mb-4 ${index === books.length - 1 ? 'me-auto' : ''}`}>
                <BookCard book={book}></BookCard>
              </div> */}
              </>
            ))}
        </div >
        <ul class="pagination mt-1 justify-content-center">
          <li class="page-item">
            <a class="page-link bg-primary text-white" href="#"></a>
          </li>
        </ul>
      </div >
    </div >
  );
};

export default BookSearch;
