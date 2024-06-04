import React, { useState, useEffect } from 'react'
import ChatBody from './ChatBody'

import { FileUploader } from "react-drag-drop-files";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

let ServerID = 1;

const SSEComponent = (props) => {
    useEffect(() => {
        let source;

        if (props.sseActive) {
            source = new EventSource('http://localhost:8000/testSEE');

            source.addEventListener('open', () => {
                console.log('SSE connection opened');
            });

            source.addEventListener('message', (e) => {
                let data = e.data;

                if (data.trim() === "finished") {
                    console.log('SSE Closed');
                    ServerID++;
                    props.setSseActive(false)
                    source.close();
                }

                else {
                    props.setServerResponse({
                        id: ServerID,
                        message: data,
                        user: "ai",
                        timeStamp: new Date().toLocaleTimeString()
                    });
                }
            });
        }

        return () => {
            if (source) {
                source.close();
                console.log('SSE connection closed');
                props.setSseActive(false)
            }
        };
    }, [props.sseActive]);

    return (<></>);
};


const Chat = () => {

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
            setValue("")
        }

    }

    //File Handling
    const [file, setFile] = useState(null);
    const handleFileChange = (file) => {
        setFile(file);
    };

    const handleFile = (e) => {
        e.preventDefault();
        if (file !== null) {
            const formData = new FormData();
            formData.append('file', file);

            axios.post('http://localhost:8000/upload', formData)
                .then(response => {
                    console.log(response)
                })

            setFile(null)
            notify()
        }
        else {
            setMessage("Please select a file.")
        }
    }

    const ModalClose = () => {
        setFile(null);
    }

    //Message
    const [message, setMessage] = useState("");

    //Toast
    const notify = () => toast.success("PDF Uploaded!");

    //user message
    const [userMessage, setUserMessage] = useState({
        id: "",
        message: "",
        user: "",
        timeStamp: "",
    });

    return (
        <div className='container p-2'>
            <SSEComponent setServerResponse={setServerResponse} setSseActive={setSseActive} sseActive={sseActive} />
            {console.log(serverResponse)}
            <div className='container w-100 vh-100'>

                {/* TOAST */}
                <ToastContainer />
                {/* TOAST */}

                {/* MODAL */}

                {/* <!-- Modal --> */}
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                            {/* MODAL BODY */}
                            <div class="modal-header">
                                <h1 class="modal-title text-dark fs-5" id="staticBackdropLabel">Upload PDF file</h1>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <FileUploader handleChange={handleFileChange} name="file" types={['PDF']} required />
                                {file == null ?
                                    <div class="text-danger">
                                        {message}
                                    </div>
                                    :
                                    <div className='text-success d-flex p-1 w-fitcontent'>
                                        <div className='px-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-pdf" viewBox="0 0 16 16">
                                                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                                                <path d="M4.603 14.087a.8.8 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.7 7.7 0 0 1 1.482-.645 20 20 0 0 0 1.062-2.227 7.3 7.3 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a11 11 0 0 0 .98 1.686 5.8 5.8 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.86.86 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.7 5.7 0 0 1-.911-.95 11.7 11.7 0 0 0-1.997.406 11.3 11.3 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.8.8 0 0 1-.58.029m1.379-1.901q-.25.115-.459.238c-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361q.016.032.026.044l.035-.012c.137-.056.355-.235.635-.572a8 8 0 0 0 .45-.606m1.64-1.33a13 13 0 0 1 1.01-.193 12 12 0 0 1-.51-.858 21 21 0 0 1-.5 1.05zm2.446.45q.226.245.435.41c.24.19.407.253.498.256a.1.1 0 0 0 .07-.015.3.3 0 0 0 .094-.125.44.44 0 0 0 .059-.2.1.1 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a4 4 0 0 0-.612-.053zM8.078 7.8a7 7 0 0 0 .2-.828q.046-.282.038-.465a.6.6 0 0 0-.032-.198.5.5 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822q.036.167.09.346z" />
                                            </svg>
                                        </div>
                                        {file.name}
                                    </div>}
                            </div>
                            <div className='modal-footer'>
                                <button onClick={handleFile} className='btn btn-success' data-bs-dismiss={file === null ? "" : "modal"}>Upload</button>
                            </div>
                            {/* MODAL BODY */}
                        </div>
                    </div>
                </div>
                {/* MODAL */}

                <ChatBody userMessage={userMessage} serverResponse={serverResponse} />
                <div className='type container-fluid type w-100 px-3 py-2 '>
                    <div className='position-relative'>
                        <div className="input-group mb-3 d-flex justify-content-center w-100">
                            <button onClick={ModalClose} data-bs-toggle="modal" data-bs-target="#exampleModal" type="button" className="btn btn-outline-light">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                    <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                                </svg>
                            </button>
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
