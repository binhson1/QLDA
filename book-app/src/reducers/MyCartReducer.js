import cookie from "react-cookies";
import API, { authAPI, endpoints } from "../configs/API";

const getBookCart = async () => {
  let res = await authAPI(cookie.load("access_token")).get(
    endpoints["book-cart"]
  );
  return res.data;
};

const MyCartReducer = (currentState, action) => {
  switch (action.type) {
    case "update":
      return action.payload;
  }
  return currentState;
};

export default MyCartReducer;
