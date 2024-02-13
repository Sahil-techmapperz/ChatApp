import React, { useState } from 'react';
import chatBackground from '../assets/chatBG.jpg';
import { MdEdit, MdDelete } from "react-icons/md";

function ChatInterface({ selectedUser, messages, message, setMessage, handleSendMessage, handleEditMessage, handleDeleteMessage }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [hoveredMessageId, setHoveredMessageId] = useState(null);

    // Inline styles
    const chatInterfaceStyle = {
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '20px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '90vh',
        width: "74vw",
        maxWidth: "75vw",
        backgroundPosition: 'center',
        fontFamily: "'Roboto', sans-serif",
    };

    const headingStyle = {
        color: '#333',
        fontSize: '1.5rem',
        fontWeight: 500,
        marginBottom: '20px',
        padding: '10px 0',
        borderBottom: '2px solid #eee',
        textAlign: 'center',
    };

    const messagesStyle = {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowY: 'auto',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        backgroundImage: `url(${chatBackground})`,
        backgroundSize: 'cover',
    };

    const messageStyle = {
        maxWidth: "60%",
        padding: '10px',
        margin: '5px 0',
        borderRadius: '10px',
        color: "black",
    };

    const messageStyleSent = {
        ...messageStyle,
        backgroundColor: '#D9FDD3',
        alignSelf: 'flex-end',
    };

    const messageStyleReceived = {
        ...messageStyle,
        backgroundColor: '#EFEFEF',
        alignSelf: 'flex-start',
    };

    const inputStyle = {
        flexGrow: 1,
        padding: '12px',
        margin: '0 8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
    };

    const buttonStyle = {
        padding: '10px 20px',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'background-color 0.3s',
    };

    const editedLabelStyle = {
        fontSize: '0.75rem',
        color: '#ff9800',
        marginLeft: '10px',
    };

    const messageInputStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const messageTimeStyle = {
        fontSize: '0.75rem',
        color: 'black',
        marginTop: '5px',
        textAlign: 'right',
    };

    const readStatusLabelStyle = {
        fontSize: '0.75rem',
        marginLeft: '10px',
        fontStyle: 'italic',
    };

    const actionButtonStyle = {
        marginLeft: '10px',
        padding: '5px 10px',
        fontSize: '0.8rem',
        borderRadius: '4px',
        cursor: 'pointer',
    };

    const editButtonStyle = {
        ...actionButtonStyle,
        backgroundColor: '#FFCA28',
        color: 'black',
    };

    const deleteButtonStyle = {
        ...actionButtonStyle,
        backgroundColor: '#F44336',
        color: 'white',
    };


    // New function to handle mouse enter and leave
    const handleMouseEnter = (msgId) => {
        setHoveredMessageId(msgId);
    };

    const handleMouseLeave = () => {
        setHoveredMessageId(null);
    };

    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Function to handle message editing UI
    const startEdit = (msg) => {
        setEditingMessageId(msg._id);
        setEditedContent(msg.content);
    };

    // Function to cancel editing
    const cancelEdit = () => {
        setEditingMessageId(null);
        setEditedContent("");
    };

    // Function to save edited message
    const saveEdit = (msgId) => {
        handleEditMessage(msgId, editedContent);
        setEditingMessageId(null);
        setEditedContent("");
    };

    return (
        <div style={chatInterfaceStyle}>
            {selectedUser && <h2 style={headingStyle}>Chat with {selectedUser.name}</h2>}
            <div style={messagesStyle}>
                {messages.map((msg) => (
                    (msg.senderId === selectedUser._id && msg.receiverId === user._id) || (msg.senderId === user._id && msg.receiverId === selectedUser._id) ? (
                        <div
                            key={msg._id}
                            style={msg.senderId === user._id ? messageStyleSent : messageStyleReceived}
                            onMouseEnter={() => handleMouseEnter(msg._id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div>{msg.content}</div>
                            {/* Show "Edited" if createdAt and updatedAt are different */}
                            {msg.isUpdate && <span style={editedLabelStyle}>(Edited){formatMessageTime(msg.updatedAt)}</span>}
                            <div style={messageTimeStyle}>{formatMessageTime(msg.createdAt)}</div>
                            {msg.senderId === user._id && (
                                <span style={readStatusLabelStyle}>
                                    {msg.isRead ?
                                        <div style={{ color: "#53bdeb", textAlign: "end" }}>
                                            <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path></svg>
                                        </div>
                                        :
                                        <div style={{ textAlign: "end" }}>
                                            <svg viewBox="0 0 16 11" height="11" width="16" preserveAspectRatio="xMidYMid meet" class="" fill="none"><title>msg-dblcheck</title><path d="M11.0714 0.652832C10.991 0.585124 10.8894 0.55127 10.7667 0.55127C10.6186 0.55127 10.4916 0.610514 10.3858 0.729004L4.19688 8.36523L1.79112 6.09277C1.7488 6.04622 1.69802 6.01025 1.63877 5.98486C1.57953 5.95947 1.51817 5.94678 1.45469 5.94678C1.32351 5.94678 1.20925 5.99544 1.11192 6.09277L0.800883 6.40381C0.707784 6.49268 0.661235 6.60482 0.661235 6.74023C0.661235 6.87565 0.707784 6.98991 0.800883 7.08301L3.79698 10.0791C3.94509 10.2145 4.11224 10.2822 4.29844 10.2822C4.40424 10.2822 4.5058 10.259 4.60313 10.2124C4.70046 10.1659 4.78086 10.1003 4.84434 10.0156L11.4903 1.59863C11.5623 1.5013 11.5982 1.40186 11.5982 1.30029C11.5982 1.14372 11.5348 1.01888 11.4078 0.925781L11.0714 0.652832ZM8.6212 8.32715C8.43077 8.20866 8.2488 8.09017 8.0753 7.97168C7.99489 7.89128 7.8891 7.85107 7.75791 7.85107C7.6098 7.85107 7.4892 7.90397 7.3961 8.00977L7.10411 8.33984C7.01947 8.43717 6.97715 8.54508 6.97715 8.66357C6.97715 8.79476 7.0237 8.90902 7.1168 9.00635L8.1959 10.0791C8.33132 10.2145 8.49636 10.2822 8.69102 10.2822C8.79681 10.2822 8.89838 10.259 8.99571 10.2124C9.09304 10.1659 9.17556 10.1003 9.24327 10.0156L15.8639 1.62402C15.9358 1.53939 15.9718 1.43994 15.9718 1.32568C15.9718 1.1818 15.9125 1.05697 15.794 0.951172L15.4386 0.678223C15.3582 0.610514 15.2587 0.57666 15.1402 0.57666C14.9964 0.57666 14.8715 0.635905 14.7657 0.754395L8.6212 8.32715Z" fill="currentColor"></path></svg>
                                        </div>
                                    }
                                </span>
                            )}

                            {msg.senderId === user._id && hoveredMessageId === msg._id && (
                                <div>
                                    {/* Edit and delete buttons */}
                                    {editingMessageId === msg._id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                                style={{ width: '100%', marginBottom: '10px' }}
                                            />
                                            <button style={editButtonStyle} onClick={() => saveEdit(msg._id)}>Save</button>
                                            <button style={deleteButtonStyle} onClick={cancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button style={editButtonStyle} onClick={() => startEdit(msg)}><MdEdit /></button>
                                            <button style={deleteButtonStyle} onClick={() => handleDeleteMessage(msg._id)}><MdDelete /></button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : null
                ))}
            </div>
            <div style={messageInputStyle}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={handleSendMessage} style={buttonStyle}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatInterface;
