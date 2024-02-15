import React, { useState } from 'react';
import chatBackground from '../assets/chatBG.jpg';
import { MdEdit, MdDelete, MdImage, MdAttachFile, MdFileDownload } from "react-icons/md";

function ChatInterface({ socket, selectedUser, messages, message, setMessage, handleSendMessage, handleEditMessage, handleDeleteMessage }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Additional state to handle file inputs
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);

    let BaseUrl = import.meta.env.VITE_Base_Url;

    // Inline styles omitted for brevity...

    const fileInputStyle = {
        display: 'none'
    };

    // Function to trigger file input
    const triggerFileInput = (fileType) => {
        document.getElementById(fileType).click();
    };

    // Function to handle file selection
    const handleFileChange = (event, type) => {
        const selectedFile = event.target.files[0];
            setFile(selectedFile);
            document.getElementById("file").style.display="block";
    };

    // Function to handle file upload
    const uploadFile = (type) => {
        const formData = new FormData();
        formData.append(type, type === 'image' ? image : file);
        setIsLoading(true);

        if (type == "image") {
            handleimageUpload(formData, type);
        } else {
            handlefileUpload(formData, type);
        }

        // Reset file input after upload
        if (type === 'image') {
            document.getElementById('image').value="";
            setImage(null);
        } else {
            document.getElementById('file').value="";
            setFile(null);
        }
    };


    function getFileTypeFromUrl(url) {
        // Regular expression to extract the file extension from the URL
        const extensionMatch = url.match(/\.([^\.]+)$/);
        if (!extensionMatch) return 'other'; // Return 'other' if no extension found

        const extension = extensionMatch[1].toLowerCase();

        // Define known extensions for image, audio, and video files
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
        const audioExtensions = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];
        const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

        // Determine the file type based on the extension
        if (imageExtensions.includes(extension)) {
            return 'image';
        } else if (audioExtensions.includes(extension)) {
            return 'audio';
        } else if (videoExtensions.includes(extension)) {
            return 'video';
        } else {
            return 'other';
        }
    }


    async function handleimageUpload(formData, type) {
        try {
            const response = await fetch(`${BaseUrl}/chatmessage/uploadimage`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }
            const result = await response.json();
            let fileUrl = result.Url;

            let fileType = getFileTypeFromUrl(fileUrl);
            console.log(fileType);
            setIsLoading(false);
            socket.emit("newfile", { 'fileUrl': fileUrl, fileType, "receiverId": selectedUser._id, 'senderId': user._id });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload file.');
        }
    };





    async function handlefileUpload(formData, type) {
        try {
            const response = await fetch(`${BaseUrl}/api/chatmessage/uploadfile`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with ${response.status}`);
            }

            const result = await response.json();
            let fileUrl = result.Url;

            let fileType = getFileTypeFromUrl(fileUrl);
            console.log(fileType);
            setIsLoading(false);
            document.getElementById("file").style.display="none";
            socket.emit("newfile", { 'fileUrl': fileUrl, fileType, "receiverId": selectedUser._id, 'senderId': user._id });
        } catch (error) {
            console.error('Upload failed:', error);
            setIsLoading(false);
            document.getElementById("file").style.display="none";
        }
    }


    const enhancedHandleSendMessage = () => {
        if (image || file) {
            uploadFile(image ? 'image' : 'file');
        } else {
            handleSendMessage();
        }
    };


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

    const spinnerInnerStyle = {
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderTopColor: '#3498db', // Example color
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        animation: 'spin 1s linear infinite',
    };


    const spinnerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', // Positioning it absolutely to overlay on the messages or at a fixed place.
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent', // Semi-transparent background
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
    const downloadButtonStyle = {
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
                    (msg.senderId === selectedUser._id && msg.receiverId === user._id) ||
                        (msg.senderId === user._id && msg.receiverId === selectedUser._id) ? (
                        <div
                            key={msg._id}
                            style={msg.senderId === user._id ? messageStyleSent : messageStyleReceived}
                            onMouseEnter={() => handleMouseEnter(msg._id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {msg.fileUrl && msg.fileUrl.trim() !== "" ? (
                                // Rendering for messages with files
                                <>
                                    {msg.fileType.startsWith("image") ? (
                                        <div>
                                            <img src={msg.fileUrl} alt="Sent" style={{ maxWidth: '100%', height: 'auto' }} />
                                            {/* Download button for the image */}
                                            <a href={msg.fileUrl} download={true} target='_blank' style={{ cursor: 'pointer', marginLeft: '10px' }}>
                                                <MdFileDownload size="20px" title="Download Image" />
                                            </a>
                                        </div>

                                    ) : msg.fileType.startsWith("audio") ? (
                                        <audio controls src={msg.fileUrl}>Your browser does not support the audio element.</audio>
                                    ) : msg.fileType.startsWith("video") ? (
                                        <video controls src={msg.fileUrl} style={{ maxWidth: '100%', height: 'auto' }}>Your browser does not support the video tag.</video>
                                    ) : (
                                        <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">Open file</a>
                                    )}
                                </>
                            ) : (
                                // Rendering for normal text messages
                                <>
                                    {isLoading && (
                                        <div style={spinnerStyle}>
                                            <div style={spinnerInnerStyle}></div>
                                            <div>Please wait your file is uploading</div>
                                        </div>
                                    )}

                                    <div>{msg.content}</div>
                                    {msg.isUpdate && <span style={editedLabelStyle}>(Edited) {formatMessageTime(msg.updatedAt)}</span>}
                                </>
                            )}
                            <div style={messageTimeStyle}>{formatMessageTime(msg.createdAt)}</div>
                            {/* Read status, edit, and delete actions */}
                            {msg.senderId === user._id && (
                                <span style={readStatusLabelStyle}>
                                    {msg.isRead ? "Read" : "Unread"}
                                </span>
                            )}
                            {msg.senderId === user._id && hoveredMessageId === msg._id && (
                                <div>
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
                                            {msg.fileUrl && msg.fileUrl.trim() !== "" ? "" : <button style={editButtonStyle} onClick={() => startEdit(msg)}><MdEdit /></button>}
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
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Prevents the default action of the enter key which is to insert a new line
                            enhancedHandleSendMessage();
                        }
                    }}
                />
                <button onClick={enhancedHandleSendMessage} style={buttonStyle}>
                    Send
                </button>
                <MdAttachFile onClick={() => triggerFileInput('file')} style={{ cursor: 'pointer', marginLeft: '10px' }} />
                
                <input
                    id="file"
                    type="file"
                    onChange={(e) => handleFileChange(e, 'file')}
                    style={fileInputStyle}

                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Prevents the default action of the enter key which is to insert a new line
                            enhancedHandleSendMessage();
                        }
                    }}
                />
            </div>
        </div>
    );
}

export default ChatInterface;
