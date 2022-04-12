import menu from './icons/menu-black.png'
import send from './icons/plane-blue.png'
import logo from './icons/logo4.png'
import logoBig from './icons/logo3.png'
import backButton from './icons/back-button.png'
import { useEffect, useState, useRef } from 'react';
import Hamburger from 'hamburger-react'
import { TailSpin } from  'react-loader-spinner'
import { v4 as uuidv4 } from 'uuid';
import TextLoad from './loadingWheel.js'
import './App.css';

/*
This is where all the developed code for the apps front end is
*/
function Chat({setBackButton, homePageMsg}) {

  // initialize our click state variable to 'false'
  // React Hooks: 'click' is the variable we can access, 'setClick' is our "setter function"
  const [click,setClick] = useState(false) 
  const [newMsg,setNewMsg] = useState("") 
  const [dialogue,setDialogue] = useState([{message:'Hello, Im Badger Bot', bot:true, }])
  const [loadingWheel, setLoadingWheel] = useState(false);
  const scrollReference = useRef()
  const uuid = uuidv4();
  const [hover, setHover] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [copied, setCopied] = useState(false)

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

    if(homePageMsg != "" && homePageMsg != " "){
      sendMsg(homePageMsg)
    }

    if(window.innerWidth>800){
      setMobile(false)
    }else{
      setMobile(true)
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[])

  function handleResize(){
    if(window.innerWidth>800){
      setMobile(false)
    }else{
      setMobile(true)
    }
  }

  /* Setter function to handle the menu clicks */
  function setBackButtonClick(){

    setBackButton()
  }

  function hoverEffect(value){
    setHover(value)
  }

  function clearText(){
    setNewMsg("")
  }

  function copyChat(){
    let text = ""
    for(let i = 0; i<dialogue.length; i++){
        if(dialogue[i].bot){
          text = text.concat(`\nBadger Bot: ${dialogue[i].message}`)
        }else{
          text = text.concat(`\nUser: ${dialogue[i].message}`)
        }
    }
    try{
      if('clipboard' in navigator){
        navigator.clipboard.writeText(text)
      }else{
        document.execCommand('copy', true, text)
      }
    }catch(err){
      console.log(err)
    }
    
    
    setCopied(true)
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
      return <TextLoad color="#004F71" height={80} width={80} />
    }       
  }

  /*
  This function does a post request to the java server to send the 
  msg to the NLP and recives a response, then adds both the human 
  msg and the response to the array of dialogue messages. the array is 
  mapped in the main renderer
  */
  async function sendMsg(msgFromHomePage){

    if( newMsg!= "" || msgFromHomePage){
      // turn the loading wheel on
      setLoadingWheel(true)

      // get the human message
      const humanMsg = msgFromHomePage ? msgFromHomePage : newMsg
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
      try{
        const header = {
            method: "post",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ "message": humanMsg, "conversationID": uuid, "timestamp": Date.now() })
        };

        const response = await fetch("http://boomerbot.duckdns.org:8080/api/message", header)   
        
        const res = await response.json()
        
        msg = res.message
      
      }catch (err){
        console.log(err)
        msg = "Could not receive a response from Badger Bot. Please make sure you are connected to the internet."
      }

      // auto bot msg
      // create a message object, get the message from the newMsg state, which is set in input tag
      const newBotMessage = {message:msg, bot:true}
      // push new message object to array
      data.push(newBotMessage)

      // set the state with the new array with bot msg
      setDialogue(data)

      // force a re-render
      clearText()
      
      // turn the loading wheel off
      setLoadingWheel(false)

      scrollToBottom()

      setCopied(false)
    }
  }

  /*
  This function returns the menu header using an HTML <h1> tag, wrapped in a stylized div
  */
  function displayMenuItems(){

      return(
          <div>
            <h1 style={{fontSize:'40px', color:'#004F71', margin:'10%', marginTop:'20%'}}>Menu</h1>
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
            <div style={{position:'relative', top:'17px', left:0, marginLeft:'-17px', width:'40px', border:'2px solid black', borderRadius:'40px', height:'40px', backgroundColor:'white'}}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'40px', height:'40px'}}>
                <img src={logo} width={'30px'}/>
              </div>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', maxWidth:'max-content',minHeight:'90px', borderRadius:'20px', backgroundColor:'white',boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)',overflow:'hidden'}}>
              <h3 style={{padding:'15px',fontSize:'20px', color:'#004F71', fontWeight:'400', fontFamily:'Oswald', wordBreak:'break-word'}}>
                {data.message}
              </h3>
            </div>
          </div>
        )
      }else{
        return (
          <div key={index} style={{display:'block', width:'60%',marginLeft:'30%', marginBottom:'25px',   }}>
            <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center',}}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center',borderRadius:'20px', maxWidth:'max-content',minHeight:'90px', backgroundColor:'#8DE9F6', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', overflow:'hidden'}}>
                <h3 style={{padding:'15px',fontSize:'20px', color:'#007F90', fontWeight:'400', fontFamily:'Oswald',wordBreak:'break-word' }}>
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
          {mobile?<></>:<div style={{height:'25px'}}></div>}
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
          
          style={{marginLeft:'2%',borderRadius:'20px', width:'90%', height:'50px',paddingLeft:'20px', 
          resize:'none', outlineColor:'#004F71', outlineWidth:'2px', borderStyle:'solid', 
          borderWidth:'2px', borderColor:'#004F71', fontFamily:'Oswald' }}
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
                <h1 style={{fontSize:'34px', fontWeight:'bold', color:'white', marginLeft:'15px', fontFamily:'Oswald', fontWeight:'200'}}>Badger Bot</h1>
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
           
          {!mobile ?
            <>
            <div style={{position:'absolute', top:'10%', left:0, height:'90%', width:'30%', overflow:'scroll',zIndex:9}}> 
              <div style={{display:'inline-block',width:'100%', height:'100%', backgroundColor:'#8DE9F6'}}>
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                  <div>
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                      <h1 style={{fontSize:'17px'}}>
                        Helpful Links
                      </h1>
                    </div>
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'500px'}}>
                    
                    </div>
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <button onClick={()=>copyChat()}
                        style={{width:'250px', height:'60px', borderRadius:'3px', cursor:'pointer',
                        border:'1px solid red', backgroundColor:'red', color:'white', fontFamily:'Oswald',
                        fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                          {copied?'Copied!':'Copy chat to clipboard'}
                        </button>
                    </div>
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{position:'absolute', top:'10%', left:'30%', height:'80%', width:'70%', overflow:'scroll',boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)', zIndex:9}}> 
              <div style={{display:'inline-block',width:'100%', height:'100%', verticalAlign:'top'}}>
                {displayChatLogs()}
              </div>
            </div>
            </>
           : 
          <>
         
          <div style={{position:'absolute', top:'10%', left:0, height:'80%', width:'100%', overflow:'scroll'}}> 
            {displayChatLogs()}
            <div style={{marginTop:'25px',marginBottom:'25px'}}>
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <button onClick={()=>copyChat()}
                        style={{width:'200px', height:'60px', borderRadius:'3px', cursor:'pointer',
                        border:'1px solid red', backgroundColor:'red', color:'white', 
                        fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                          {copied?'Copied!':'Copy chat to clipboard'}
                  </button>
              </div>
            </div>
          </div></>}

          <div style={{position:'absolute', top:'90%', left: !mobile ?'30%':0, height:'10%', width:!mobile ?'70%':'100%', backgroundColor:'white', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)', overflow:'hidden', zIndex:9}}>
                
            <div style={{height:'100%', width:'100%',backgroundColor:'white', display:'flex', justifyContent:'center', alignItems:'center',}}>

                <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%',width:'100%' }}>
                  
                  {/* Clear message button*/}
                  <button onClick={()=>clearText()}
                    style={{width:'80px', height:'52px', borderRadius:'15px', border:'1px solid red', borderTopRightRadius:'0px',borderBottomRightRadius:'0px',
                    border:'1px solid red', backgroundColor:'red', color:'white', marginLeft:'-25px',
                    fontSize:'14px', fontWeight:'bold', cursor:'pointer' }}>
                      <h1 style={{fontSize:'18px', margin:'0px'}}>
                        Clear
                      </h1>
                  </button>

                  {/* Text Input */}
                  {displayAltMessageInput()}

                  {/* Send Message Button*/}
                  <img onClick={()=>sendMsg()} src={send} style={{width:'30px',marginLeft:'-50px',cursor:'pointer', }}/>
                </div> 
              {/*<div style={{display:'flex', justifyContent:'right', alignItems:'center', height:'100%',width:'40px',}}>
                <a onClick={()=>clearText()} style={{cursor:'pointer'}}>
                  <h1 style={{color:'red', fontSize:'16px', fontWeight:'400',}}>Clear</h1>
                </a>
              </div>

              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%',width:mobile?'75%':'85%' }}>
                {displayMessageInput()}
              </div>

              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%',width:'50px'  }}>
                
                
                <a onClick={()=>sendMsg()} style={{cursor:'pointer'}}> 
                  <img src={send} style={{width:'40px', marginLeft:'5px'}}/>
                </a>
              </div> */}
            </div>

          </div>
        </div>
      )
    }
  
  }

  function displayAltMessageInput(){

    return(
      <div style={{width:'75%', height:'100%',display:'flex', justifyContent:'center', alignItems:'center'}}>
        <input value={newMsg} 
        onChange={setNewMsgFunction} 
        onKeyDown={enterButtonClicked} 
        placeholder={'Message'} 
        
        style={{borderRadius:'20px', width:'100%', height:'50px',paddingLeft:'20px', borderBottomLeftRadius:'0px', borderTopLeftRadius:'0px',
        resize:'none', outlineColor:'#004F71', outlineWidth:'2px', borderStyle:'solid', paddingRight:'70px', cursor:'pointer',
        borderWidth:'0px', borderColor:'#E0E0E0', backgroundColor:'#E0E0E0', fontFamily:'Oswald'}}
        />
      </div>
    ) 

}


  /*
  MAIN render Loop
  */
  return (
    <div style={{height:'100%', width:'100%', backgroundColor:'white'}}>
        
        {/* Header */}
        <div style={{position:'absolute', top:0, left:0, height:'10%', width:'100%', backgroundColor:'#004F71', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)', zIndex:10}}>
          {showHeader()}
        </div>

        {/* Body */}
        {showBody()}

        {/* Loading Wheel */}
        <div style={{position:'absolute', top:'70%', left:!mobile?'30%':0, width:!mobile?'70%':'100%', display:'flex', justifyContent:'center', alignItems:'center', zIndex:10}}>
          {displayLoadingWheel()}
        </div>
    </div>
  );
}

export default Chat;

