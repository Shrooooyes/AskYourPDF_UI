import React, { useState, useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'
import './media-query.css'

import Chat from './components/chat/Chat';
import Uploads from './components/previous-chats/PreviousChats';
import UploadsSide from './components/previous-chats/PreviousChatSide';
import SignUp from './components/login/SignUp'


const App = () => {
  const [user, setUser] = useState({
    "userData": '',
    "chats": null
  })

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="App">
      <nav class="navbar bg-transparent">
        <div class="container-fluid w-100">

          <UploadsSide user={user.chats} />

          {
            windowWidth > 760 ? <></> : <button className="btn btn-dark" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
              <svg className='text' xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
              </svg>
            </button>
          }
          <span class=" mb-0 h3 text-white">AskYourPDF</span>
          <form className='d-flex' role="search">
            {
              user.userData === '' ?
                <button class="btn btn-outline-success" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Login</button>
                :
                <div class=" dropdown">
                  <button class="userbtn-btn btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {user['userData'].firstName}
                  </button>
                  <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#">Action</a></li>
                    <li><a class="dropdown-item" href="#">Another action</a></li>
                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </div>
            }
            <SignUp setUser={setUser} user = {user}/>
          </form>
        </div>
      </nav>
      <div className="container-fluid p-0 d-flex">
        {windowWidth <= 760 ? <></> : <Uploads chats={user['chats']} />}
        <Chat setUser = {setUser} user = {user} id = {0}/>
      </div>
    </div>
  );
}

export default App;
