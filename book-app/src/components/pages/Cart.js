import { useState } from "react";
import cookie from "react-cookies";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import React from "react";
import MyContext from "../../configs/MyContext";
import { authAPI, endpoints } from "../../configs/API";
import CartContext from "../../configs/CartContext";

const Cart = () => {
  const [cart, dispatchCart] = React.useContext(CartContext);
  const [newCart, setNewCart] = React.useState([]);
  const [user] = React.useContext(MyContext);
  const [q] = useSearchParams();
  const [total, setTotal] = React.useState({
    "total_price": 0,
    "total_quantity": 0
  })
  const location = useLocation();
  const { msg } = location.state || {};
  const [Msg, setMsg] = React.useState(msg || null);
  const navigate = useNavigate();

  const loadCart = async () => {
    // let res = await authAPI(cookie.load('access_token')).get(`${endpoints['book-cart']}?user_id=${user.id}`);
    if (cart !== null) {
      let cart_data = cart;
      console.log(cart);
      if (cart_data.length > 0) {
        cart_data.map((c) => {
          let discount_price = c.book.price;
          if (c.book.promotion.length > 0) {
            c.book.promotion.forEach(p => {
              discount_price = discount_price - c.book.price * p.discount_percent / 100;
            })
          }
          c.book.discount_price = discount_price;
        })
      }
      setNewCart(cart_data);
    }
  }

  const updateReceipt = async () => {
    const vnp_Amount = q.get('vnp_Amount') || '';
    const vnp_BankCode = q.get('vnp_BankCode') || '';
    const vnp_BankTranNo = q.get('vnp_BankTranNo') || '';
    const vnp_CardType = q.get('vnp_CardType') || '';
    const vnp_OrderInfo = q.get('vnp_OrderInfo') || '';
    const vnp_PayDate = q.get('vnp_PayDate') || '';
    const vnp_ResponseCode = q.get('vnp_ResponseCode') || '';
    const vnp_TmnCode = q.get('vnp_TmnCode') || '';
    const vnp_TransactionNo = q.get('vnp_TransactionNo') || '';
    const vnp_TransactionStatus = q.get('vnp_TransactionStatus') || '';
    const vnp_TxnRef = q.get('vnp_TxnRef') || '';
    const vnp_SecureHash = q.get('vnp_SecureHash') || '';
    if (vnp_Amount === '' || vnp_ResponseCode === '') {
      return 0;
    } else {
      let res = await authAPI(cookie.load('access_token')).post(endpoints['vnpay_payment_return'], {
        "vnp_Amount": vnp_Amount,
        "vnp_BankCode": vnp_BankCode,
        "vnp_BankTranNo": vnp_BankTranNo,
        "vnp_CardType": vnp_CardType,
        "vnp_OrderInfo": vnp_OrderInfo,
        "vnp_PayDate": vnp_PayDate,
        "vnp_ResponseCode": vnp_ResponseCode,
        "vnp_TmnCode": vnp_TmnCode,
        "vnp_TransactionNo": vnp_TransactionNo,
        "vnp_TransactionStatus": vnp_TransactionStatus,
        "vnp_TxnRef": vnp_TxnRef,
        "vnp_SecureHash": vnp_SecureHash
      });
      if (res.status === 201) {
        setMsg("Thanh toán thành công");
      }
    }
  }

  const updateBooks = async (bookCartId, quantity) => {
    let res = await authAPI(cookie.load('access_token')).patch(endpoints['remove_book_cart'](bookCartId), {
      'quantity': quantity
    });
    let cart_res = await authAPI(cookie.load("access_token")).get(endpoints['book-cart']);
    dispatchCart({
      type: "update",
      payload: cart_res.data
    })
  }

  const deleteBooks = async (bookCartId) => {
    let res = await authAPI(cookie.load('access_token')).delete(endpoints['remove_book_cart'](bookCartId));
    let cart_res = await authAPI(cookie.load("access_token")).get(endpoints['book-cart']);
    dispatchCart({
      type: "update",
      payload: cart_res.data
    })
  }

  const payment = () => {
    navigate('/payment', { state: { total_amount: total.total_price } })
  }

  React.useEffect(() => {
    if (user == null && cart !== null) {
      navigate('/');
    } else {
      loadCart();
      updateReceipt();
    }
  }, [user, cart])

  React.useEffect(() => {
    if (newCart !== undefined && newCart.length > 0) {
      let total_price = 0;
      let total_quantity = 0;
      newCart.map(c => {
        total_price += c.book.discount_price * c.quantity;
        total_quantity += c.quantity;
      })
      setTotal({
        total_price,
        total_quantity
      });
    }
  }, [newCart])
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-sm-12">
            {Msg !== null &&
              <div class="alert alert-success col-10 m-auto mb-2">
                <strong>{Msg}</strong>
              </div>}
            <h1 className="text-center text-info mt-1">GIỎ HÀNG</h1>
            {newCart.length > 0 && newCart != null && (
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
                  {newCart !== null && newCart.map((c) => (
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
                      <td>{c.book.price.toLocaleString('vi-VN')}đ</td>
                      <td>{c.book.discount_price.toLocaleString('vi-VN')}đ</td>
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
                      <span className="cart-amount">{total.total_price.toLocaleString('vi-VN')}</span> VNĐ
                    </h3>
                    <h3>
                      Tổng số lượng:{" "}
                      <span className="cart-counter">{total.total_quantity}</span>
                    </h3>
                  </div>
                  <div className="col-3 text-center m-auto">
                    <button
                      className="btn btn-danger"
                      style={{ fontSize: "30px" }}
                      onClick={payment}
                    >
                      Thanh toán
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {newCart == null &&
            <div className="alert alert-info">
              KHÔNG có sản phẩm trong giỏ!
            </div>}
        </div>
      </div>
    </>
  );
};

export default Cart;
