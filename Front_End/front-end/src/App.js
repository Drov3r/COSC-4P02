import logo from './logo.svg';
import './App.css';

import menu from './icons/menu-black.png'
import send from './icons/plane-blue.png'

import { useEffect, useState } from 'react';

import Hamburger from 'hamburger-react'

import { v4 as uuidv4 } from 'uuid';

/*
This is where all the developed code for the apps front end is
*/
function App() {

  // initialize our click state variable to 'false'
  // 'click' is the variable we can access, 'setClick' is our "setter function"
  const [click,setClick] = useState(false) 
  const [newMsg,setNewMsg] = useState("") 
  const [dialogue,setDialogue] = useState([{message:'Hello, Im Badger Bot', bot:true, }])
  const [fetchRequest, setFetchRequest] = useState();

  const uuid = uuidv4();

  // Setter function to handle the menu clicks
  function clickMenu(){

      setClick(!click)
  }

  /*
  This function is called whenever this component (App.js) does a re-render. A change in state variables will cause/force a re-render.
  */
  useEffect(()=>{
        // currently not being used 
  })

  /*
  This function returns the dialogue message HTML <h3> tag, wrapped in a stylized div
  */
  function chatLogs(){

    const divItUp = dialogue.map(function(data, index) {
      
      // if the message is from the bot, display on left, otherwise right
      if(data.bot==true){
        return (
          <div>
          <div style={{marginTop:'25px',borderRadius:'20px', width:'70%', padding:'15px', margin:'3%', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', }}>
            <h3 style={{fontSize:'20px', color:'#004F71', fontWeight:'400', fontFamily:'Arial'}}>{data.message}</h3>
          </div>
        </div>
        )
      }else{
        return (
          <div>
            <div style={{marginTop:'25px',borderRadius:'20px', backgroundColor:'#007F90', width:'70%', padding:'15px', margin:'3%', marginLeft:'21%', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', }}>
              <h3 style={{fontSize:'20px', color:'white', fontWeight:'400', fontFamily:'Arial'}}>{data.message}</h3>
            </div>
          </div>
        )
      }
      
    })

      return divItUp
      
  }

  /*
  This function returns the menu header HTML <h1> tag, wrapped in a stylized div
  */
  function menuItems(){

      return(
          <div>
            <h1 style={{fontSize:'40px', color:'#004F71', margin:'10%'}}>Menu</h1>
          </div>
      )
  }

  /*
  This function returns the message box HTML <input> tag, wrapped in a stylized div
  */
  function enterMessage(){

      return(
        <div style={{width:'100%', height:'100%', }}>
          <input value={newMsg} 
          onChange={setNewMsgFunction} 
          onKeyDown={enterButtonClicked} 
          placeholder={'Message'} 
          
          style={{marginLeft:'5%',borderRadius:'70px', width:'90%', height:'40px', 
          resize:'none', outlineColor:'#004F71', outlineWidth:'2px', borderStyle:'solid', 
          borderWidth:'2px', borderColor:'#004F71', fontFamily:'Arial' }}
          />
        </div>
      ) 

  }

  /*
  Setter function sets the data from the html input tag to the global array
  */
  function setNewMsgFunction(e){

    setNewMsg(e.target.value)

  }

  /*

  */
  function enterButtonClicked(e){

    if(e.keyCode == 13){
      sendMsg()
    }
  }

  /*
  This function does a post request to the java server to send the 
  msg to the NLP and recives a response, then adds both the human 
  msg and the response to the array of dialogue messages
  */
  async function sendMsg(){

    // get the human message
    const humanMsg = newMsg

    // empty the text input
    setNewMsg(' ')

    let msg = ""
    
    const header = {
        method: "post",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ "message": humanMsg, "conversationID": uuid, "timestamp": Date.now() })
    };

    const response = await fetch("http://boomerbot.duckdns.org:8080/api/message", header)   
    
      const res = await response.json()
      
      msg = res.message

      // copy the global array
      const data = dialogue
      
      // human msg
      // create a message object, get the message from the newMsg state, which is set in input tag
      const newHumanMessage = {message:humanMsg, bot:false}
      // push new message object to array
      data.push(newHumanMessage)

      // auto bot msg
      // create a message object, get the message from the newMsg state, which is set in input tag
      const newBotMessage = {message:msg, bot:true}
      // push new message object to array
      data.push(newBotMessage)

      // set the state with the new array
      setDialogue(data)
    
      setNewMsg('')
  }


  /*
  MAIN render Loop
  */
  return (
    <div style={{height:'100%', width:'100%', backgroundColor:'white'}}>
        
        {/* Header */}
        <div style={{position:'absolute', top:0, left:0, height:'10%', width:'100%', backgroundColor:'#004F71', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)'}}>
          
            {/* Menu Bar */}
            <div style={{position:'absolute', top:'25%', right:'5%',}}>
              
              {/* Wrap menu img in clickable tag */}
              <Hamburger color={'white'} onToggle={()=>clickMenu()}/>
             {/*<a onClick={()=>clickMenu()}> 
                <img src={menu} style={{width:'40px', transform: click==true?"rotate(90deg)":'none', transition:'all 0.25s ease-in-out'}}/>
              </a>*/}
            
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
              <div style={{position:'absolute', top:'10%', left:0, height:'80%', width:'100%', overflow:'scroll'}}>
                    
                    {chatLogs()}

              </div>

              <div style={{position:'absolute', top:'90%', left:0, height:'10%', width:'100%', backgroundColor:'white', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)', overflow:'hidden'}}>
                    
                    <div style={{height:'100%', width:'100%',backgroundColor:'white'}}>
                    
                      <div style={{position:'absolute', top:'0', left:0, height:'100%',width:'80%',paddingTop:'20px', }}>
                        
                        {enterMessage()}

                      </div>

                      <div style={{position:'absolute', top:'0', left:'80%', height:'100%',width:'20%',paddingTop:'20px'  }}>
                        
                        {/* Send Message Button*/}
                        <a onClick={()=>sendMsg()}> 
                          <img src={send} style={{width:'40px',}}/>
                        </a>

                      </div>

                    </div>
              </div>
              </>}
    </div>
  );
}

export default App;

