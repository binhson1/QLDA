import React from "react";
import API, { endpoints } from "../../configs/API";
import { Link, useNavigate } from "react-router-dom";
import MyContext from "../../configs/MyContext";
import Logout from "../pages/Logout";
import CartContext from "../../configs/CartContext";

const Header = () => {
  const [cates, setCates] = React.useState([]);
  const [query, setQuery] = React.useState();
  const [user] = React.useContext(MyContext);
  const [cart] = React.useContext(CartContext);

  let navigate = useNavigate();

  const loadCates = async () => {
    try {
      let res = await API.get(endpoints["category"]);
      setCates(res.data);
    } catch (ex) {
      console.error(ex);
    }
  };

  const handleSearch = () => {
    const currentParams = new URLSearchParams(window.location.search);
    if (query !== undefined) {
      if (query.trim() !== "") {
        currentParams.set("q", query.trim());
      } else {
        currentParams.delete("q");
      }
    }
    const url = `${endpoints["books"]}?${currentParams.toString()}`;
    navigate(url);
  };

  React.useEffect(() => {
    loadCates();
  }, []);

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/"}>
          NHÀ SÁCH
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className="nav-link active text-hover d-inline-block p-2"
                to={"/"}
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="collections dropdown h-100">
                <button
                  type="button"
                  className="btn dropdown-toggle text-hover text-white shadow-none outline-0 h-100 p-2"
                  data-bs-toggle="dropdown"
                  data-bs-target="category-menu"
                >
                  Thể loại
                </button>
                <ul className="dropdown-menu" id="category-menu">
                  {cates.map((cate) => (
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/books/?cate=${cate.id}`}
                      >
                        {cate.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>

          {user && cart !== null && (
            <Link className="nav-link text-danger me-3 fs-3" to="/cart">
              &#128722;{" "}
              {cart[0] !== undefined && (
                <span className="badge bg-danger cart-counter fs-6">
                  {cart[0].count}
                </span>
              )}
            </Link>
          )}

          <div className="col-auto me-2">
            <input
              className="form-control"
              placeholder="Nhập từ khóa..."
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            ></input>
          </div>
          <button className="btn btn-primary me-2" onClick={handleSearch}>
            Tìm
          </button>
          {user ? ( // đã đăng nhập hay chưa
            <div className="me-2 text-white text-decoration-none text-hover">
              <Link className="navbar-brand" to="/user">
                <img
                  src={user.avatar}
                  alt="Avatar Logo"
                  style={{ width: "40px" }}
                  className="rounded-pill"
                />
              </Link>
              <Logout></Logout>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="me-2 text-white text-decoration-none text-hover"
              >
                Đăng nhập
              </Link>
              <p className="text-white me-2 mb-0 mt-0">/</p>
              <Link
                to="/register"
                className="me-2 text-white text-decoration-none text-hover"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
