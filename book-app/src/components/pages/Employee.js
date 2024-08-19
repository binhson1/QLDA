import React, { useEffect } from "react";
import { useState } from "react";
import API, { authAPI, endpoints } from "../../configs/API";
import cookie from "react-cookies";
import MyContext from "../../configs/MyContext";
import CartContext from "../../configs/CartContext";

const Employee = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [, dispatch] = React.useContext(MyContext);
  const [cart, dispatchCart] = React.useContext(CartContext);
  const [newCart, setNewCart] = React.useState([]);
  const [user] = React.useContext(MyContext);
  const [total, setTotal] = React.useState({
    total_price: 0,
    total_quantity: 0,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let res = await API.post(
        endpoints["login"],
        {
          username: username,
          password: password,
          client_id: "t9rkxBTnZrPI4eS5ocYZ70Ie35n4mYBhWKWSxWFf",
          client_secret:
            "D9PQ38Usjnh4vheVbzdHQDMPAjB4Q3KD4cRhcSlAb7TCslWAW44H5nUMe1Et1ki91XYz8YSZ5ejPXzdywiDkQINQBIMqeGOgrISbCrBpDNwck6pZdZomlulS2WstCXbv",
          grant_type: "password",
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      let res_employee = await authAPI(res.data.access_token).get(
        endpoints["current-employee"]
      );
      dispatch({
        type: "login",
        payload: res_employee.data,
      });
      await cookie.save("employee", res_employee.data);
      await cookie.save("employee_access_token", res.data.access_token);
    } catch (error) {
      //   setMessage(error.res_employee.data.message);
      console.log(error.res_employee);
    }
  };

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchAllBooks = async () => {
      let allBooks = [];
      let nextPageUrl = "/books/";

      while (nextPageUrl) {
        try {
          const response = await API.get(nextPageUrl);
          const data = response.data;
          allBooks = allBooks.concat(data.results);
          nextPageUrl = data.next;
        } catch (error) {
          console.error("loi load book!", error);
          nextPageUrl = null;
        }
      }

      setBooks(allBooks);
    };

    fetchAllBooks();
  }, []);

  const addToCart = async (bookId, quantity) => {
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

  const loadCart = async () => {
    // let res = await authAPI(cookie.load('access_token')).get(`${endpoints['book-cart']}?user_id=${user.id}`);
    if (cart !== null) {
      let cart_data = cart;
      console.log(cart);
      if (cart_data.length > 0) {
        cart_data.map((c) => {
          let discount_price = c.book.price;
          if (c.book.promotion.length > 0) {
            c.book.promotion.forEach((p) => {
              discount_price =
                discount_price - (c.book.price * p.discount_percent) / 100;
            });
          }
          c.book.discount_price = discount_price;
        });
      }
      setNewCart(cart_data);
    }
  };

  const updateBooks = async (bookCartId, quantity) => {
    let res = await authAPI(cookie.load("access_token")).patch(
      endpoints["remove_book_cart"](bookCartId),
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

  const deleteBooks = async (bookCartId) => {
    let res = await authAPI(cookie.load("access_token")).delete(
      endpoints["remove_book_cart"](bookCartId)
    );
    let cart_res = await authAPI(cookie.load("access_token")).get(
      endpoints["book-cart"]
    );
    dispatchCart({
      type: "update",
      payload: cart_res.data,
    });
  };
  return user ? (
    <div className="container" style={{ margin: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Danh sách sản phẩm</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              backgroundColor: "#f4f4f4",
              borderBottom: "2px solid #ddd",
            }}
          >
            <th style={{ padding: "10px", textAlign: "left" }}>Tên</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Giá</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Hình ảnh</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Số lượng còn</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Thêm vào giỏ</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{book.title}</td>
              <td style={{ padding: "10px" }}>{book.price.toFixed(0)} VND</td>
              <td style={{ padding: "10px" }}>
                <img src={book.image} alt={book.title} width="50" />
              </td>
              <td style={{ padding: "10px" }}>{book.stock_quantity}</td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => addToCart(book.id, 1)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Thêm vào
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <>
        <table className="table">
          <tr>
            <th></th>
            <th>Tên sản phẩm</th>
            <th>Giá gốc</th>
            <th>Đơn giá</th>
            <th>Kho còn lại</th>
            <th>Số lượng</th>
            <th></th>
          </tr>
          {newCart !== null &&
            newCart.map((c) => (
              <tr
                key={c.id}
                id={`product${c.book.id}`}
                className="align-middle"
              >
                <td>
                  <img
                    src={c.book.image}
                    alt=""
                    style={{ width: "100px", height: "100px" }}
                  />
                </td>
                <td>{c.book.title}</td>
                <td>{c.book.price}đ</td>
                <td>{c.book.discount_price}đ</td>
                <td>{c.book.stock_quantity}</td>
                <td>
                  <input
                    type="number"
                    onBlur={(e) => updateBooks(c.id, e.target.value)}
                    defaultValue={c.quantity}
                    className="form-control"
                    style={{ width: "50px" }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteBooks(c.id)}
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
        </table>
        <div className="row alert alert-info">
          <div className=" col-9">
            <h3>
              Tổng tiền:{" "}
              <span className="cart-amount">{total.total_price}</span> VNĐ
            </h3>
            <h3>
              Tổng số lượng:{" "}
              <span className="cart-counter">{total.total_quantity}</span>
            </h3>
          </div>
          <div className="col-3 text-center m-auto">
            <button className="btn btn-danger" style={{ fontSize: "30px" }}>
              Thanh toán
            </button>
          </div>
        </div>
      </>
    </div>
  ) : (
    <div className="login-container">
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "1em",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ marginBottom: "1em" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5em",
              fontWeight: "bold",
            }}
          >
            Tài khoản nhân viên
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5em",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5em",
              fontWeight: "bold",
            }}
          >
            Mật khẩu
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "0.5em",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.75em",
            border: "none",
            borderRadius: "4px",
            background: "#007BFF",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>
        {message && <p style={{ marginTop: "1em", color: "red" }}>{message}</p>}
      </form>
    </div>
  );
};

export default Employee;
