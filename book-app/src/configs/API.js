import axios from "axios";
import cookie from "react-cookies";
const HOST = "http://127.0.0.1:8000";

export const endpoints = {
  "books": "/books/",
  "category": "/category/"
};

export default axios.create({
  baseURL: HOST,
  header: {
    "Content-Type": "application/json",
  },
});
