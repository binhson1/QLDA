import React from "react";
import API from "../../configs/API";
import { endpoints } from "../../configs/API";
import Carousel from "../layout/Carousel";
import BookCard from "../layout/BookCard";
import MyContext from "../../configs/MyContext";

const Home = () => {
  const [books, setBooks] = React.useState([]);
  const [cates, setCates] = React.useState([]);
  const loadCates = async () => {
    try {
      let res = await API.get(endpoints["category"]);
      setCates(res.data);
    } catch (ex) {
      console.error(ex);
    }
  }

  const loadBooks = async () => {
    try {
      if (cates.length > 0) {
        let Books = [];
        for (let cate of cates) {
          let res = await API.get(`${endpoints["books"]}?cate=${cate.id}`);
          let book_cate = res.data.results;
          Books.push(...book_cate);
        }
        setBooks(Books);
      }
    } catch (ex) {
      console.error(ex);
    }
  };

  React.useEffect(() => {
    loadCates();
  }, []);

  React.useEffect(() => {
    loadBooks();
  }, [cates])

  return (
    <div>
      <Carousel></Carousel>
      {cates.length > 0 &&
        cates.map((c) => (
          <div key={c.id} className="container-fluid d-flex align-items-center flex-column mt-3">
            <h3>{c.name}</h3>
            <section>
              {books.length > 0 && books.map((book) => {
                if (book.categories.some(category => category.id === c.id)) {
                  return <BookCard key={book.id} book={book} />;
                }
              })}
            </section>
          </div>
        ))
      }
    </div>
  );
};

export default Home;
