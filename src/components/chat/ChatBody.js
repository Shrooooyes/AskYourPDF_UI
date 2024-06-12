import React, { useEffect, useState } from 'react';

const ChatBody = (props) => {
    const [chat, setChat] = useState([]);

    // useEffect(() => {
    //     console.log("Chat Updated")
    //     try {
    //         fetch('http://localhost:8000/update-chat', {
    //             "method": "POST",
    //             "headers": { "Content-Type": "application/json" },
    //             "body": {
    //                 "chat": chat,
    //                 "id": props.id,
    //                 "email": props.email
    //             }
    //         })
    //     }
    //     catch(e){
    //         console.log(e)
    //     }
    // }, [chat])

    useEffect(() => {
        if (props.userMessage.user && props.userMessage.id) {
            setChat(prevChat => {
                if (!prevChat.some(message => message.id === props.userMessage.id)) {
                    return [...prevChat, props.userMessage];
                }
                return prevChat;
            });
        }
    }, [props.userMessage]);

    useEffect(() => {
        if (props.serverResponse.id) {
            setChat(prevChat => {
                const chatIndex = prevChat.findIndex(message => message.id === props.serverResponse.id);
                if (chatIndex !== -1) {
                    // Update existing message
                    const updatedChat = [...prevChat];
                    updatedChat[chatIndex].message = props.serverResponse.message;
                    return updatedChat;
                } else {
                    // Add new message
                    return [...prevChat, props.serverResponse];
                }
            });
        }
    }, [props.serverResponse]);

    return (
        <div className="chat container-fluid rounded bg-opacity-10 bg-secondary w-100 py-1 overflow-y-scroll">
            <div className='py-2'>
                {chat.map(message => (
                    <div key={message.id} className='container-fluid px-0 py-1 d-flex'>
                        <div className='user p-2'>
                            {message.user !== "ai" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-robot" viewBox="0 0 16 16">
                                    <path d="M6 12.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5M3 8.062C3 6.76 4.235 5.765 5.53 5.886a26.6 26.6 0 0 0 4.94 0C11.765 5.765 13 6.76 13 8.062v1.157a.93.93 0 0 1-.765.935c-.845.147-2.34.346-4.235.346s-3.39-.2-4.235-.346A.93.93 0 0 1 3 9.219zm4.542-.827a.25.25 0 0 0-.217.068l-.92.9a25 25 0 0 1-1.871-.183.25.25 0 0 0-.068.495c.55.076 1.232.149 2.02.193a.25.25 0 0 0 .189-.071l.754-.736.847 1.71a.25.25 0 0 0 .404.062l.932-.97a25 25 0 0 0 1.922-.188.25.25 0 0 0-.068-.495c-.538.074-1.207.145-1.98.189a.25.25 0 0 0-.166.076l-.754.785-.842-1.7a.25.25 0 0 0-.182-.135" />
                                    <path d="M8.5 1.866a1 1 0 1 0-1 0V3h-2A4.5 4.5 0 0 0 1 7.5V8a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v1a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1v-.5A4.5 4.5 0 0 0 10.5 3h-2zM14 7.5V13a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.5A3.5 3.5 0 0 1 5.5 4h5A3.5 3.5 0 0 1 14 7.5" />
                                </svg>
                            )}
                        </div>
                        <div className="message-div container w-auto mw-90 rounded px-2 m-1 bg-secondary bg-opacity-10">
                            <div className='message p-1 py-2 m-0'>{message.message}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChatBody;