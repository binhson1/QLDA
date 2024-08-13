
import React from "react";

const Footer = () => {
  return (
    <footer id="footer" className="mt-3">
      <hr />
      <div className="ft-content container d-flex">
        <div className="container d-flex">
          <div className="inner d-flex flex-column">
            <div className="d-flex justify-content-between row">
              <div className="col-md-3 col-sm-12">
                <div className="ft-nav">
                  <h4>Dịch vụ</h4>
                  <ul className="list-unstyled">
                    <li>
                      <a href="" className="text-decoration-none text-dark text-hover">Điều khoản sử dụng</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none text-dark text-hover">Chính sách bảo mật</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none text-dark text-hover">Liên hệ</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none text-dark text-hover">Hệ thống nhà sách</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none text-dark text-hover">Tra cứu đơn hàng</a>
                    </li>

                  </ul>
                </div>
              </div>


              <div className="col-md-3 col-sm-12">
                <div className="ft-nav">
                  <h4>Hỗ trợ</h4>
                  <ul className="list-unstyled">

                    <li>
                      <a href="" className="text-decoration-none">Hướng dẫn đặt hàng</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none">Chính sách đổi trả - hoàn tiền</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none">Phương thức vận chuyển</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none">Phương thức thanh toán</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none">Chính sách khách hàng mua sỉ</a>
                    </li>

                    <li>
                      <a href="" className="text-decoration-none">Chính sách khách hàng cho
                        trường học</a>
                    </li>

                  </ul>
                </div>
              </div>

              <div className="col-md-3 col-sm-12">
                <div className="ft-contact">
                  <h4>Nhà sách Kim Cương</h4>
                  <div className="ft-contact-desc">
                    Tổng Giám đốc: Ông Đỗ Gia Huy
                  </div>
                  <div className="ft-contact-address">
                    Địa chỉ: Số 55 Quang Trung, Nguyễn Du, Hai Bà Trưng, Hà Nội
                  </div>
                  <div className="ft-contact-tel">
                    Số điện thoại: <a href="tel:(+84) 932608894" className="text-decoration-none">(+84)
                      932608894</a>
                  </div>
                  <div className="ft-contact-email">
                    Email: <a
                      href="mailto:2151050153huy@ou.edu.vn " className="text-decoration-none">2151050153huy@ou.edu.vn </a>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-12">
                <div className="ft-social-network">
                  <h4>
                    Kết nối mạng xã hội
                  </h4>

                  <a type="button" className="btn btn-primary btn-floating mx-1 rounded-circle"
                    href="">
                    <i className="fa fa-facebook-f"></i>
                  </a>

                  <a type="button" className="btn btn-danger btn-floating mx-1 rounded-circle"
                    href="">
                    <i className="fa fa-google"></i>
                  </a>

                </div>

              </div>
            </div>

            <div className="d-flex row mt-2 mb-3">
              <div className="col-md-3 col-sm-12">
                <div className="ft-contact">
                  <h4>Giấy phép kinh doanh</h4>
                  <div className="content">
                    Giấy phép số: L 517/GP-BTTTT ngày 6/10/2015 của Bộ Thông tin và Truyền thông
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-sm-12">
                <div className="ft-certification">


                  <a href="">
                    Đã thông báo Bộ Công Thương</a>


                </div>
              </div>

              <div className="col-md-6 col-sm-12">
                <div>
                  <h4>Đăng ký nhận tin</h4>
                  <div>
                    Hãy nhập địa chỉ email của bạn vào ô dưới đây để có thể nhận được tất cả các tin tức mới
                    nhất của Nhà sách Kim Cương về các sản phẩm mới, các chương trình khuyến mãi mới. Nhà sách Kim Cương
                    xin đảm bảo sẽ không gửi mail rác, mail spam tới bạn.
                  </div>
                  <div className="row">
                    <div>
                      <div className="input-group justify-content-between">
                        <input type="email" value="dohuy4546@gmail.com"
                          placeholder="Nhập email của bạn..." id="Email"
                          className="col-md-8 col-sm-12 ps-2"
                          aria-label="general.newsletter_form.newsletter_email">
                        </input>
                        <button name="subscribe" id="subscribe"
                          className="col-md-3 col-sm-12 bg-danger text-white border-0">Đăng ký
                        </button>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="ft-copyrights-wrapper">
        <div className="wrapper">
          <div className="inner">
            <div className="ft-copyrights text-center">
              Copyrights © 2021 by <a href=""
                className="text-decoration-none text-dark text-hover">NS Kim Cương</a>.
              <a href="" className="text-decoration-none text-dark text-hover">Powered
                by Haravan</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
