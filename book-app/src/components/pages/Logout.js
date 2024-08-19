import React from "react";
import MyContext from "../../configs/MyContext";
import cookie from 'react-cookies'
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const [, dispatch] = React.useContext(MyContext);
    const navigate = useNavigate();
    const logout = async () => {
        cookie.remove("user", { path: '/' });
        cookie.remove("access_token", { path: '/' });
        cookie.remove("uid", { path: '/' });
        dispatch({
            "type": "logout"
        });
        navigate('/');
    }

    return (
        <button className="btn btn-md btn-danger" onClick={logout}>Đăng xuất</button>
    )
}

export default Logout;