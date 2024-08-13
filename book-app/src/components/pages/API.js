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
  "current-employee": "user/current-employee",
  "book-cart": "/cart/books/",
  "add-cart": (bookId) => `/books/${bookId}/add_cart/`,
  remove_book_cart: (bookId) => `/book_cart/${bookId}/`,
  receipt: "/receipt/",
  vnpay_payment: "/vnpay_payment/",
  vnpay_payment_return: "/vnpay_payment_return/",
  google_login: "/google-login/",
  google_callback: "/google/login/callback/",
  "add-comment": `/comment/`,
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
