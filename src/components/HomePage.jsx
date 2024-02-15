import React, { useState, useEffect } from 'react';
import UsersList from './UsersList';
import ChatInterface from './ChatInterface';
import './HomePage.css';
import io from 'socket.io-client';
import Sound from "../assets/whatsapp_notification.mp3";

let BaseUrl = import.meta.env.VITE_Base_Url;
const socket = io(BaseUrl);
// const socket = io('http://localhost:7000');

function HomePage() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const audio = new Audio(Sound);
        const playSound = () => {
            audio.play().catch(error => console.log("Audio play failed:", error));
        };

        if (user && user._id) {
            socket.emit('register', { userId: user._id });
        }

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            if (newMessage.senderId != user._id) {
                playSound();
            }

        });

        socket.on('messages', (historicalMessages) => {
            // console.log(historicalMessages);
            setMessages(historicalMessages);
            // Assuming marking all fetched messages as read upon receiving
            historicalMessages.forEach((msg) => {
                if (!msg.isRead && msg.receiverId == user._id) {
                    socket.emit('messageRead', { messageId: msg._id, userId: user._id });
                }
            });
        });


        socket.on('messageUpdated', (updatedMessage) => {
            // console.log(updatedMessage);
            setMessages((prevMessages) => prevMessages.map(msg => msg._id === updatedMessage._id ? updatedMessage : msg));
        });


        socket.on('messageDeleted', (deletedMessageId) => {
            setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== deletedMessageId));
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
            // socket.emit('getUserDataWithMessages',{userId: user._id});
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
            socket.emit('getUserDataWithMessages', { userId: user._id });
        }
    };

    return (
        <div className="chat-container">
            <UsersList selectedUser={selectedUser} onSelectUser={handleSelectUser} socket={socket} messages={messages} />
            {selectedUser ? (
                <ChatInterface
                    socket={socket}
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
                    <div>Hey there! 👋 Let's get started by choosing someone to chat with from the user list on the left.</div>
                </div>

            )}
        </div>
    );
}

export default HomePage;
