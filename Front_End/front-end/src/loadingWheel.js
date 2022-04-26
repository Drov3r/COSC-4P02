
import { useEffect, useState, useRef } from 'react';
import './App.css';

/*
This is where all the developed code for the apps front end is
*/
function Chat({setBackButton, homePageMsg}) {

 
  /*
  This function is called whenever this component (Chat.js) does a re-render. A change in state variables will cause/force a re-render.
  */
  useEffect(()=>{
        // currently not being used 
        document.title = "Badger Bot"
  })

  /*
  This function is called upon initialization of the component, much like a constructor
  */
  useEffect(()=>{

  },[])

  function textLoad(){
      <div className="typing">
        <div className="typing__dot"></div>
        <div className="typing__dot"></div>
        <div className="typing__dot"></div>
      </div>
  }


  /*
  MAIN render Loop
  */
return (
  <div className="typing">
  <div className="typing__dot"></div>
  <div className="typing__dot"></div>
  <div className="typing__dot"></div>
</div>
  );
}

export default Chat;

