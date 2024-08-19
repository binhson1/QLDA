import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useState } from "react";
import MyContext from "../../configs/MyContext";
import { db } from "../../configs/firebase";

const Chat = () => {
    const [user] = useContext(MyContext);
    const [userChat, setUserChat] = useState([]);
    const loadUserChat = async () => {
        const q1 = query(collection(db, "UserChat"), where("users", "array-contains", user.uid));
        const querySnapshot = await getDocs(q1);
        const listUser = [];
        querySnapshot.forEach(doc => {
            listUser.push({ id: doc.id, ...doc.data() });
        });
        for (let u of listUser) {
            const q2 = query(collection(db, "Users"), where("uid", "in", u.user));
            const userQuerySnapshot = await getDocs(q2);
            const listUserChat = [];
            userQuerySnapshot.forEach(userDoc => {
                const data = userDoc.data();
                if (data.uid !== user.uid) {
                    listUserChat.push({ id: userDoc.id, ...userDoc.data() });
                }
            });
            setUserChat(listUserChat);
        }
    }

    React.useEffect(() => {
        loadUserChat();
    }, []);

    return (
        <div className="d-flex" style={{ height: "80vh" }}>
            <div className="col-3 overflow-auto  p-2">
                <h2 className="ms-3">Chats</h2>
                <div className="d-flex mb-3 p-2 overflow-auto align-items-center bg-info" style={{ borderRadius: "10px" }}>
                    <img style={{ width: "50px", height: "50px", borderRadius: "100%" }} src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-avatar-cute-98.jpg" alt="Cute Avatar" />
                    <h3 className="ms-2 text-white">Nguoi dung test</h3>
                </div>
                <div className="d-flex mb-3 p-2 overflow-auto align-items-center bg-info" style={{ borderRadius: "10px" }}>
                    <img style={{ width: "50px", height: "50px", borderRadius: "100%" }} src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/02/anh-avatar-cute-98.jpg" alt="Cute Avatar" />
                    <h3 className="ms-2 text-white">Nguoi dung test</h3>
                </div>
            </div>
            <div className="col-9">
                <div className="overflow-auto" style={{ height: "75vh" }}></div>
                <div className="d-flex">
                    <input
                        type="text"
                        className="form-control"
                    />
                    <button className="btn btn-primary">
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat;