import { useNavigate } from "react-router-dom";
import React from "react";
import API, { endpoints } from "../../configs/API";

const OTP = () => {
    let navigate = useNavigate();
    const [otp, setOtp] = React.useState(['', '', '', '']);
    const [randomOTP, setRandomOTP] = React.useState(null);
    const inputRefs = React.useRef(otp.map(() => React.createRef()));

    const handleSubmit = () => {
        const otpString = otp.join('');
        if (otpString == randomOTP) {
            navigate('/pickAvatar', { state: { success: true } });
        } else {
            alert("Mã OTP nhập không đúng! Vui lòng kiểm tra lại OTP");
        }
    }

    const handleChangeOTP = (num, index) => {
        if (/^\d*$/.test(num) && num.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = num;
            setOtp(newOtp);
            let nextIndex;

            if (num === "") {
                if (index == 0) {
                    nextIndex = 0
                } else {
                    nextIndex = index - 1;
                }
            }
            if (num !== "") {
                if (index == otp.length - 1) {
                    nextIndex = otp.length - 1;
                }
                else {
                    nextIndex = index + 1;
                }
            }
            const inputRef = inputRefs.current[nextIndex];
            inputRef.current.focus();
        }
    };

    React.useEffect(() => {
        let randomNumber = Math.floor(Math.random() * 10000);
        let otpNum = randomNumber.toString().padStart(4, '0');
        setRandomOTP(otpNum);
    }, []);

    React.useEffect(() => {
        if (randomOTP) {
            console.log(randomOTP);
            if (sessionStorage.getItem("user")) {
                const user = JSON.parse(sessionStorage.getItem("user"));
                const email = user.email;
                console.log(email);
                sendEmail(email);
            }
        }
    }, [randomOTP]);

    const sendEmail = async (email) => {
        try {
            const response = await API.post(endpoints['send_mail'], {
                subject: 'Xác thực mã OTP',
                message: `Mã OTP của bạn là ${randomOTP}`,
                recipient: email,
            });
            console.log(response.data); // In ra dữ liệu trả về từ Django
        } catch (error) {
            console.error(error);
        }
    };

    const otp_input = {
        width: "50px",
        textAlign: "center",
        margin: "0 5px",
        fontSize: "1.5rem"
    }

    return (
        <div class="container mt-5">
            <style>
                {`
          input[type=number] {
            -moz-appearance: textfield; /* Firefox */
          }

          input[type=number]::-webkit-outer-spin-button,
          input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none; /* Safari */
            margin: 0; /* Xóa margin mặc định */
          }
        `}
            </style>
            <div class="col-12 text-center">
                <h2>Nhập mã OTP</h2>
                <p>Vui lòng nhập mã OTP được gửi đến Email của bạn.</p>
            </div>
            <div class="col-12 text-center d-flex justify-content-center">
                {otp.map((value, index) => (
                    <input key={index} value={value} ref={inputRefs.current[index]} onChange={(e) => handleChangeOTP(e.target.value, index)} type="number" class="form-control" style={otp_input} maxlength="1" />
                ))}
                {/* <input type="number" class="form-control" style={otp_input} maxlength="1" />
                <input type="number" class="form-control" style={otp_input} maxlength="1" />
                <input type="number" class="form-control" style={otp_input} maxlength="1" />
                <input type="number" class="form-control" style={otp_input} maxlength="1" /> */}
            </div>
            <div class="col-12 text-center mt-4">
                <button class="btn btn-primary" onClick={handleSubmit}>Xác nhận</button>
            </div>
        </div>
    )
}

export default OTP;