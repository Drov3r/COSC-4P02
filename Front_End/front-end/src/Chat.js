import menu from './icons/menu-black.png'
import send from './icons/plane-blue.png'
import logo from './icons/logo1.png'
import logoBig from './icons/logo2.png'
import backButton from './icons/back-button.png'
import { useEffect, useState, useRef } from 'react';
import Hamburger from 'hamburger-react'
import { TailSpin } from  'react-loader-spinner'
import { v4 as uuidv4 } from 'uuid';

/*
This is where all the developed code for the apps front end is
*/
function Chat({setBackButton}) {

  // initialize our click state variable to 'false'
  // React Hooks: 'click' is the variable we can access, 'setClick' is our "setter function"
  const [click,setClick] = useState(false) 
  const [newMsg,setNewMsg] = useState("") 
  const [dialogue,setDialogue] = useState([{message:'Hello, Im Badger Bot', bot:true, }])
  const [loadingWheel, setLoadingWheel] = useState(false);
  const scrollReference = useRef()
  const uuid = uuidv4();
  const [hover, setHover] = useState(false)

  /*
  This function is called whenever this component (App.js) does a re-render. A change in state variables will cause/force a re-render.
  */
  useEffect(()=>{
        // currently not being used 
        document.title = "Boomer Bot"
  })

  /* Setter function to handle the menu clicks */
  function setBackButtonClick(){

    setBackButton()
  }

  function hoverEffect(value){
    setHover(value)
  }

  /*
  This function scrolls the dialogue box to the bottom whenever a new message is added
  */
  function scrollToBottom(){
   
      scrollReference.current?.scrollIntoView({ behavior: 'smooth' })
  }

  /*
  Setter function sets the data from the html input tag to the global array
  */
  function setNewMsgFunction(e){

    setNewMsg(e.target.value)

  }

  /*
  This function checks whether the keyboard button clicked is 
  equivalent to the 'enter' button
  */
  function enterButtonClicked(e){

    if(e.keyCode == 13){
      sendMsg()
    }
  }

  /*
  This function displays a loading wheel while the loadingWheel 
  variable is set to true (during post requests)
  */
  function displayLoadingWheel(){
    if(loadingWheel==true){
      return <TailSpin color="#004F71" height={80} width={80} />
    }       
  }

  /*
  This function does a post request to the java server to send the 
  msg to the NLP and recives a response, then adds both the human 
  msg and the response to the array of dialogue messages. the array is 
  mapped in the main renderer
  */
  async function sendMsg(){

    // turn the loading wheel on
    setLoadingWheel(true)

    // get the human message
    const humanMsg = newMsg
    // copy the global array of messages
    const data = dialogue  
    // create a message object, get the message from the newMsg state, which is set in input tag
    const newHumanMessage = {message:humanMsg, bot:false}
    // push new message object to array
    data.push(newHumanMessage)
    // set the state with the new array with new human msg
    setDialogue(data)

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

      // auto bot msg
      // create a message object, get the message from the newMsg state, which is set in input tag
      const newBotMessage = {message:msg, bot:true}
      // push new message object to array
      data.push(newBotMessage)

      // set the state with the new array with bot msg
      setDialogue(data)
    
      // force a re-render
      setNewMsg('')
      
      // turn the loading wheel off
      setLoadingWheel(false)

      scrollToBottom()
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

  /*
  This function returns the dialogue message using an HTML <h3> tag, wrapped in a stylized div
  */
  function displayChatLogs(){

    const divItUp = dialogue.map(function(data, index) {
      
      // if the message is from the bot, display on left, otherwise right
      if(data.bot==true){
        return (
          <div key={index} style={{display:'block',width:'50%', marginLeft:'10%', marginBottom:'25px', }}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', maxWidth:'max-content',minHeight:'90px', borderRadius:'20px', backgroundColor:'white',boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)',overflow:'hidden'}}>
              <h3 style={{padding:'15px',fontSize:'20px', color:'#004F71', fontWeight:'400', fontFamily:'Arial', wordBreak:'break-word'}}>
                {data.message}
              </h3>
            </div>
          </div>
        )
      }else{
        return (
          <div key={index} style={{display:'block', width:'60%',marginLeft:'30%', marginBottom:'25px',   }}>
            <div style={{display:'flex', justifyContent:'right', alignItems:'center', }}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center',borderRadius:'20px', maxWidth:'max-content',minHeight:'90px', backgroundColor:'#007F90', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', overflow:'hidden'}}>
                <h3 style={{padding:'15px',fontSize:'20px', color:'white', fontWeight:'400', fontFamily:'Arial',wordBreak:'break-word' }}>
                  {data.message}
                </h3>
              </div>
            </div>      
          </div>
        )
      }
      
    })

      return (
        <div>
          
          <div style={{display:'block'}}>
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>  
              <div style={{marginBottom:'25px', marginTop:'35px', marginLeft:'10%', marginRight:'10%'}}>
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <img src={logoBig} width={'200px'}/>
                </div>
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', marginTop:'25px'}}>
                  <h1 style={{fontSize:'17px'}}>
                    Hi, I'm Badger Bot. Ask me your questions relating to the 2022 Canada Summer Games in Niagara Canada.
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div style={{width:'80%', height:'3px', backgroundColor:'#007F90', marginLeft:'10%', opacity:'0.5', marginBottom:'25px'}}></div>
          
          <div style={{display:'block'}}>
            {divItUp}
          </div>

          <div ref={scrollReference}/>

        </div>)
      
  }

  /*
  This function returns the message box HTML <input> tag, wrapped in a stylized div
  */
  function displayMessageInput(){

      return(
        <div style={{width:'100%', height:'100%',display:'flex', justifyContent:'center', alignItems:'center', }}>
          <input value={newMsg} 
          onChange={setNewMsgFunction} 
          onKeyDown={enterButtonClicked} 
          placeholder={'Message'} 
          
          style={{marginLeft:'5%',borderRadius:'20px', width:'90%', height:'50px',paddingLeft:'20px', 
          resize:'none', outlineColor:'#004F71', outlineWidth:'2px', borderStyle:'solid', 
          borderWidth:'2px', borderColor:'#004F71', fontFamily:'Arial', }}
          />
        </div>
      ) 

  }

  function showHeader(){
      return(
        <div>
          {/* Label and Icon */}
          <div style={{position:'absolute', top:'0', left:'0', height:'100%', width:'100%', }}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                <img src={logo} width={'40px'}/>
                <h1 style={{fontSize:'34px', fontWeight:'bold', color:'white', marginLeft:'15px', fontFamily:'Arial', fontWeight:'200'}}>Badger Bot</h1>
            </div>
          </div>

          {/* Back Button */}
          <div style={{position:'absolute', top:'0', left:0,width:'15%', height:'100%'}}>
            <a onMouseEnter={()=>hoverEffect(true)} 
            onMouseLeave={()=>hoverEffect(false)}
            onClick={()=>setBackButtonClick()}
            style={{display:'flex', justifyContent:'center', alignItems:'center', 
            height:'100%', cursor:'pointer'}}>
              <img src={backButton} style={{width:'30px',marginLeft:hover?'-7px':'0'}}/>
            </a>
          </div>
        </div>
      )
  }

  function showBody(){

    if(click == true){
      return(
        <div>
            <div style={{position:'absolute', top:'10%', left:0, height:'90%', width:'100%', }}>
              {displayMenuItems()}
            </div>
        </div>
      )
    }else{
      return(
        <div>
          <div style={{position:'absolute', top:'10%', left:0, height:'80%', width:'100%', overflow:'scroll'}}>  
            {displayChatLogs()}
          </div>

          <div style={{position:'absolute', top:'90%', left:0, height:'10%', width:'100%', backgroundColor:'white', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)', overflow:'hidden'}}>
                
            <div style={{height:'100%', width:'100%',backgroundColor:'white', display:'flex', justifyContent:'center', alignItems:'center',}}>
            
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%',width:'85%', marginLeft:'-40px' }}>
                {displayMessageInput()}
              </div>

              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%',width:'40px',  }}>
                
                {/* Send Message Button*/}
                <a onClick={()=>sendMsg()} style={{cursor:'pointer'}}> 
                  <img src={send} style={{width:'40px', marginLeft:'20px'}}/>
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    }
  
  }


  /*
  MAIN render Loop
  */
  return (
    <div style={{height:'100%', width:'100%', backgroundColor:'white'}}>
        
        {/* Header */}
        <div style={{position:'absolute', top:0, left:0, height:'10%', width:'100%', backgroundColor:'#004F71', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)'}}>
            {showHeader()}
        </div>

        {/* Body */}
        {showBody()}

        {/* Loading Wheel */}
        <div style={{position:'absolute', top:'70%', left:0, width:'100%', display:'flex', justifyContent:'center', alignItems:'center', zIndex:10}}>
          {displayLoadingWheel()}
        </div>
    </div>
  );
}

export default Chat;

