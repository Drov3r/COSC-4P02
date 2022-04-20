import send from './icons/plane-blue.png'
import trophy from './icons/trophy.png'
import athlete from './icons/athlete.png'
import link from './icons/link.png'
import logo from './icons/botlogo.png'
import logoBig from './icons/bot.png'
import battery from './icons/battery.png'
import { useEffect, useState, useRef } from 'react';
import Chat from './Chat'
import {HelmetProvider, Helmet} from 'react-helmet-async'
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
  const [frameRate, setFrameRate] = useState(false)
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
    clearText()
    setChat(false)
  }
  //var speed 
  function toggleFrameRate(){
    
    //if(!frameRate){
     // document.getElementById("d").style.animationDuration = "5s";
      //speed = "5s"
    //}
    //console.log(document.getElementById("d"))
    //speed = "2s"
    setFrameRate(!frameRate)
  }

  function hamburgerMenu(){

    const color = 'white'
    return(
      <div style={{width:'40px', height:'40px', display:'flex', justifyContent:'center', alignItems:'center', }}>
        <a onClick={()=>clickMenu()} style={{cursor:'pointer'}}>
        <div style={{width:'35px', height:'3px', backgroundColor:color, transform:click?'rotate(-135deg) translateY(-7px) translateX(-7px)':'none', transition:frameRate?'1s':'0.2s'}}>

        </div>
        <div style={{width:'35px', height:'3px', marginBottom:'7px',marginTop:'7px', backgroundColor:color, transform:click?'scaleX(0)':'none', transition:frameRate?'1s':'0.2s'}}>

        </div>
        <div style={{width:'35px', height:'3px', backgroundColor:color, transform:click?'rotate(-45deg) translateY(-7px) translateX(7px)':'none', transition:frameRate?'1s':'0.2s'}}>

        </div>
        </a>
      </div>
    )
  }
  
  /*
  Displays the header dynamically, based on whether we are in chat screen or not
  */
  function displayHeader(){
      if(!showChat){
      return(
        <div style={{position:'absolute', top:0, left:0, height:'10%', width:'100%', backgroundColor:'#004F71'}}>
          <div>
            {/* Label and Icon */}
            <div style={{position:'absolute', top:'0', left:'0', height:'100%', width:'100%', }}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                  <img src={logo} width={'200px'}/>
              </div>
            </div>

            {/* Menu Button */}
            <div style={{position:'absolute', top:'0', left:'0', width:'15%', height:'100%'}}>
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                {/*<Hamburger color={'white'} onToggle={()=>clickMenu()}/>*/}
                {hamburgerMenu()}
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
          <div className="menuItems" style={{position:'absolute', top:'10%', left:0, width:'100%', height:'90%'}}>
            <h1 style={{fontSize:'40px', color:'#004F71', marginTop:'50px', marginLeft:'10%'}}>Settings</h1>
            <div className="bar"> </div>
            <div style={{width:'90%', marginLeft:'10%',marginTop:'25px', height:'60px', }}>
              
              <a onClick={()=>toggleFrameRate()} style={{display:'flex', justifyContent:'left', alignItems:'center',height:'100%', cursor:'pointer'}}>
                <div style={{height:'100%', display:'flex', justifyContent:'center', alignItems:'center'}}>
                  <img src={battery} style={{width:'45px',  }}/>
                  <h1 style={{fontSize:'25px', color:'#004F71',marginLeft:'15px',}}>Toggle Frame Rate</h1>
                  <div style={{width:'80px', height:'40px',backgroundColor:frameRate?'#2ECC71':'lightgrey', borderRadius:'30px', border:'3px solid #004F71', marginLeft:'15px'}}>
                    <div style={{height:'100%',width:'100%', display:'flex', justifyContent:frameRate?'right':'left', alignItems:'center'}}>
                      <div style={{width:'35px', height:'35px',marginLeft:'10px',marginRight:'10px', backgroundColor:'white', borderRadius:'100px'}}>
                      </div>
                    </div>
                  </div>
                  <h1 style={{fontSize:'20px', color:'#004F71',marginLeft:'15px',}}>{frameRate?'(slow)':'(fast)'}</h1>
                </div>
              </a>
            </div>
          </div>
      )
  }

  function displayBody(){

    return (
          <div style={{position:'absolute', left:0, top:'10%', height:'90%', width:'100%',overflow:'auto' }}>
            <div style={{ display:'flex', justifyContent:'center', alignItems:'flex-start', height:'100%', }}>
              <div>

                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', margin:'25px', marginTop:window.innerHeight>700?'100px':'10%'}}>
                  <img src={logoBig} width={'300px'}/>
                </div>

                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', margin:'25px'}}>
                  <h1 style={{fontSize:'17px'}}>
                    Hi, I'm Badger Bot. Ask me your questions relating to the 2022 Canada Summer Games in Niagara Canada.
                  </h1>
                </div>
                                  
                <div className="chatBar" style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%',width:'100%' }}>
                  {/* Clear message button*/}
                  <button  className={frameRate?'slow':'fast'} onClick={()=>clearText()}
                    style={{width:'80px', height:'52px', borderRadius:'15px', border:'1px solid red', borderTopRightRadius:'0px',borderBottomRightRadius:'0px',
                    border:'1px solid red', backgroundColor:'red', color:'white', marginLeft:'-25px',
                    fontSize:'14px', fontWeight:'bold', cursor:'pointer' }}>
                      <h1 style={{fontSize:'18px', margin:'0px'}}>
                        Clear
                      </h1>
                  </button>

                  {/* Text Input */}
                  {displayMessageInput()}

                  {/* Send Message Button*/}
                  <img onClick={()=>sendMessageOpenChat()} src={send} style={{width:'30px',marginLeft:'-50px',cursor:'pointer', }}/>
                </div>

                <div style={{ display:'flex', justifyContent:'center', alignItems:'center', margin:'25px'}}>
                    <button className={frameRate?'slow':'fast'} onClick={()=>setShowChat()}
                    style={{width:'200px', height:'60px', borderRadius:'3px', cursor:'pointer',
                    border:'1px solid red', backgroundColor:'red', color:'white', 
                    fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <h1 style={{fontSize:'24px', margin:'0px'}}>
                        Chat With Us
                      </h1>
                    </button>
                </div>

                <div className="links" style={{ display:'flex', paddingTop:'3%', justifyContent:'space-evenly', alignItems:'center'}}>
                <button onClick={(e) => {
                        e.preventDefault();
                        window.location.href='https://niagara2022games.ca/'}}
                    style={{width:'5em', height:'110px', borderRadius:'15px', cursor:'pointer', 
                   backgroundColor:'#00263D', color:'white', border:'1px solid #00263D',
                    fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <img src={link} style={{width:'40px', marginBottom:'-7px'}}/>
                      <h1 style={{fontSize:'20px', margin:'5px',}}>Main Site</h1>
                    </button>
                
                    <button onClick={(e) => {
                        e.preventDefault();
                        window.location.href='https://cgc.gems.pro/AlumCgc/Alumni/FindAlumni_List.aspx?UseSessionState=Y&ShowAll=Y'}}
                    style={{width:'5em', height:'110px', borderRadius:'15px', cursor:'pointer',  
                     backgroundColor:'#00263D', color:'white', border:'1px solid #00263D',
                    fontSize:'24px', fontWeight:'bold', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)' }}>
                      <img src={athlete} style={{width:'40px', marginBottom:'-7px'}}/>
                      <h1 style={{fontSize:'20px', margin:'5px'}}>Athletes</h1>
                    </button>

                    <button onClick={(e) => {
                        e.preventDefault();
                        window.location.href='https://niagara2022games.ca/events/'}}
                    style={{width:'5em', height:'110px', borderRadius:'15px', cursor:'pointer',
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
            <div style={{width:'100%', height:'15%', backgroundColor:'white'}}>
                {/* Spacing */}
            </div>
          </div>
          
    )
  }


  function displayPages(){

    /* Check chat is clicked */
    if(showChat){
      /* Show Chat Box Page */

      return <Chat setBackButton={callbackBackButton} homePageMsg={newMsg} frameRate={frameRate}/>

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
      <div style={{width:'60%', height:'100%',display:'flex', justifyContent:'center', alignItems:'center'}}>
        <input value={newMsg} 
        onChange={setNewMsgFunction} 
        onKeyDown={enterButtonClicked} 
        placeholder={'Ask Me Anything!'} 
        
        style={{borderRadius:'20px', width:'100%', height:'50px',paddingLeft:'20px', borderBottomLeftRadius:'0px', borderTopLeftRadius:'0px',
        resize:'none', outlineColor:'#004F71', outlineWidth:'2px', borderStyle:'solid', paddingRight:'70px', cursor:'pointer',
        borderWidth:'0px', borderColor:'#E0E0E0', backgroundColor:'#E0E0E0', fontFamily:'Oswald', fontSize:'24px', outlineStyle:'none'}}
        />
      </div>
    ) 

}

function setNewMsgFunction(e){

  setNewMsg(e.target.value)

}

function enterButtonClicked(e){

  if(e.keyCode == 13){
    setChat(true)
    //setNewMsg("")
  }
}

function clearText(){
  setNewMsg("")
}

function sendMessageOpenChat(){
  setChat(true)
  //setNewMsg("")
}



 


  /*
  MAIN render Loop
  */
  return (
    <div style={{height:'100%', width:'100%', backgroundColor:'white', }}>
           <HelmetProvider>
            <Helmet>
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>
          </HelmetProvider>
        {displayPages()}
    </div>
  );
}

export default App;

