import axios from "axios";
import cookie from "react-cookies";
const HOST = "http://127.0.0.1:8000";

export const endpoints = {
  books: "/books/",
  category: "/category/",
  user_valid: "/user/is_valid/",
  customer_valid: "/customer/is_valid/",
  send_mail: "/send_mail/",
  user: "/user/",
  login: "/o/token/",
  "current-user": "/user/current-user/",
  "book-cart": "/cart/books/",
  "add-cart": (bookId) => `/books/${bookId}/add_cart/`,
  remove_book_cart: (bookId) => `/book_cart/${bookId}/`,
};

export const authAPI = (accessToken) =>
  axios.create({
    baseURL: HOST,
    headers: {
      Authorization: `Bearer ${
        accessToken ? accessToken : cookie.load("access-token")
      }`,
    },
  });

export default axios.create({
  baseURL: HOST,
  header: {
    "Content-Type": "application/json",
  },
});
