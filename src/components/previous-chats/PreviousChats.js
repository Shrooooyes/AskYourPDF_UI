import React from 'react';


const PreviousChats = (props) => {
  return (
    <div className='prev-chats conatiner p-2'>
      <span className='fs-4'>
      <p class="text-center">Previous Chats</p>
      </span>
      <div className='text-light'>
        {JSON.stringify(props.chats)}
      </div>
    </div>
  );
}

export default PreviousChats;
