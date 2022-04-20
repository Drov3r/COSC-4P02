import menu from './icons/menu-black.png'
import send from './icons/plane-blue.png'
import logo from './icons/botlogo.png'
import logoBig from './icons/bot.png'
import trophyImg from './icons/trophy.png'
import locationImg from './icons/athlete.png'
import linkImg from './icons/link.png'
import bIcon from './icons/badger-blue.png'
import backButton from './icons/back-button.png'
import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import TextLoad from './LoadingWheel.js'
import './App.css';
import { CopyToClipboard } from "react-copy-to-clipboard";

/*
This is where all the developed code for the apps front end is
*/
function Chat({setBackButton, homePageMsg, frameRate}) {

  // initialize our click state variable to 'false'
  // React Hooks: 'click' is the variable we can access, 'setClick' is our "setter function"
  const [click,setClick] = useState(false) 
  const [newMsg,setNewMsg] = useState("") 
  const [dialogue,setDialogue] = useState([{message:'Hello, I\'m Badger Bot', bot:true, }])
  const [loadingWheel, setLoadingWheel] = useState(false);
  const scrollReference = useRef()
  const uuid = uuidv4();
  const [hover, setHover] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyText, setCopyText] = useState("")
  var link = "https://niagara2022games.ca/"

  /*
  This function is called whenever this component (Chat.js) does a re-render. A change in state variables will cause/force a re-render.
  */
  useEffect(()=>{
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

  function goLink(){
    window.open(link, '_blank').focus();
  }

  function setLink(linker){
    link = linker
    var x = document.getElementById("urlBTN");
    x.style.visibility = 'visible';
  }

  function closeButtons(){
    var x = document.getElementById("urlBTN");
    x.style.visibility = 'hidden';

  }

  function copyChat(currentDialogue){
    let text = ""
    for(let i = 0; i<currentDialogue.length; i++){
        if(currentDialogue[i].bot){
          text = text.concat(`\nBadger Bot: ${currentDialogue[i].message}`)
        }else{
          text = text.concat(`\nUser: ${currentDialogue[i].message}`)
        }
    }
   
   /* 
   //DEPRECATED
   try{
      if('clipboard' in navigator){
        navigator.clipboard.writeText(text)
      }else{
        document.execCommand('copy', true, text)
      }
    }catch(err){
      console.log(err)
    }*/
    
    setCopyText(text)
    
   // console.log(text,"\n\n\n\n",copyText)
    
  }

  /*
  This function scrolls the dialogue box to the bottom whenever a new message is added
  */
  function scrollToBottom(){
   
      scrollReference.current?.scrollIntoView({ behavior: frameRate?'auto':'smooth' })
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
      return <TextLoad color="#004F71" height={80} width={80} frameRate={frameRate} />
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
      // force a re-render
      clearText()

      // turn the loading wheel on
      setLoadingWheel(true)
      const loadingData = dialogue
      const blankBotMessage = {message:"#loading", bot:true,}
      loadingData.push(blankBotMessage)
      setDialogue(loadingData)
      

      // empty the text input
      setNewMsg(' ')

      let msg = ""

      // measure the time it takes to make a request
      var dateStart = new Date();
      var timeStart = dateStart.getTime();
     
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
      
      
      // RIGHT HERE CHECK MESSAGE IF YES GO 

      var dateFinish = new Date();
      var timeFinish = dateFinish.getTime();
      var difference = timeFinish-timeStart
      
      // always display loading indicator for at least 1.5 seconds. if the reponse takes longer than 1.5 sec, do not delay disappearance of loading indicator
      if(difference<1500){

      /* Turn the loading wheel off, display bot msg */
      setTimeout(()=>{
        // new bot msg
        // create a message object, get the message from the post request
        const newBotMessage = {message:msg, bot:true}
        // push new message object to array
        data.push(newBotMessage)

        /* remove loading wheel bubble */
        const newData = data.filter((log)=>{
          if(log.message!='#loading'){
            return log
          }
        })
        setLoadingWheel(false)

        // set the state with the new array with bot msg
        setDialogue(newData)
        setCopied(false)
        copyChat(newData)
        
     },2000)

    }else{
      // new bot msg
        // create a message object, get the message from the post request
        const newBotMessage = {message:msg, bot:true}
        // push new message object to array
        data.push(newBotMessage)

        /* remove loading wheel bubble */
        const newData = data.filter((log)=>{
          if(log.message!='#loading'){
            return log
          }
        })
        setLoadingWheel(false)

        // set the state with the new array with bot msg
        setDialogue(newData)
        setCopied(false)
        copyChat(newData)
    }

     scrollToBottom()
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
        if(data.message=='#loading'){
          closeButtons()
         /* Bot Loading bubble */
         return ( <div className="loadBlock" key={index} style={{display:'block',width:'50%', marginLeft:'10%', marginBottom:'25px', }}>
            <div style={{position:'relative', top:'17px', left:0, marginLeft:'-17px', width:'40px', border:'3px solid #004f71', borderRadius:'40px', height:'40px', backgroundColor:'white'}}>
              <div style={{display:'flex', maxWidth:'max-content', justifyContent:'center', alignItems:'center', width:'40px', height:'40px'}}>
                <img src={bIcon} width={'30px'}/>
              </div>
            </div>
            <div style={{display:'flex', maxWidth:'max-content' ,justifyContent:'center', alignItems:'center', wdith:'50%',minHeight:'90px', borderRadius:'20px', backgroundColor:'white',boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)',overflow:'hidden'}}>
              <h3 style={{padding:'25px',fontSize:'20px', color:'#004F71', fontWeight:'400', fontFamily:'Oswald', wordBreak:'break-word'}}>
              {displayLoadingWheel()}
              </h3>
            </div>
          </div>)
        }else{
        /* Bot MSG bubble */
          var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
          if(data.message.match(urlRegex)){
            setLink(data.message.match(urlRegex))
          }
          return (
            <div key={index} style={{display:'block',width:'50%', marginLeft:'10%', marginBottom:'25px', }}>
              <div style={{position:'relative', top:'17px', left:0, marginLeft:'-17px', width:'40px', border:'3px solid #004f71', borderRadius:'40px', height:'40px', backgroundColor:'white'}}>
                <div style={{display:'flex', justifyContent:'center', alignItems:'center', width:'40px', height:'40px'}}>
                  <img src={bIcon} width={'30px'}/>
                </div>
              </div>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', maxWidth:'max-content',minHeight:'90px', borderRadius:'20px', backgroundColor:'white',boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)',overflow:'hidden'}}>
                <h3 style={{padding:'15px',fontSize:'20px', color:'#004F71', fontWeight:'400', fontFamily:'Oswald', wordBreak:'break-word'}}>
                  {data.message}
                </h3>
              </div>
            </div>
          )
        }
      }else{
        /* Human MSG bubble */
        return (
          <div key={index} style={{display:'block', width:'60%',marginLeft:'30%', marginBottom:'25px',   }}>
            <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center',}}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center',borderRadius:'20px', maxWidth:'max-content',minHeight:'90px',minWidth:'50px', backgroundColor:'rgb(0 79 113)', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', overflow:'hidden'}}>
                <h3 style={{padding:'15px',fontSize:'20px', color:'white', fontWeight:'400', fontFamily:'Oswald',wordBreak:'break-word' }}>
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

  function showHeader(){
      return(
        <div>
          {/* Label and Icon */}
          <div style={{position:'absolute', top:'0', left:'0', height:'100%', width:'100%', }}>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                  <img src={logo} width={'200px'}/>
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
            <div style={{position:'absolute', top:'10%', left:0, height:'90%', width:'30%', overflow:'hidden',zIndex:9}}> 
              <div style={{display:'inline-block',width:'100%', height:'100%', backgroundColor:'#8DE9F6'}}>
                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100%',}}>
                  <div>
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                      <h1 style={{fontSize:'17px'}}>
                        Helpful Links
                      </h1>
                    </div>
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'start', height:'500px', overflowY:'auto' }}>
                    <div className="links">
                    <button className={frameRate?'slow':'fast'} onClick={(e) => {
                        e.preventDefault();
                        window.location.href='https://niagara2022games.ca/'}}
                        
                        style={{width:'100%', height:'30px', borderRadius:'15px', cursor:'pointer', 
                        backgroundColor:'#00263D', color:'white', border:'1px solid #00263D',marginTop:'20px',
                        fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <div style={{ display:'inline-block',}}>
                        <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                          <img src={linkImg} style={{width:'15px', marginBottom:'-7px'}}/>
                        </div>
                      </div>
                      <div style={{ display:'inline-block',height:'100%'}}>
                        <div style={{ display:'flex', justifyContent:'center', alignItems:'center',height:'100%'}}>
                        <h1 style={{fontSize:'15px', margin:'5px',}}>Main Site</h1>
                        </div>
                      </div>
                    </button>
                
                      <button className={frameRate?'slow':'fast'} onClick={(e) => {
                          e.preventDefault();
                          window.location.href='https://niagara2022games.ca/about/visit-niagara/'}}
                          style={{width:'100%', height:'30px', borderRadius:'15px', cursor:'pointer',  
                          backgroundColor:'#00263D', color:'white', border:'1px solid #00263D',marginTop:'20px',
                          fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                        <div style={{ display:'inline-block',}}>
                          <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <img src={locationImg} style={{width:'15px', marginBottom:'-7px'}}/>
                          </div>
                        </div>
                        <div style={{ display:'inline-block',height:'100%'}}>
                        <div style={{ display:'flex', justifyContent:'center', alignItems:'center',height:'100%'}}>
                          <h1 style={{fontSize:'15px', marginLeft:'5px',}}>Map</h1>
                        </div>
                        </div>
                      </button>

                      <button className={frameRate?'slow':'fast'} onClick={(e) => {
                          e.preventDefault();
                          window.location.href='https://niagara2022games.ca/events/'}}
                          style={{width:'100%', height:'30px', borderRadius:'15px', cursor:'pointer',
                          backgroundColor:'#00263D', color:'white', border:'1px solid #00263D',marginTop:'20px',
                          fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', }}>
                        <div style={{ display:'inline-block',}}>
                          <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <img src={trophyImg} style={{width:'15px', marginBottom:'-7px'}}/>
                          </div>
                        </div>
                        <div style={{ display:'inline-block',height:'100%'}}>
                        <div style={{ display:'flex', justifyContent:'center', alignItems:'center',height:'100%'}}>
                          <h1 style={{fontSize:'15px', marginLeft:'5px', }}>Events</h1>
                        </div>
                        </div>
                      </button>
                    </div>
                    </div>
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                      <CopyToClipboard text={copyText} onCopy={()=>setCopied(true)}>
                        <button className={frameRate?'slow':'fast'} disabled={copied || loadingWheel}
                          style={{width:'200px', height:'60px', borderRadius:'3px', cursor:'pointer',
                          border:'1px solid red', backgroundColor:'red', color:'white', 
                          fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                            {copied?'Copied!':'Copy chat to clipboard'}
                        </button>
                      </CopyToClipboard>
                    </div>
                    <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                    
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{position:'absolute', top:'10%', left:'30%', height:'80%', width:'70%', overflowY:'scroll',boxShadow:'rgb(0 0 0 / 71%) 0px 0px 7px -2px', zIndex:9}}> 
              <div style={{display:'inline-block',width:'100%', height:'100%', verticalAlign:'top'}}>
                {displayChatLogs()}
              </div>
            </div>
            </>
           : 
          <>
         
          <div style={{position:'absolute', top:'10%', left:0, height:'80%', width:'100%', overflowY:'scroll'}}> 
            {displayChatLogs()}
            <div style={{marginTop:'25px',marginBottom:'25px'}}>
              <div style={{ display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <CopyToClipboard text={copyText} onCopy={()=>setCopied(true)}>
                      <button className={frameRate?'slow':'fast'} disabled={copied || loadingWheel}
                        style={{width:'200px', height:'60px', borderRadius:'3px', cursor:'pointer',
                        border:'1px solid red', backgroundColor:'red', color:'white', 
                        fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                          {copied?'Copied!':'Copy chat to clipboard'}
                      </button>
                  </CopyToClipboard>
              </div>
            </div>
          </div></>}
          <div className='urlBTN' id="urlBTN">
            <div onClick={()=>closeButtons()} className='noSite'><h1>Stay On Site</h1></div>
            <div onClick={()=>goLink()} className='goSite'><h1>Take Me There</h1></div>
          </div>
          <div style={{position:'absolute', top:'90%', left: !mobile ?'30%':0, height:'10%', width:!mobile ?'70%':'100%', backgroundColor:'white', boxShadow:'1px 0px 3px 0px rgba(0,0,0,0.71)', overflow:'hidden', zIndex:9}}>
            <div style={{height:'100%', width:'100%',backgroundColor:'white', display:'flex', justifyContent:'center', alignItems:'center',}}>

                <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%',width:'100%' }}>
                  
                  {/* Clear message button*/}
                  <button className={frameRate?'slow':'fast'} onClick={()=>clearText()}
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
            </div>

          </div>
        </div>
      )
    }
  
  }

  function displayAltMessageInput(){

    return(
      <div style={{width:'75%', height:'100%',display:'flex', justifyContent:'center', alignItems:'center'}}>
        <input value={newMsg} disabled={loadingWheel}
        onChange={setNewMsgFunction} 
        onKeyDown={enterButtonClicked} 
        placeholder={'Message'} 
        
        style={{borderRadius:'20px', width:'100%', height:'50px',paddingLeft:'20px', borderBottomLeftRadius:'0px', borderTopLeftRadius:'0px',
        resize:'none', outlineColor:'#004F71', outlineWidth:'2px', borderStyle:'solid', paddingRight:'70px', cursor:'pointer',
        borderWidth:'0px', borderColor:'#E0E0E0', backgroundColor:'#E0E0E0', fontFamily:'Oswald', fontSize:'24px', outlineStyle:'none'}}
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
        
    </div>
  );
}

export default Chat;

