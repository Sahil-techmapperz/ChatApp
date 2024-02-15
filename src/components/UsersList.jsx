import React, { useState, useEffect } from 'react';
import Sound from "../assets/whatsapp_notification.mp3";
import { FiCircle, FiMail } from "react-icons/fi"; // Using FiMail for unread messages
import Avatardefault from "../assets/avatar-default.png";

function UsersList({ onSelectUser, socket,messages,selectedUser }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const loginUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const audio = new Audio(Sound);
    socket.emit('getUserDataWithMessages', { userId: loginUser._id });
  
    socket.on('userDataWithMessages', (userData) => {
      const filteredUsers = userData
        .filter(user => user._id !== loginUser._id)
        .map(user => ({
          ...user,
          lastMessage: user.lastMessage !== 'empty' ? {
            content: user.lastMessage.content,
            createdAt: user.lastMessage.createdAt,
            isRead: user.lastMessage.isRead,
          } : null,
          unreadCount: user.unreadCount !== 0 ? user.unreadCount : null,
          isOnline: user.isOnline,
        }));
  
      // Check if users array is different from filteredUsers
      const isDifferent = users.length !== filteredUsers.length || filteredUsers.some((filteredUser, index) => {
        const currentUser = users[index];
        return !currentUser ||
          currentUser.lastMessage?.content !== filteredUser.lastMessage?.content ||
          currentUser.unreadCount !== filteredUser.unreadCount;
      });
  
      if (isDifferent && userHasInteracted ) { // Ensures sound plays only after user interaction
        audio.play().catch(error => console.log("Audio play failed:", error));
      }
  
      setUsers(filteredUsers);
    });
  
    return () => {
      socket.off('userDataWithMessages');
    };
  }, [users, userHasInteracted, messages]); // Assuming userHasInteracted is set to true on user interaction
  

  const handleUserSelect = (user) => {
    setUserHasInteracted(true);
    onSelectUser(user);
  };

  return (
    <div className="user-list" style={{ maxWidth: '400px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', margin: '0 auto', padding: '10px' }}>
      {loginUser && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: '#e3f2fd',
          padding: '10px',
          borderRadius: '5px',
          margin: '10px 0',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
        }}>
          <img src={Avatardefault} alt="User avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
          <div style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
            {loginUser.name}
          </div>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {users.map(user => (
        <div key={user._id} style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '10px',
          margin: '5px 0',
          backgroundColor: '#f8f8f8',
          cursor: 'pointer',
          borderRadius: '5px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'background-color 0.3s',
          ':hover': {
            backgroundColor: '#e9eff5',
          },
        }} onClick={() => handleUserSelect(user)} title={user.lastMessage ? user.lastMessage.content : 'No message'}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              {user.isOnline ? <FiCircle style={{ color: '#4CAF50', marginRight: '10px' }} /> : <FiCircle style={{ color: '#9E9E9E', marginRight: '10px' }} />}
              {user.unreadCount > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', color: '#f44336', fontWeight: 'bold' }}>
                  <FiMail style={{ marginRight: '4px' }} />{user.unreadCount}
                </span>
              )}
            </div>
          </div>
          {user.lastMessage && (
            <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '5px' }}>
            <div>  {user.lastMessage && typeof user.lastMessage.content === 'string' && user.lastMessage ? user.lastMessage.content.substring(0, 20) + "..." : ''} </div>
              {new Date(user.lastMessage.createdAt).toLocaleString()}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UsersList;
