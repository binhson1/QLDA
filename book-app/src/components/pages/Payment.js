import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { authAPI, endpoints } from "../../configs/API";
import cookie from "react-cookies"
import axios from "axios";
import CartContext from "../../configs/CartContext";

const Payment = () => {
  const navigate = useNavigate();
  const [, dispatchCart] = React.useContext(CartContext);
  const [orderId, setOrderID] = React.useState(null);
  const location = useLocation();
  const { total_amount } = location.state || {};
  const [paymentMethod, setPaymentMethod] = React.useState('tienmat');
  const [address, setAdress] = React.useState(null);
  const [orderDesc, setOrderDesc] = React.useState("Thanh toán đơn hàng:");
  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const payment = async (e) => {
    e.preventDefault();

    if (paymentMethod === 'tienmat') {
      let res = await authAPI(cookie.load('access_token')).post(endpoints['receipt'], {
        "order_id": orderId,
        "address": address,
        "method": 1
      })
      let cart_res = await authAPI(cookie.load("access_token")).get(endpoints['book-cart']);
      dispatchCart({
        type: "update",
        payload: cart_res.data
      })
      if (res.status === 201) {
        navigate('/cart', { state: { msg: 'Đặt đơn hàng thành công' } });
      }
    } else if (paymentMethod === 'vnpay') {
      let res_1 = await authAPI(cookie.load('access_token')).post(endpoints['receipt'], {
        "order_id": orderId,
        "address": address,
        "method": 2
      });

      let data = await axios.get('https://api.ipify.org?format=json');
      console.log(data.data.ip);
      let ipaddr = data.data.ip;
      let res = await authAPI(cookie.load('access_token')).post(endpoints['vnpay_payment'], {
        "order_type": 'billpayment',
        "order_id": orderId,
        "amount": total_amount,
        "order_desc": orderDesc,
        "ipaddr": ipaddr
      });
      window.location.href = res.data.url;
    }
  }

  React.useEffect(() => {
    setOrderID(uuidv4());
  }, []);

  return (
    <div className="container">
      <form onSubmit={payment} className="mt-3">
        <div class="mb-3 form-group">
          <label for="order_id">Mã hóa đơn</label>
          <input class="form-control" id="order_id" name="order_id" type="text" value={orderId} readonly />
        </div>
        <div class="form-group mt-2">
          <label for="amount">Số tiền</label>
          <input class="form-control" id="amount" name="amount" type="text"
            value={total_amount.toLocaleString('vi-VN')} readonly />
        </div>
        <div class="form-group mt-2">
          <label for="order_desc">Nội dung thanh toán</label>
          <textarea onChange={(e) => setOrderDesc(e.target.value)} class="form-control" cols="20" id="order_desc" name="order_desc" rows="2" readonly>{orderDesc}</textarea>
        </div>
        <div className="mb-3 form-group">
          <label for="pwd" className="form-label">
            Địa chỉ
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Nhập địa chỉ"
            name="address"
            value={address}
            onChange={(e) => setAdress(e.target.value)}
          />
        </div>
        <div className="mb-3 form-group">
          <label for="payment_method">Phương Thức Thanh Toán: </label>
          <select
            className="form-select"
            id="payment_method"
            name="phuongthucthanhtoan"
            required
            onChange={handlePaymentMethodChange}
          >
            <option value="tienmat">Thanh toán tiền mặt</option>
            <option value="vnpay">Thanh toán qua VNPAY</option>
          </select>
        </div>
        <div className="text-end">
          <button
            type="submit"
            className="btn btn-danger"
            style={{ fontSize: "25px" }}
          >
            Thanh toán
          </button>
        </div>
      </form>
    </div>
  );
};

export default Payment;
