import { addDoc, collection, getDocs, onSnapshot, orderBy, query, Timestamp, where } from "firebase/firestore";
import React, { useContext, useState } from "react";
import MyContext from "../../configs/MyContext";
import { db } from "../../configs/firebase";
import moment from 'moment';
import 'moment/locale/vi';

const Chat = () => {
    const [user] = useContext(MyContext);
    const [userChat, setUserChat] = useState([]);
    const [chats, setChats] = useState([]);
    const [u, setU] = useState();
    const [message, setMessage] = React.useState();

    const loadUserChat = async () => {
        const q1 = query(collection(db, "UserChat"), where("user", "array-contains", user.uid));

        const querySnapshot = await getDocs(q1);
        const listUser = [];
        querySnapshot.forEach(doc => {
            listUser.push({ id: doc.id, ...doc.data() });
        });
        console.log(listUser);
        const listUserChat = [];
        for (let u of listUser) {
            const q2 = query(collection(db, "Users"), where("uid", "in", u.user));
            const userQuerySnapshot = await getDocs(q2);

            userQuerySnapshot.forEach(userDoc => {
                const data = userDoc.data();
                if (data.uid !== user.uid) {
                    console.log(data);
                    listUserChat.push({ id: u.id, ...userDoc.data() });
                }
            });
        }
        setU(listUserChat[0]);
        setUserChat(listUserChat);
    }

    const loadChats = async () => {
        const q = query(collection(db, "UserChat", u.id, "Chats"), orderBy("created_date"));
        try {
            const unsubscribe = onSnapshot(q, (snapshot) => {
                let listChat = [];
                snapshot.forEach((doc) => {
                    listChat.push(doc.data());
                });
                setChats(listChat);
                // console.log(listChat);
            });
            return () => unsubscribe();
        } catch (error) {
            console.error("Error loading user chats: ", error);
        }
    }

    const sendMessage = async () => {
        const currentDate = Timestamp.now();
        await addDoc(collection(db, `UserChat/${u.id}/Chats`), {
            from: user.uid,
            created_date: currentDate,
            message: message
        });
        setMessage("");
    }

    React.useEffect(() => {
        if (user != null) {
            loadUserChat();
        }
    }, [user]);

    React.useEffect(() => {
        if (u != null) {
            loadChats();
        }
    }, [u]);

    return (
        <div className="d-flex" style={{ height: "80vh" }}>
            <div className="col-3 overflow-auto  p-2">
                <h2 className="ms-3">Chats</h2>
                {userChat.length > 0 && userChat.map((u) => (
                    <div className="d-flex mb-3 p-2 overflow-auto align-items-center bg-info" style={{ borderRadius: "10px" }} onClick={() => { console.log("hello"); setU(u); }}>
                        <img style={{ width: "50px", height: "50px", borderRadius: "100%" }} src={u.avatar} alt="Avatar" />
                        <div>
                            <h3 className="ms-2 m-0 text-white">{u.username}</h3>
                            <h3 className="ms-2 m-0 text-white">{u.firstName} {u.lastName}</h3>
                        </div>
                    </div>
                ))}
            </div>
            <div className="col-9">
                <div className="overflow-auto p-2" style={{ height: "75vh" }}>
                    {chats.length > 0 && chats.map((c) => (
                        <div className="d-flex flex-column" style={{ alignItems: c.from != user.uid ? 'flex-start' : 'flex-end' }}>
                            <div className="d-flex align-items-center">
                                {c.from != user.uid && <img style={{ width: "50px", height: "50px", borderRadius: "100%" }} src={u.avatar} alt="Avatar" />}
                                <div className="ms-2 bg-info rounded">
                                    <p>{c.message}</p>
                                </div>
                            </div>
                            <p className="m-0">{moment.unix(c.created_date.seconds).fromNow()}</p>
                        </div>
                    ))}
                </div>
                <div className="d-flex">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-control"
                        placeholder="Nhập tin nhắn"
                    />
                    <button className="btn btn-primary" onClick={sendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat;