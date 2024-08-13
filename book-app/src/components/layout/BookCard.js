import { Link } from "react-router-dom";
import cookie from "react-cookies";
import { useContext } from "react";
import React from "react";
import MyContext from "../../configs/MyContext";
import { authAPI, endpoints } from "../../configs/API";
import CartContext from "../../configs/CartContext";

const BookCard = ({ book }) => {
  const [user] = React.useContext(MyContext);
  const [discountPrice, setDiscountPrice] = React.useState(book.price);
  const [, dispatchCart] = React.useContext(CartContext);

  const addToCart = async (bookId, quantity) => {
    let res = await authAPI(cookie.load('access_token')).post(endpoints['add-cart'](bookId), {
      "quantity": quantity
    })
    let cart_res = await authAPI(cookie.load("access_token")).get(endpoints['book-cart']);
    dispatchCart({
      type: "update",
      payload: cart_res.data
    })
  }

  React.useEffect(() => {
    if (book.promotion.length > 0) {
      let discount_price = book.price;
      book.promotion.forEach((p) => {
        discount_price = discount_price - book.price * p.discount_percent / 100;
      })
      setDiscountPrice(discount_price);
    }
  }, []);

  return (
    <div className="col-xs-12 col-md mt-4">
      <div
        className="card m-auto"
        style={{ width: "192px", position: "relative" }}
      >
        <Link to={`/books/${book.id}/`} className="text-decoration-none">
          <img
            className="card-img-top"
            src={book.image}
            alt="Card image"
            style={{ height: "271px" }}
          />
        </Link>

        <div className="card-body p-2">
          <Link
            to={`/books/${book.id}/`}
            className="text-decoration-none"
            style={{ cursor: "pointer" }}
          >
            {book.title}
          </Link>

          <div className="d-flex justify-content-between">
            <div>
              <p
                className="card-text text-danger m-0"
                style={{ cursor: "pointer" }}
              >
                {discountPrice.toLocaleString('vi-VN')}đ
              </p>
              <p
                className="card-text text-body-tertiary text-decoration-line-through m-0"
                style={{ cursor: "pointer" }}
              >
                {book.price.toLocaleString('vi-VN')}đ
              </p>
            </div>
            {user ? (
              book.stock_quantity > 0 ? (
                <div
                  className="ms-5 text-dark al"
                  onClick={() => addToCart(book.id, 1)}
                >
                  <i
                    className="m-1 fa fa-shopping-cart text-hover"
                    style={{ fontSize: "24px", cursor: "pointer" }}
                  ></i>
                </div>
              ) : (
                <div
                  style={{
                    color: "red",
                    fontStyle: "italic",
                    fontSize: "15px",
                  }}
                  className="m-100"
                >
                  Tạm Hết Hàng
                </div>
              )
            ) : (
              <></>
            )}

            {/* {book.stock_quantity > 0 ? (
              <div
                className="ms-5 text-dark al"
                onClick={() => addToCart(book)}
              >
                <i
                  className="m-1 fa fa-shopping-cart text-hover"
                  style={{ fontSize: "24px", cursor: "pointer" }}
                ></i>
              </div>
            ) : (
              <div
                style={{
                  color: "red",
                  fontStyle: "italic",
                  fontSize: "15px",
                }}
                className="m-100"
              >
                Tạm Hết Hàng
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
