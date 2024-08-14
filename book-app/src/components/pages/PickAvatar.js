import React, { useRef, useState } from 'react';
import API, { endpoints } from "../../configs/API";
import { useLocation, useNavigate } from 'react-router-dom';

function PickAvatar() {
    const [selectedImage, setSelectedImage] = useState(null);
    const avatar = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { success } = location.state || {};
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

    const register = async (e) => {
        e.preventDefault();
        try {
            let form = new FormData();
            let user = JSON.parse(sessionStorage.getItem('user'));
            for (let key in user)
                if (key !== 'confirm')
                    form.append(key, user[key]);

            if (avatar)
                form.append('avatar', avatar.current.files[0]);
            const res = await API.post(endpoints['user'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            location.state = {
                ...location.state,
                success: undefined
            };
            sessionStorage.removeItem('user');
            navigate('/login', { state: { msg: "Đăng ký thành công" } });
        } catch (ex) {
            console.error(ex);
        }
    }

    React.useEffect(() => {
        if (!success && success != true) {
            navigate('/register', { state: { msg: 'Đăng ký thất bại' } });
        }
    }, []);

    return (
        <div className="container text-center col-6">
            <h1 className='m-2'>Chọn ảnh avatar</h1>
            <input type="file" onChange={handleImageChange} accept=".png,.jpg" className='form-control m-2' ref={avatar} />
            {selectedImage && (
                <div className='m-2'>
                    <h2 className='m-2'>Ảnh xem trước:</h2>
                    <img src={selectedImage} alt="Ảnh xem trước" style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: "50%" }} />
                </div>
            )}
            <button className='btn btn-md btn-primary m-2' onClick={register}>Xác nhận</button>
        </div>
    );
}

export default PickAvatar;
