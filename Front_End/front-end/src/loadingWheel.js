
import { useEffect, useState, useRef } from 'react';
import './App.css';

/*
This is where all the developed code for the apps front end is
*/
<<<<<<< HEAD
function Chat({setBackButton, homePageMsg, frameRate}) {
=======
function Chat({setBackButton, homePageMsg}) {
>>>>>>> main

 
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
<<<<<<< HEAD
      <div className="wait">
        <div className={frameRate?"dSlow":"d"}></div>
        <div className={frameRate?"dSlow":"d"}></div>
        <div className={frameRate?"dSlow":"d"}></div>
=======
      <div className="typing">
        <div className="typing__dot"></div>
        <div className="typing__dot"></div>
        <div className="typing__dot"></div>
>>>>>>> main
      </div>
  }


  /*
  MAIN render Loop
  */
return (
<<<<<<< HEAD
  <div className="wait">
  <div className={frameRate?"dSlow":"d"}></div>
  <div className={frameRate?"dSlow":"d"}></div>
  <div className={frameRate?"dSlow":"d"}></div>
=======
  <div className="typing">
  <div className="typing__dot"></div>
  <div className="typing__dot"></div>
  <div className="typing__dot"></div>
>>>>>>> main
</div>
  );
}

export default Chat;

