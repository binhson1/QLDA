import logo from "./logo.svg";
import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookSearch from "./components/pages/BookSearch";
import BookDetail from "./components/pages/BookDetail";

function App() {
  const [user, dispatch] = Reactt.useReducer(MyUserReducer, null);
  const [cart, dispatchCart] = React.useReducer(MyCartReducer, null);

  return (
    <>
      <BrowserRouter>
        <MyContext.Provider value={[user, dispatch]}>
          <CartContext.Provider value={[cart, dispatchCart]}>
            <Header></Header>
            <Routes>
              <Route exact path="/" element={<Home></Home>} />
              <Route path="/books/" element={<BookSearch></BookSearch>} />
              <Route
                path="/books/:bookId"
                element={<BookDetail></BookDetail>}
              />
            </Routes>
            <Footer></Footer>
          </CartContext.Provider>
        </MyContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
