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
  const [dialogue,setDialogue] = useState([{message:'hey, im badger bot', bot:true, }])

  // function to handle the menu clicks
  function clickMenu(){

      setClick(!click)

  }

  /*
  This function is called whenever this component (App.js) does a re-render. A change in state variables will cause/force a re-render.
  */
  useEffect(()=>{
        
  })

  function chatLogs(){

    const divItUp = dialogue.map(function(data, index) {
      
      if(data.bot==true){
        return (
          <div>
          <div style={{marginTop:'25px',borderRadius:'70px', width:'70%', padding:'15px', margin:'3%', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', }}>
            <h3 style={{fontSize:'20px', color:'#EB5757', fontWeight:'400', fontFamily:'Arial'}}>{data.message}</h3>
          </div>
        </div>
        )
      }else{
        return (
          <div>
          <div style={{marginTop:'25px',borderRadius:'70px', width:'70%', padding:'15px', margin:'3%', marginLeft:'21%', boxShadow:'1px 1px 3px 1px rgba(0,0,0,0.71)', }}>
            <h3 style={{fontSize:'20px', color:'#EB5757', fontWeight:'400', fontFamily:'Arial'}}>{data.message}</h3>
          </div>
        </div>
        )
      }
      
    })

      return divItUp
      
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
          id={'search'}
          style={{marginLeft:'5%',borderRadius:'70px', width:'90%', height:'40px', 
          resize:'none', outlineColor:'#EB5757', outlineWidth:'2px', borderStyle:'solid', 
          borderWidth:'2px', borderColor:'#EB5757', fontFamily:'Arial' }}
          />
      ) 

  }

  function setNewMsgFunction(e){
      setNewMsg(e.target.value)
  }

  function sendMsg(){

    // copy the global array
    const data = dialogue
    
    // human msg
    // create a message object, get the message from the newMsg state, which is set in input tag
    const newHumanMessage = {message:newMsg, bot:false}
    // push new message object to array
    data.push(newHumanMessage)

    // auto bot msg
    // create a message object, get the message from the newMsg state, which is set in input tag
    const newBotMessage = {message:"Im not smart yet. Soon though.", bot:true}
    // push new message object to array
    data.push(newBotMessage)

    // set the state with the new array
    setDialogue(data)

    

    // empty the text input
    setNewMsg('')
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
              <div style={{position:'absolute', top:'10%', left:0, height:'80%', width:'100%', overflow:'scroll'}}>
                    
                    {chatLogs()}

              </div>

              <div style={{position:'absolute', top:'90%', left:0, height:'10%', width:'100%', backgroundColor:'white', boxShadow:'-3px 1px 18px -2px rgba(0,0,0,0.71)', overflow:'hidden'}}>
                    
                    <div style={{height:'100%', width:'100%',backgroundColor:'white'}}>
                    
                      <div style={{position:'absolute', top:'0', left:0, height:'100%',width:'65%',padding:'3%',  }}>
                        
                        {enterMessage()}

                      </div>

                      <div style={{position:'absolute', top:'0', left:'70%', height:'100%',width:'30%',padding:'3%',  }}>
                        
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

