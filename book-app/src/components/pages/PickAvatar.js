import React, { useRef, useState } from 'react';
import API, { authAPI, endpoints } from "../../configs/API";
import { useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from '../../configs/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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
            const userFirebase = await createUserWithEmailAndPassword(
                auth,
                form.get('email'),
                form.get('password')
            );
            const user_uuid = userFirebase.user.uid;
            const currentDate = Timestamp.now();
            const userChatCollectionRef = collection(db, 'UserChat');
            const userCollection = collection(db, 'Users');
            const newData = {
                user: [user_uuid, "WCDISAsP2pcNliXaGU6WRIhtRwy2"],
                created_date: currentDate
            };
            let user_data = await API.post(endpoints['login'], {
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
            console.log(user_data.data);
            let res_user = await authAPI(user_data.data.access_token).get(endpoints['current-user']);
            console.log(res_user.data);
            const newUser = {
                uid: user_uuid,
                username: form.get('username'),
                firstName: form.get('first_name'),
                lastName: form.get('last_name'),
                phone: form.get('phone'),
                avatar: res_user.data.avatar
            }
            console.log(newUser);
            const docUserRef = await addDoc(userCollection, newUser);
            const docRef = await addDoc(userChatCollectionRef, newData);
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
