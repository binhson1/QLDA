import API, { authAPI, endpoints } from "../../configs/API";
import React from "react";
import cookie from 'react-cookies'
import MyContext from "../../configs/MyContext";

const User = () => {
  const fields = [{
    label: "Tên tài khoản",
    type: "text",
    field: "username",
    placeholder: "Nhập tên tài khoản..."
  }, {
    label: "Họ",
    type: "text",
    field: "firstname",
    placeholder: "Nhập họ..."
  }, {
    label: "Tên",
    type: "text",
    field: "lastname",
    placeholder: "Nhập tên..."
  }, {
    label: "Điện thoại",
    type: "tel",
    field: "phone",
    placeholder: "Nhập số điện thoại..."
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
  }]

  const [user] = React.useContext(MyContext);

  const [newUser, setNewUser] = React.useState({
    "phone": "",
    "avatar": "",
    "password": "",
    "confirm": "",
    "firstname": "",
    "lastname": ""
  });
  const avatar = React.useRef();
  const [selectedImage, setSelectedImage] = React.useState(null);

  // try {
  //   const updateUserInfo = async () => {
  //     let res = await authAPI(cookie.load("access_token")).patch(endpoints["update_user"], {
  //       password: newUser.password,
  //       username: newUser.username,
  //       avatar: avatar.current.files[0],
  //       phone_numbers: newUser.phone,
  //     });
  //   };
  // } catch (ex) {
  //   console.error(ex);
  // }

  const change = (field, value) => {
    setNewUser((current) => {
      return { ...current, [field]: value };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  React.useEffect(() => {
    if (user !== null && user !== undefined) {
      setSelectedImage(user.avatar);
      console.log(user);
      setNewUser((current) => {
        return {
          ...current,
          "firstname": user.first_name,
          "lastname": user.last_name
        };
      });
    }
  }, [user])
  return (
    <form onSubmit={null} method="patch">
      <div
        className="container rounded bg-white mt-5 mb-5"
        style={{ background: "rgb(99, 39, 120)" }}
      >
        <div className="row">
          <div className="col-md-3 border-right">
            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
              <img
                className="rounded-circle mt-5"
                src={selectedImage}
                style={{ cursor: "pointer", width: "150px", height: "150px", borderRadius: "50%" }}
                onClick={null}
              />
              <span className="font-weight-bold">{user.username}</span>
              <span className="text-black-50">{user.email}</span>
              <input
                type="file"
                id="imageInput"
                accept=".png,.jpg"
                className="btn btn-md btn-primary form-control"
                placeholder="Đổi avatar"
                ref={avatar}
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="col-md-5 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Thông tin người dùng</h4>
              </div>
              <div className="d-flex flex-wrap">
                {fields.map((f) => (
                  <div className={`${(f.field == "firstname" || f.field == "lastname") ? "col-md-6 p-1" : "col-md-12"}`}>
                    <label className="form-label">{f.label}</label>
                    <input
                      type={f.type}
                      className="form-control"
                      placeholder={f.placeholder}
                      value={f.field === "username" ? user.username : newUser[f.field]}
                      onChange={(e) => change(f.field, e.target.value)}
                      disabled={f.field === "username"}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 text-center">
                <button
                  className="btn btn-primary profile-button"
                  type="submit"
                >
                  Lưu thông tin
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center experience">
                <span>
                  <h4>Lịch sử mua hàng</h4>
                </span>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default User;
