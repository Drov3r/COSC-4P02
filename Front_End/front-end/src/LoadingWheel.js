
import { useEffect, useState, useRef } from 'react';

/*
This is where all the developed code for the apps front end is
*/
function LoadingWheel({setBackButton, homePageMsg}) {

  // initialize our click state variable to 'false'
  // React Hooks: 'click' is the variable we can access, 'setClick' is our "setter function"
  const [getter,setter] = useState(false) 
  
  /*
  This function is called whenever this component (Chat.js) does a re-render. A change in state variables will cause/force a re-render.
  */
  useEffect(()=>{
       
  })

  /*
  This function is called upon initialization of the component, much like a constructor
  */
  useEffect(()=>{

    
  },[])

  /*
  MAIN render Loop
  */
  return (
    <div style={{height:'100%', width:'100%', backgroundColor:'white'}}>
        
      
    </div>
  );
}

export default LoadingWheel;

