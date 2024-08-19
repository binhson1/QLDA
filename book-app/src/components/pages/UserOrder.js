import { useContext, useEffect, useState } from "react";
import { authAPI, endpoints } from "../../configs/API";
import cookie from "react-cookies";

const UserOrder = () => {
  const [receipt, setReceipt] = useState([]);

  const loadReceipt = async () => {
    try {
      let res = await authAPI(cookie.load("access_token")).get(
        endpoints["receipt"]
      );
      setReceipt(res.data);
      console.log(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  useEffect(() => {
    loadReceipt();
  }, []);

  return (
    <div className="container mt-4">
      <div className="text-center">
        <h2>QUẢN LÝ ĐƠN HÀNG NGƯỜI DÙNG</h2>
      </div>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Địa chỉ</th>
            <th scope="col">Tổng số tiền</th>
          </tr>
        </thead>
        <tbody>
          {receipt != undefined &&
            receipt.map((receipt) => (
              <tr key={receipt.id}>
                <td>{receipt.address}</td>
                <td>{receipt.total_price} VNĐ</td>{" "}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrder;
