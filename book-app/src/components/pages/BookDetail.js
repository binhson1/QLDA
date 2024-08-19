import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API, { authAPI, endpoints } from "../../configs/API";
import MyContext from "../../configs/MyContext";
import cookie from "react-cookies";
import CartContext from "../../configs/CartContext";

const BookDetail = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { bookId } = useParams();
  const [book, setBook] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [user] = React.useContext(MyContext);
  const [quantity, setQuantity] = React.useState(1);
  const navigate = useNavigate();
  const [, dispatchCart] = React.useContext(CartContext);
  const [content, setContent] = useState("");

  const loadBook = async () => {
    try {
      let res = await API.get(`${endpoints["books"]}${bookId}/`);
      let book_data = res.data;
      if (book_data.promotion.length > 0) {
        let discount_price = book_data.price;
        book_data.promotion.forEach((p) => {
          discount_price =
            discount_price - (book_data.price * p.discount_percent) / 100;
        });
        book_data.discount_price = discount_price;
      }
      setBook(book_data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      let res = await authAPI(cookie.load("access_token")).post(
        endpoints["add-comment"],
        {
          book: bookId,
          content: content,
        }
      );
      if (res.status === 201) {
        setSuccess("Đăng bình luận thành công!");
        setContent("");
      }
      if (res.status === 403) {
        setError("Bạn phải mua hàng thì mới được bình luận.");
        console.log(res.status);
      }
    } catch (err) {
      if (err) {
        // setError("Lỗi vui lòng thử lại sau !");
        console.log(err.status);
      }
    }
  };

  const loadComments = async () => {
    try {
      let res = await API.get(`${endpoints["books"]}${bookId}/comments/`);
      setComments(res.data);
      console.log(comments);
    } catch (ex) {
      console.error(ex);
    }
  };

  const addToCart = async () => {
    let res = await authAPI(cookie.load("access_token")).post(
      endpoints["add-cart"](bookId),
      {
        quantity: quantity,
      }
    );
    let cart_res = await authAPI(cookie.load("access_token")).get(
      endpoints["book-cart"]
    );
    dispatchCart({
      type: "update",
      payload: cart_res.data,
    });
  };

  React.useEffect(() => {
    loadBook();
  }, [bookId]);

  React.useEffect(() => {
    loadComments();
  }, [book]);

  if (!book) {
    return <div>Loading ....</div>;
  }

  return (
    <div className="row mt-4 justify-content-between container m-auto">
      <div className="col-md-3 col-sm-12 ms-4">
        <img
          src={book.image}
          alt={book.name}
          style={{ width: "100%", height: "410px" }}
        />
      </div>
      <div className="col-md-8 col-sm-12">
        <h1 className="text-center m-2">{book.title}</h1>
        <p>
          {book.comment_count} đánh giá | Đã bán: {book.sold_quantity}
        </p>
        <hr />
        <h3 className="text-danger">
          {" "}
          {book.discount_price.toLocaleString("vi-VN")}đ{" "}
          <span className="text-body-tertiary text-decoration-line-through">
            {book.price.toLocaleString("vi-VN")}đ
          </span>
        </h3>
        <hr />
        <div className="row">
          <ul className="col-md-5 col-sm-12 ms-3">
            <li>Mã sách: {book.id}</li>
            <li>Tác giả: {book.author.full_name}</li>
            <li>
              Thể loại:
              {book.categories.map((c) => (
                <span key={c.id}> {c.name} </span>
              ))}
            </li>
            <li>Nhà xuất bản: {book.publisher.name} </li>
            <li>Kho còn lại: {book.stock_quantity} </li>
          </ul>

          <div className="col-md-6 col-sm-12">
            {book.stock_quantity >= 0 ? (
              <div>
                <h3>Số lượng</h3>
                <input
                  type="number"
                  min="1"
                  max={`${book.stock_quantity}`}
                  className="text-center d-block mb-3"
                  id="soluong"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <button
                  className="btn bg-danger text-white rounded-2 d-block w-100 mb-2"
                  onClick={addToCart}
                >
                  THÊM VÀO GIỎ HÀNG
                </button>
                <button
                  className="btn bg-danger text-white rounded-2 d-block w-50"
                  onclick={addToCart}
                >
                  MUA NGAY
                </button>
              </div>
            ) : (
              <div>
                <button className="btn bg-danger text-white rounded-2 d-block w-100">
                  TẠM HẾT HÀNG
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="row ms-md-4 mt-4">
        <hr className="mb-2" />
        <h3>Mô tả - đánh giá</h3>
        <div dangerouslySetInnerHTML={{ __html: book.description }} />
        <hr className="mt-2" />
      </div>
      <div className="row ms-md-4 mt-4">
        <h3>Bình luận</h3>
        <form onSubmit={addComment}>
          <div>
            <textarea
              value={content}
              className="w-100 p-2"
              style={{ resize: "none" }}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              placeholder="Viết nội dung đánh giá của bạn"
              name="binhluan"
              id="binhluan"
            ></textarea>
            <div className="text-end">
              {user ? (
                <>
                  <button className="btn btn-primary" type="submit">
                    Đánh giá
                  </button>
                  {error && <p style={{ color: "red" }}>{error}</p>}
                  {success && <p style={{ color: "green" }}>{success}</p>}
                </>
              ) : (
                <Link className="btn btn-primary" to={"/login"}>
                  Đăng nhập để đánh giá
                </Link>
              )}
            </div>
          </div>
        </form>
        <hr className="mt-2" />
      </div>
      {comments !== undefined &&
        comments.length > 0 &&
        comments.map((com) => (
          <div
            className="comment"
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #eee",
              borderRadius: "5px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3
              style={{ marginBottom: "10px", color: "#333", fontSize: "18px" }}
            >
              {com.customer.username}
            </h3>
            <p
              className="date"
              style={{ marginBottom: "10px", color: "#999", fontSize: "14px" }}
            >
              {com.created_date}
            </p>
            <p
              style={{ marginBottom: "10px", color: "#555", fontSize: "16px" }}
            >
              {com.content}
            </p>
            <hr style={{ border: "0", borderTop: "1px solid #eee" }} />
          </div>
        ))}
    </div>
  );
};

export default BookDetail;
