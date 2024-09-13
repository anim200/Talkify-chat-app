import './userinfo.css'
import { useUserStore } from "../../../lib/userStore";
import { useNavigate } from 'react-router-dom';
import { auth, } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";



const Userinfo = () => {
  const {  resetChat} =
  useChatStore
  const { currentUser } = useUserStore();
  const navigate = useNavigate();
  const handleLogout = () => {
    auth.signOut();
    resetChat()
    navigate('/');
  };

  

  return (
    <div className='userInfo'>
      <div className="user">
        <img src={currentUser.avatar || "./avatar.png"} alt="" />
        <h2>{currentUser.username}</h2>
        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
     
    </div>
  )
}

export default Userinfo