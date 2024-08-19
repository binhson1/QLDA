import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookSearch from "./components/pages/BookSearch";
import BookDetail from "./components/pages/BookDetail";
import MyUserReducer from "./reducers/MyUserReducer";
import cookie from "react-cookies";
import MyContext from "./configs/MyContext";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import OTP from "./components/pages/OTP";
import PickAvatar from "./components/pages/PickAvatar";
import Cart from "./components/pages/Cart";
import MyCartReducer from "./reducers/MyCartReducer";
import CartContext from "./configs/CartContext";
import { authAPI, endpoints } from "./configs/API";
import UserOrder from "./components/pages/UserOrder";
import Employee from "./components/pages/Employee";
import User from "./components/pages/User";
import Chat from "./components/pages/Chat";
function App() {
  const [user, dispatch] = React.useReducer(MyUserReducer, null);
  const [cart, dispatchCart] = React.useReducer(MyCartReducer, null);

  const getBookCart = async () => {
    let res = await authAPI(cookie.load("access_token")).get(
      endpoints["book-cart"]
    );
    dispatchCart({
      type: "update",
      payload: res.data,
    });
  };

  React.useEffect(() => {
    if (cookie.load("user") != null) {
      dispatch({
        type: "login",
        payload: cookie.load("user"),
      });
    }
  }, []);

  React.useEffect(() => {
    if (user !== null) {
      getBookCart();
    }
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={[user, dispatch]}>
          <CartContext.Provider value={[cart, dispatchCart]}>
            <Header></Header>
            <Routes>
              <Route exact path="/" element={<Home></Home>} />
              <Route path="/cart/" element={<Cart></Cart>} />
              <Route path="/books/" element={<BookSearch></BookSearch>} />
              <Route
                path="/books/:bookId"
                element={<BookDetail></BookDetail>}
              />
              <Route path="/user-orders" element={<UserOrder />} />
              <Route path="/login/" element={<Login></Login>} />
              <Route path="/register/" element={<Register></Register>} />
              <Route path="/OTP/" element={<OTP></OTP>} />
              <Route path="/pickAvatar/" element={<PickAvatar></PickAvatar>} />
              <Route path="/employee/" element={<Employee />} />
              <Route path="/user" element={<User></User>} />
              <Route path="/chat/" element={<Chat></Chat>} />
            </Routes>
            <Footer></Footer>
          </CartContext.Provider>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
