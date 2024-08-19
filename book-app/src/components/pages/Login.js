import React from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import API, { authAPI, endpoints } from "../../configs/API";
import cookie from 'react-cookies'
import MyContext from "../../configs/MyContext";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../configs/firebase";
import { Form } from "react-bootstrap";
const Login = () => {
  const [user, setUser] = React.useState({
    "username": "",
    "password": ""
  })
  const fields = [{
    label: "Tên tài khoản",
    type: "text",
    field: "username",
    placeholder: "Nhập tên tài khoản..."
  }, {
    label: "Mật khẩu",
    type: "password",
    field: "password",
    placeholder: "Nhập mật khẩu..."
  }];

  const [q] = useSearchParams();

  const location = useLocation();
  const { msg } = location.state || {};
  const [Msg, setMsg] = React.useState(msg);
  const navigate = useNavigate();
  const [, dispatch] = React.useContext(MyContext);


  const change = (field, value) => {
    setUser(current => {
      return { ...current, [field]: value }
    })
  }

  const login = async (e) => {
    e.preventDefault();
    try {
      let res = await API.post(endpoints['login'], {
        'username': user.username,
        'password': user.password,
        'client_id': "t9rkxBTnZrPI4eS5ocYZ70Ie35n4mYBhWKWSxWFf",
        'client_secret': "D9PQ38Usjnh4vheVbzdHQDMPAjB4Q3KD4cRhcSlAb7TCslWAW44H5nUMe1Et1ki91XYz8YSZ5ejPXzdywiDkQINQBIMqeGOgrISbCrBpDNwck6pZdZomlulS2WstCXbv",
        "grant_type": "password"
      }, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      let res_user = await authAPI(res.data.access_token).get(endpoints['current-user']);
      let sign_in = await signInWithEmailAndPassword(auth, res_user.data.email, user.password);
      res_user.data.uid = sign_in.user.uid;

      dispatch({
        "type": "login",
        "payload": res_user.data
      });
      await cookie.save("user", res_user.data);
      await cookie.save("access_token", res.data.access_token);
      navigate('/');
    } catch (ex) {
      console.error(ex);
    }
  }

  const googleLogin = async () => {
    let res = await API.post(endpoints['google_login']);
    window.location.href = res.data.url;
  }

  const getUserInfo = async (created) => {
    if (created === "False") {
      console.log("ok");
      let res_user = await authAPI(q.get('access_token')).get(endpoints['current-user']);
      dispatch({
        "type": "login",
        "payload": res_user.data
      });
      await cookie.save("user", res_user.data);
      await cookie.save("access_token", q.get('access_token'));
      navigate('/');
    } else if (created === "True") {
      console.log("hello");
      setMsg(q.get('msg'));
    }
  }

  React.useEffect(() => {
    const created = q.get('created') || '';
    if (created !== '') {
      getUserInfo(created);
    }
  }, []);

  return (
    <section className="vh-100 mt-4">
      {msg &&
        <div class="alert alert-success col-10 m-auto mb-2">
          <strong>{Msg}</strong>
        </div>}
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <Form onSubmit={login}>
              <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                <p className="lead fw-normal mb-0 me-3">Đăng nhập bằng</p>
                <button
                  type="button"
                  className="btn btn-primary btn-floating mx-1 rounded-circle"
                  style={{ width: "40px;" }}
                >
                  <i className="fa fa-facebook-f"></i>
                </button>

                <button
                  type="button"
                  className="btn btn-danger btn-floating mx-1 rounded-circle"
                  style={{ width: "40px;" }}
                  onClick={googleLogin}
                >
                  <i className="fa fa-google"></i>
                </button>
              </div>

              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0">Hoặc</p>
              </div>

              {fields.map((field) => (
                <div className="form-outline mb-4">
                  <label className="form-label" for={field.field}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.field}
                    className="form-control form-control-lg"
                    placeholder={field.placeholder}
                    name={field.field}
                    value={user[field.field]}
                    onChange={(e) => { change(field.field, e.target.value) }}
                  />
                </div>
              ))}

              <div className="d-flex justify-content-between align-items-center">
                {/* <!-- Checkbox --> */}
                <div className="form-check mb-0">
                  <input
                    className="form-check-input me-2"
                    type="checkbox"
                    value=""
                    id="form2Example3"
                  />
                  <label className="form-check-label" for="form2Example3">
                    Lưu thông tin đăng nhập
                  </label>
                </div>
                <a href="/forgotpass" className="text-body">
                  Quên mật khẩu?
                </a>
              </div>

              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ paddingleft: "2.5rem", paddingright: "2.5rem" }}
                >
                  Đăng nhập
                </button>
                <p className="small fw-bold mt-2 pt-1 mb-0">
                  Bạn chưa có tài khoản?{" "}
                  <Link to="/register" className="link-danger">
                    Đăng ký
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
