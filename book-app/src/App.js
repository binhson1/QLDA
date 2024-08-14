import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookSearch from "./components/pages/BookSearch";
import BookDetail from "./components/pages/BookDetail";
import MyUserReducer from "./reducers/MyUserReducer";

function App() {
  const [user, dispatch] = React.useReducer(MyUserReducer, null);
  React.useEffect(() => {
    if (cookie.load("user") != null) {
      dispatch({
        type: "login",
        payload: cookie.load("user"),
      });
    }
  }, []);
  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={[user, dispatch]}>
          <Header></Header>
          <Routes>
            <Route exact path="/" element={<Home></Home>} />
            <Route path="/books/" element={<BookSearch></BookSearch>} />
            <Route
              path="/books/:bookId"
              element={<BookDetail></BookDetail>}
            />
            <Route path="/login/" element={<Login></Login>} />
            <Route path="/register/" element={<Register></Register>} />
            <Route path="/OTP/" element={<OTP></OTP>} />
            <Route path="/pickAvatar/" element={<PickAvatar></PickAvatar>} />
          </Routes>
          <Footer></Footer>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
