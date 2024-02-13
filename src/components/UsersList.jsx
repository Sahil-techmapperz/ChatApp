import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Sound from "../assets/whatsapp_notification.mp3";
import { CgProfile } from "react-icons/cg";
import Avatardefault from "../assets/avatar-default.png";

// Assuming your socket.io server is running on localhost:7000
const socket = io('https://chatdb-161w.onrender.com');

function UsersList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [userHasInteracted, setUserHasInteracted] = useState(false); // State to track user interaction
  const audio = new Audio(Sound); // Load the audio file
  const loginUser = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    const loginUser = JSON.parse(localStorage.getItem('user'));
    socket.emit('getUserDataWithMessages');

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
        }));

      // Check if users array is different from filteredUsers
      const isDifferent = users.length !== filteredUsers.length || filteredUsers.some((filteredUser, index) => {
        const currentUser = users[index];
        return !currentUser || 
               currentUser.lastMessage?.content !== filteredUser.lastMessage?.content ||
               currentUser.unreadCount !== filteredUser.unreadCount;
      });

      if (isDifferent && userHasInteracted) { // Play sound if there's interaction
        audio.play().catch(error => console.log("Audio play failed:", error));
      }

      setUsers(filteredUsers);
    });

    // Cleanup to avoid memory leaks and multiple listeners
    return () => {
      socket.off('userDataWithMessages');
    };
  }, [users, userHasInteracted]); // Depend on users and userHasInteracted

  // Adjusted handler to mark user interaction
  const handleUserSelect = (user) => {
    setUserHasInteracted(true); // Mark as interacted
    onSelectUser(user);
  };

  // Styles
  const userItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px',
    margin: '5px 0',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s',
    height: '70px',
  };

  const userInfoStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  };

  // Additional CSS for the login user display
const loginDisplayStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  backgroundColor: '#e3f2fd', // Light blue background for contrast
  padding: '10px',
  borderRadius: '5px',
  margin: '0 0 10px 0', // Add some margin to the bottom
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const userNameStyle = {
  marginLeft: '10px',
  fontWeight: 'bold',
  fontSize: '1.1rem',
  color: '#333', // Darker font color for better readability
};

  const userDetailsStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.9rem',
    color: '#555',
  };

  const unreadCountStyle = {
    fontWeight: 'bold',
    color: '#f44336',
    textAlign: 'right',
  };

  const dateStyle = {
    fontSize: '0.8rem',
    color: '#777',
    textAlign: 'right',
    marginTop: "-20px"
  };

  return (
    <div className="user-list" style={{ maxWidth: '300px' }}>
      {loginUser && (
      <div style={loginDisplayStyle}>
        {/* Example of using an img tag for an avatar/icon. Adjust the src as necessary. */}
        <img src={Avatardefault} alt="User avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
        <div style={userNameStyle}>{`${loginUser.name}`}</div>
      </div>
    )}
      {error && <p>{error}</p>}
      {users.map(user => (
        <div key={user._id} style={userItemStyle} onClick={() => handleUserSelect(user)}>
          <div style={userInfoStyle}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</div>
              {user.lastMessage && (
                <div style={userDetailsStyle}>
                  <p>{user.lastMessage.content.length > 10 ? `${user.lastMessage.content.slice(0, 10)}...` : user.lastMessage.content}</p>
                </div>
              )}
            </div>
            <div style={{ minWidth: '100px', textAlign: 'right' }}>
              {user.unreadCount && <p style={unreadCountStyle}>Unread: {user.unreadCount}</p>}
            </div>
          </div>
          {user.lastMessage && (
            <p style={dateStyle}>{new Date(user.lastMessage.createdAt).toLocaleString()}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default UsersList;
