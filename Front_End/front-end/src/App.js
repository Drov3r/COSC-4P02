import logo from './logo.svg';
import './App.css';

import menu from './icons/menu-black.png'
import send from './icons/plane-red.png'

import { useEffect, useState } from 'react';


function App() {

  // initialize our click state variable to 'false'
  // 'click' is the variable we can access, 'setClick' is our "setter function"
  const [click,setClick] = useState(false) 
  const [newMsg,setNewMsg] = useState("") 

  // function to handle the menu clicks
  function clickMenu(){

      setClick(!click)
      //console.log(click)

  }

  /*
  This function is called whenever this component (App.js) does a re-render. A change in state variables will cause/force a re-render.
  */
  useEffect(()=>{

  })

  function chatLogs(){

      return(
          <div>
            <div style={{marginTop:'25px',borderRadius:'70px', width:'70%', padding:'15px', margin:'3%', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', }}>
              <h3 style={{fontSize:'20px', color:'#EB5757', fontWeight:'400', fontFamily:'Arial'}}>Some Text</h3>
            </div>
          </div>
      )
  }

  function menuItems(){

      return(
          <div>
            <h1 style={{fontSize:'40px', color:'#EB5757', margin:'10%'}}>Menu</h1>
          </div>
      )
  }

  function enterMessage(){

      return(
          <input value={newMsg} 
          onChange={setNewMsgFunction} 
          placeholder={'Message'} 
          
          style={{marginLeft:'5%',borderRadius:'70px', width:'90%', height:'40px', 
          resize:'none', outlineColor:'#EB5757', outlineWidth:'2px', borderStyle:'solid', 
          borderWidth:'2px', borderColor:'#EB5757', fontFamily:'Arial' }}
          />
      ) 

  }

  function setNewMsgFunction(e){
      setNewMsg(e.target.value)
      console.log(e.target.value)
  }

  function sendMsg(){

    console.log("send")

  }



  return (
    <div style={{height:'100%', width:'100%', backgroundColor:'white'}}>
        
        {/* Header */}
        <div style={{position:'absolute', top:0, left:0, height:'10%', width:'100%', backgroundColor:'#EB5757', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)'}}>
          
            {/* Menu Bar */}
            <div style={{position:'absolute', top:'25%', right:'5%',}}>
              
              {/* Wrap menu img in clickable tag */}
              <a onClick={()=>clickMenu()}> 
                <img src={menu} style={{width:'40px', transform: click==true?"rotate(90deg)":'none', transition:'all 0.25s ease-in-out'}}/>
              </a>
            
            </div>

        </div>

        {/* Body */}
        {   /* IF */
          click == true ?  
              
              <div style={{position:'absolute', top:'10%', left:0, height:'90%', width:'100%', }}>
                    
                    {menuItems()}
                    
              </div>

          : /* ELSE */
              
              <>
              <div style={{position:'absolute', top:'10%', left:0, height:'80%', width:'100%', }}>
                    
                    {chatLogs()}

              </div>

              <div style={{position:'absolute', bottom:0, left:0, height:'10%', width:'100%', backgroundColor:'white', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)'}}>
                    
                    <div style={{height:'100%', width:'100%',}}>
                    
                      <div style={{display:'inline-block', width:'60%',height:'100%', }}>
                        
                        {enterMessage()}

                      </div>

                      <div style={{display:'inline-block', width:'15%',height:'100%',  marginLeft:'2%',}}>
                        
                        {/* Send Message Button*/}
                        <a onClick={()=>sendMsg()}> 
                          <img src={send} style={{width:'40px',paddingTop:'30%'}}/>
                        </a>

                      </div>

                    </div>

              </div>
              </>}
    </div>
  );
}

export default App;

