import menu from './icons/menu-black.png'
import send from './icons/plane-blue.png'
import trophy from './icons/trophy.png'
import location from './icons/location.png'
import link from './icons/link.png'
import logo from './icons/logo1.png'
import logoBig from './icons/logo2.png'
import { useEffect, useState, useRef } from 'react';
import Hamburger from 'hamburger-react'
import { TailSpin } from  'react-loader-spinner'
import { v4 as uuidv4 } from 'uuid';
import Chat from './Chat'

import './App.css';

/*
This is where all the developed code for the apps front end is
*/
function App() {

  // initialize our click state variable to 'false'
  // React Hooks: 'click' is the variable we can access, 'setClick' is our "setter function"
  const [click,setClick] = useState(false) 
  const [showChat, setChat] = useState(false)
  const [newMsg,setNewMsg] = useState("") 
  /*
  This function is called whenever this component (App.js) does a re-render. A change in state variables will cause/force a re-render.
  */
  useEffect(()=>{
      document.title = "Badger Bot"
  })

  /* Setter function to handle the menu clicks */
  function clickMenu(){
    setClick(!click)
  }

  function setShowChat(){
    setChat(!showChat)
  }

  function callbackBackButton(){
    setChat(false)
  }

  /*
  Displays the header dynamically, based on whether we are in chat screen or not
  */
  function displayHeader(){
      if(!showChat){
      return(
        <div style={{position:'absolute', top:0, left:0, height:'10%', width:'100%', backgroundColor:'#004F71', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)'}}>
          <div>
            {/* Label and Icon */}
            <div style={{position:'absolute', top:'0', left:'0', height:'100%', width:'100%', }}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                  <img src={logo} width={'40px'}/>
                  <h1 style={{fontSize:'34px', fontWeight:'bold', color:'white', marginLeft:'15px', fontWeight:'200'}}>
                    Badger Bot
                  </h1>
              </div>
            </div>

            {/* Menu Button */}
            <div style={{position:'absolute', top:'0', left:'0', width:'15%', height:'100%'}}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                <Hamburger color={'white'} onToggle={()=>clickMenu()}/>
              </div>
            </div>
          </div>
        </div>
      )
      }
  }

  /*
  This function returns the menu header using an HTML <h1> tag, wrapped in a stylized div
  */
  function displayMenuItems(){

      return(
          <div>
            <h1 style={{fontSize:'40px', color:'#004F71', margin:'10%'}}>Menu</h1>
          </div>
      )
  }

  function displayBody(){

    return (
          <div style={{position:'absolute', left:0, top:'10%', height:'90%', width:'100%', }}>
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
              <div>
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <img src={logoBig} width={'170px'}/>
                </div>
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', width:'100%'}}>
                  <h1 style={{fontSize:'20px'}}>
                    Hi, I'm Badger Bot. Ask me your questions relating to the 2022 Canada Summer Games in Niagara Canada.
                  </h1>
                </div>
                
                {/*<div style={{height:'100%',paddingTop:'3%', width:'100%',backgroundColor:'white', display:'flex', justifyContent:'center', alignItems:'center',}}>*/}
                  
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%',width:'100%' }}>
                  {/* Clear message button*/}
                  <button onClick={()=>setShowChat()}
                    style={{width:'80px', height:'50px', borderRadius:'15px', border:'1px solid red', borderTopRightRadius:'0px',borderBottomRightRadius:'0px',
                    border:'1px solid red', backgroundColor:'red', color:'white', 
                    fontSize:'14px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <h1 style={{fontSize:'18px', margin:'0px'}}>Clear</h1>
                    </button>
                  {displayMessageInput()}
                  {/* Send Message Button*/}
                  <img src={send} style={{width:'30px',marginLeft:'-50px' }}/>
                </div>

                <div style={{ display:'flex', paddingTop:'3%', justifyContent:'center', alignItems:'center'}}>
                    <button onClick={()=>setShowChat()}
                    style={{width:'200px', height:'60px', borderRadius:'15px', border:'1px solid red',
                    border:'1px solid red', backgroundColor:'red', color:'white', 
                    fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <h1 style={{fontSize:'24px', margin:'0px'}}>Chat With Us</h1>
                    </button>
                </div>

                <div style={{ display:'flex', paddingTop:'3%', justifyContent:'space-evenly', alignItems:'center'}}>
                <button onClick={()=>setShowChat()}
                    style={{width:'150px', height:'110px', borderRadius:'15px', 
                   backgroundColor:'#00263D', color:'white', border:'1px solid #00263D',
                    fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <img src={link} style={{width:'40px', marginBottom:'-7px'}}/>
                      <h1 style={{fontSize:'20px', margin:'5px'}}>Main Site</h1>
                    </button>
                
                    <button onClick={()=>setShowChat()}
                    style={{width:'150px', height:'110px', borderRadius:'15px', 
                     backgroundColor:'#00263D', color:'white', border:'1px solid #00263D',
                    fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <img src={location} style={{width:'40px', marginBottom:'-7px'}}/>
                      <h1 style={{fontSize:'20px', margin:'5px'}}>Map</h1>
                    </button>

                    <button onClick={()=>setShowChat()}
                    style={{width:'150px', height:'110px', borderRadius:'15px', 
                     backgroundColor:'#00263D', color:'white', border:'1px solid #00263D',
                    fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                      <div style={{height:'100%'}}>
                        <img src={trophy} style={{width:'40px', marginBottom:'-7px'}}/>
                      <h1 style={{fontSize:'20px', margin:'5px'}}>Events</h1>
                      </div>
                      </div>
                    </button>
                  </div>
              </div>
            </div>
          </div>
    )
  }


  function displayPages(){

    /* Check chat is clicked */
    if(showChat){
      /* Show Chat Box Page */

      return <Chat setBackButton={callbackBackButton}/>

    }else{
      /* Show Home Page */

      return (

      <div>
        {/* Header*/ 
        displayHeader()} 
        
        {/* Check if menu is clicked */}
        {click == true ?  
          
          /* Show Menu Body*/
          displayMenuItems()
    
        : /* ELSE */       
          
          /* Otherwise Show Home Page Body */
          displayBody()
        }
      </div>
            
      )
      
    }

  }

  function displayMessageInput(){

    return(
      <div style={{width:'40%', height:'100%',display:'flex', justifyContent:'center', alignItems:'center'}}>
        <input value={newMsg} 
        onChange={setNewMsgFunction} 
        onKeyDown={enterButtonClicked} 
        placeholder={'Ask Me Anything!'} 
        
        style={{borderRadius:'20px', width:'100%', height:'50px',paddingLeft:'20px', borderBottomLeftRadius:'0px', borderTopLeftRadius:'0px',
        resize:'none', outlineColor:'#004F71', outlineWidth:'2px', borderStyle:'solid', paddingRight:'70px',
        borderWidth:'0px', borderColor:'#E0E0E0', backgroundColor:'#E0E0E0', fontFamily:'Oswald'}}
        />
      </div>
    ) 

}

function setNewMsgFunction(e){

  setNewMsg(e.target.value)

}

function enterButtonClicked(e){

  if(e.keyCode == 13){
    
  }
}



 


  /*
  MAIN render Loop
  */
  return (
    <div style={{height:'100%', width:'100%', backgroundColor:'white'}}>
        {displayPages()}
    </div>
  );
}

export default App;

