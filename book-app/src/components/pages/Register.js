import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form } from "react-bootstrap";
import API, { endpoints } from "../../configs/API";

const Register = () => {
  const fields = [{
    label: "Họ",
    type: "text",
    field: "firs_tname",
    placeholder: "Nhập họ..."
  }, {
    label: "Tên",
    type: "text",
    field: "last_name",
    placeholder: "Nhập tên..."
  }, {
    label: "Địa chỉ email",
    type: "email",
    field: "email",
    placeholder: "Nhập địa chỉ email..."
  }, {
    label: "Số Điện thoại",
    type: "tel",
    field: "phone",
    placeholder: "Nhập số điện thoại..."
  }, {
    label: "Tên đăng nhập",
    type: "text",
    field: "username",
    placeholder: "Nhập tên đăng nhập..."
  }, {
    label: "Mật khẩu",
    type: "password",
    field: "password",
    placeholder: "Nhập mật khẩu..."
  }, {
    label: "Xác nhận mật khẩu",
    type: "password",
    field: "confirm",
    placeholder: "Nhập lại mật khẩu..."
  }];

  const [user, setUser] = React.useState({
    "email": "",
    "username": "",
    "password": "",
    "confirm": "",
    "role": "2",
    "first_name": "",
    "last_name": "",
    "phone": ""
  });

  // const avatar = React.useRef();
  let navigate = useNavigate();

  const change = (field, value) => {
    setUser(current => {
      return { ...current, [field]: value }
    })
  }

  const validatePassword = () => {
    return user.password == user.confirm;
  }

  const validateRegister = async (e) => {
    e.preventDefault();
    if (validatePassword && user.username) {
      console.log("trong ham validate");
      let user_valid = false;
      let customer_valid = false;
      try {
        let res_user = await API.post(endpoints['user_valid'], {
          'email': user.email,
          'username': user.username
        });
        let res_customer = await API.post(endpoints['customer_valid'], {
          'phone': user.phone
        })
        // Tồn tại user
        if (res_user.status == 200) {
          user_valid = true;
        }
        // Tồn tại customer
        if (res_customer.status == 200) {
          customer_valid = true;
        }

        if (user_valid == true || customer_valid == true) {
          console.log("Da ton tai");
        }

        if (user_valid == false && customer_valid == false) {
          console.log("check ok");
          sessionStorage.setItem('user', JSON.stringify(user));
          navigate('/OTP');
        }
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  // const register = async (e) => {
  //   e.preventDefault();
  //   console.log("hello");
  //   let form = new FormData();
  //   for (let key in user)
  //     if (key !== 'confirm')
  //       form.append(key, user[key]);

  //   if (avatar)
  //     form.append('avatar', avatar.current.files[0]);


  //   // try {
  //   //   let res = await API.post(endpoints['register'], form, {
  //   //     headers: {
  //   //       'Content-Type': 'multipart/form-data'
  //   //     }
  //   //   });
  //   //   if (res.status === 201)
  //   //     nav("/login");
  //   // } catch (ex) {
  //   //   console.error(ex);
  //   // }
  // }

  return (
    <div className="container-fluid h-custom">
      <div className="row d-flex justify-content-center align-items-center h-100 mt-1">
        <div className="col-md-9 col-lg-6 col-xl-5">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample image"
          />
        </div>
        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">

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
            >
              <i className="fa fa-google"></i>
            </button>
          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Hoặc</p>
          </div>
          <Form onSubmit={validateRegister} className="d-flex flex-wrap justify-content-between">
            {fields.map((f) => (
              <div key={f.field} className={`form-outline mb-3 ${f.field === "firstname" || f.field === "lastname" ? 'col-6 p-1' : 'col-12'}`}>
                <label className="form-label" htmlFor={f.field}>
                  {f.label}
                </label>
                <input
                  id={f.field}
                  className="form-control form-control-md"
                  placeholder={f.placeholder}
                  name={f.field}
                  value={user[f.field]}
                  type={f.type}
                  onChange={(e) => change(f.field, e.target.value)}
                />
              </div>
            ))}
            <div className="col-12 text-center text-lg-start mt-4 pt-2 d-flex justify-content-between">
              <p className="small fw-bold mt-2 pt-1 mb-0">
                Bạn đã có tài khoản?{" "}
                <Link to="/login" className="link-danger">
                  Đăng nhập
                </Link>
              </p>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ paddingleft: "2.5rem", paddingright: "2.5rem" }}
              >
                Đăng ký
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div >
  );
};

export default Register;
