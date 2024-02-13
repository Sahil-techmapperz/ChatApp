import React, { useState, useEffect } from 'react';
import UsersList from './UsersList';
import ChatInterface from './ChatInterface';
import './HomePage.css';
import io from 'socket.io-client';
import Sound from "../assets/whatsapp_notification.mp3";

const socket = io('https://chatdb-161w.onrender.com');

function HomePage() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user && user._id) {
            socket.emit('register', { userId: user._id });
        }


        const audio = new Audio(Sound);
        const playSound = () => {
            audio.play().catch(error => console.log("Audio play failed:", error));
        };




        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            if (newMessage.senderId != user._id) {
                playSound();
            }

        });

        socket.on('messages', (historicalMessages) => {
            setMessages(historicalMessages);
            // Assuming marking all fetched messages as read upon receiving
            historicalMessages.forEach((msg) => {
                if (!msg.isRead && msg.receiverId == user._id) {
                    socket.emit('messageRead', { messageId: msg._id, userId: user._id });
                }
            });
        });

        // socket.on('userDataWithMessages', (updatedMessage) => {
        //     console.log(updatedMessage);
        // });
        socket.on('messageUpdated', (updatedMessage) => {
            console.log(updatedMessage);
            setMessages((prevMessages) => prevMessages.map(msg => msg._id === updatedMessage._id ? updatedMessage : msg));
        });


        socket.on('messageDeleted', (deletedMessageId) => {
            setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== deletedMessageId));
        });


        socket.on('userDataWithMessages', (userData) => {
            console.log(userData);
            // const filteredUsers = userData
            //   .filter(user => user._id !== loginUser._id)
            //   .map(user => ({
            //     ...user,
            //     lastMessage: user.lastMessage !== 'empty' ? {
            //       content: user.lastMessage.content,
            //       createdAt: user.lastMessage.createdAt,
            //       isRead: user.lastMessage.isRead,
            //     } : null,
            //     unreadCount: user.unreadCount !== 0 ? user.unreadCount : null,
            //   }));
            // setUsers(filteredUsers);
          });

        return () => {
            socket.off('message');
            socket.off('messages');
            socket.off('messageUpdated');
            socket.off('messageDeleted');
            socket.off('userDataWithMessages');
        };
    }, [user]);

    const handleSendMessage = () => {
        if (message && selectedUser) {
            socket.emit('newMessage', {
                content: message,
                senderId: user._id,
                receiverId: selectedUser._id,
            });
            socket.emit('getUserDataWithMessages');
            setMessage('');
        }
    };

    // Function to emit an event to edit a message
    const handleEditMessage = (messageId, newContent) => {
        socket.emit('editMessage', { messageId, newContent });
    };

    // Function to emit an event to delete a message
    const handleDeleteMessage = (messageId) => {
        socket.emit('deleteMessage', { messageId });
    };

    const handleSelectUser = (selectedUser) => {
        setSelectedUser(selectedUser);
        if (selectedUser && selectedUser._id) {
            socket.emit('fetchMessages', {
                senderId: user._id,
                receiverId: selectedUser._id,
            });
        }
    };

    return (
        <div className="chat-container">
            <UsersList onSelectUser={handleSelectUser} />
            {selectedUser ? (
                <ChatInterface
                    selectedUser={selectedUser}
                    messages={messages}
                    message={message}
                    setMessage={setMessage}
                    handleSendMessage={handleSendMessage}
                    handleEditMessage={handleEditMessage}
                    handleDeleteMessage={handleDeleteMessage}
                />
            ) : (
                <div className="no-user-selected">
                    <p>Please select a user to start chatting.</p>
                </div>
            )}
        </div>
    );
}

export default HomePage;
