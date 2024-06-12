import React, { useState, useEffect } from 'react'
import ChatBody from './ChatBody'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const WebSocketComponent = (props) => {
  const [serverID, setServerID] = useState(1);

  useEffect(() => {
    if (props.sseActive) {
      const ws = new WebSocket('ws://localhost:8000/ws/');

      ws.onmessage = (event) => {
        const data = event.data;
        // console.log(data)
        if (data.trim() === "finished") {
          console.log('WS Closed');
          setServerID(prevID => prevID + 1);
          props.setSseActive(false);
          ws.close();
        } else {
          props.setServerResponse({
            id: serverID,
            message: data,
            user: "ai",
            timeStamp: new Date().toLocaleTimeString(),
          });
        }
      };

      ws.onopen = () => {
        console.log('WS Opened');
        ws.send(props.message);
        props.setMessage('')
      };

      ws.onclose = () => {
        console.log('WS Closed');
        props.setSseActive(false);
      };

      ws.onerror = (event) => {
        console.log('WS Error:', event);
        props.setSseActive(false);
      };

      return () => {
        if (ws) {
          ws.close();
          console.log('WS connection closed');
          props.setSseActive(false);
        }
      };
    }
  }, [props.sseActive, serverID]);

  return (
    <></>
  );
};



const Chat = (props) => {

    //Handle response
    const [serverResponse, setServerResponse] = useState('')
    const [sseActive, setSseActive] = useState(false);

    const [value, setValue] = useState('');
    const handleChange = (e) => {
        setValue(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim() !== "") {
            setSseActive(true);
            setUserMessage({
                id: new Date().getTime(),
                message: value,
                user: "user",
                timeStamp: new Date().toLocaleTimeString()
            });
        }

    }

    //user message
    const [userMessage, setUserMessage] = useState({
        id: "",
        message: "",
        user: "",
        timeStamp: "",
    });

    return (
        <div className='container p-2'>
            {/* <SSEComponent setServerResponse={setServerResponse} setSseActive={setSseActive} sseActive={sseActive} /> */}
            <WebSocketComponent setServerResponse={setServerResponse} setSseActive={setSseActive} sseActive={sseActive} message = {value} setMessage = {setValue}/>
            {/* {console.log(serverResponse)} */}
            <div className='container w-100 vh-100'>

                {/* TOAST */}
                <ToastContainer />
                {/* TOAST */}
                <ChatBody userMessage={userMessage} serverResponse={serverResponse} id={0} email={'q@gmail.com'} />
                <div className='type container-fluid type w-100 px-3 py-2 '>
                    <div className='position-relative'>
                        <div className="input-group mb-3 d-flex justify-content-center w-100">
                            <textarea value={value} style={{ resize: "none" }} name='query' onChange={handleChange} className="form-control align-self-end" rows="1" p-2></textarea>
                            <button onClick={handleSubmit} type="button" className="btn btn-outline-light">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat
