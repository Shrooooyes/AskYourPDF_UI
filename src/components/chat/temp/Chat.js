import React, { useState, useRef, useEffect } from 'react';

import './Chat.css'
import ChatBody from './ChatBody';

const Chat = () => {
    const [value, setValue] = useState('');
    const textAreaRef = useRef(null);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = 'auto';
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, [value]);

    const [chat, setChat] = useState('')

    const handleSend = () => {
        if (value.trim() !== '') {
            setChat(chat + `<p class="user">${value}</p>`);

            fetch("http://localhost:8000/query", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: value })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    // Handle the response data as needed
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });

            setValue('');
        }
    };

    return (
        <div className='Chat'>
            <div className='chatbody'>
                <ChatBody chat={chat} />
            </div>

            <div classname='type-container'>
                <div className='type'>
                    <button className='uploadPDF'><i className="fa-solid fa-circle-plus"></i></button>
                    <div className='textarea-container'>
                        <textarea
                            ref={textAreaRef}
                            value={value}
                            onChange={handleChange}
                            rows={1}
                        />
                    </div>
                    <button onClick={handleSend} className='send'><i className="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
