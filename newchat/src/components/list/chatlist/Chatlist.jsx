import { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/addUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";
import { Link } from "react-router-dom";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "./minus.png" : "./plus.png"}
          alt=""
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
  <Link
    to={`/chat/${chat.chatId}`}
    key={chat.chatId}
    className="chat-link" // Add a class to the Link for styling
  >
    <div
      className="item"
      onClick={() => handleSelect(chat)}
      style={{
        backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderRadius: "8px",
        marginBottom: "10px",
        color: "inherit",
        width: "100%",  // Full width
        maxWidth: "100%",  // Optional: Max width if necessary
      }}
    >
      <img
        src={
          chat.user.blocked.includes(currentUser.id)
            ? "./avatar.png"
            : chat.user.avatar || "./avatar.png"
        }
        alt=""
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: "10px",
        }}
      />
      <div className="texts">
        <span
          style={{
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {chat.user.blocked.includes(currentUser.id) ? "User" : chat.user.username}
        </span>
        <p
          style={{
            margin: "0",
            color: "#ddd",
          }}
        >
          {chat.lastMessage}
        </p>
      </div>
    </div>
  </Link>
))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
