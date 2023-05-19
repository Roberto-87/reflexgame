import { useEffect, useState } from "react";
import swal from 'sweetalert'
import imagesName from './images';
import Swal from "sweetalert2"


function getRandomColor() {
  const r = Math.floor(Math.random() * 256); // componente rojo aleatorio
  const g = Math.floor(Math.random() * 256); // componente verde aleatorio
  const b = Math.floor(Math.random() * 256); // componente azul aleatorio
  const hex = "#" + r.toString(16) + g.toString(16) + b.toString(16); // construir código hexadecimal
  return hex;
}



function App() {
  const[status, setStatus]= useState('initial')
 const[counter, setCounter]=useState(0)
 const[intervalStatus, setIntervalStatus]= useState(null)
 const[position, setPosition]= useState([Math.floor(Math.random()*100),Math.floor(Math.random()*100)])
const [score, setScore]= useState(0)
const [colorChange, setColorChange]= useState(Math.floor(Math.random()*100))
const [color, setColor] = useState("#FFFFFF"); 
const [image, setImage] = useState(); 
const[points,setPoints]= useState([])
const[user, setUser]= useState([])
const[allCounters, setAllCounters]= useState([])  
const [notification, setNotification]= useState(false)
const [flashVisible, setFlashVisible] = useState(false);

 const onHandlerClick=()=>{
   setStatus('playing')
  setCounter(0)
    const intervalTime= setInterval(() => {
      setCounter((prevStatus)=> prevStatus+1)
      
    }, 100);
    

    setIntervalStatus(intervalTime)
 }

 let scoreString = localStorage.getItem('scoreString') || '';

 useEffect(() => {

  Swal.fire({
    html: "<div class='play-container' ></div>",
    background:  'url(/images/trees.png)',
    color:'black',
    width:'480',
    showConfirmButton: false,
       backdrop: `
      rgba(78, 72, 73, 0.098)
      url("https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGY1NTBjMTBhYzcwYmQ4MzA2YzIxODliNDk3NjJiMWI1Nzk4ZWNjZSZlcD12MV9pbnRlcm5hbF9naWZzX2dpZklkJmN0PWc/wxKg0LHH01VWCRnilt/giphy.gif")
       center
      no-repeat
    `
  });
  const timeoutId = setInterval(function () {
    setPosition([Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]);
    setColor(getRandomColor());
    setColorChange((prevColor) => prevColor * 10);
    setImage(Math.floor(Math.random() * imagesName.length));

  }, 2000);
  return () => clearTimeout(timeoutId);
}, []);


  const onHandlerClickFinish=()=>{
   setStatus('finished')
   clearInterval(intervalStatus)


} 

//prueba deploy
const onHandlerClickBall=()=>{
  setAllCounters([...allCounters, ((counter/10 )+ 2)])

  setFlashVisible(true);
  setTimeout(() => {
    setFlashVisible(false);
  }, 500);

  if (score >= 4 && allCounters.length >= 4) {
    const lastDifference = allCounters[allCounters.length - 1] - allCounters[allCounters.length - 2];
    const previousDifference = allCounters[allCounters.length - 3] - allCounters[allCounters.length - 4];
  
    if (lastDifference < previousDifference) {
      setTimeout(() => {
        setNotification(true);
      }, 500);
      setNotification(false);
    }
  }


  if(score===9){
    setStatus('finished')
    onHandlerClickFinish()
    setPoints([...points, counter])
    setScore(0)
   
    swal({
      title: "Write your NickName here:",
      content: {
        element: "input",
        
        attributes: {
          type: "text",
          placeholder: "Enter your NickName",
        },
      },
    }).then((value) => {
    setUser([...user,{name: value, score: counter }])
 
      const previousScore = points.map(p=>p) 
 
      if(previousScore.length){
        swal(`The previous score was: ${previousScore.at(-1)/10}\n${value} your time ${counter/10} seconds 🙌!`);
      } else {
        if(value){
          swal(`${value} your time ${counter/10} seconds 🙌!`);

        }else {
          swal("You didn't enter your nickname 😞")
        }
      }
    }).then(()=>{
      setCounter(0)
      setNotification(false)
    });

  }
  setColor(getRandomColor());
  setColorChange((prevColor)=>prevColor*10)
  setScore((prevScore)=>prevScore + 1 )
  setPosition([Math.floor(Math.random()*100),Math.floor(Math.random()*100)])
  setImage(Math.floor(Math.random() * imagesName.length))

}
/* 
const randomIndex = Math.floor(Math.random() * imagesName.length); */


const onHandlerScore = () => {


  if(user){
    for (let key in user) {
      scoreString += `${user[key].name || 'Anonimous'}: ${user[key].score/10} Seconds \n`;
    }
    localStorage.setItem('scoreString', scoreString);
    swal(scoreString);
  }   if(scoreString==='') {
    swal("Nada por aquí!");
  }
}

  return (
    

    <main /*  style={{background:'linear-gradient(97deg, rgba(255,0,96,1) 0%, rgba(138,88,88,1) 100%)'}} */ >
      <header  style={{border:'2px black'}}>
        {status === "playing" &&  <h2>{counter / 10} Seconds</h2>}
        { <button onClick={onHandlerScore}>Last score</button>} 
      </header>
      
      <section style={{position:'relative', marginLeft:'5%', marginRight:'5%',padding:'3px' }}>
        {  status==='playing' && 
         <figure  onClick={onHandlerClickBall} style={{top:`${position[0]}%`, left:`${position[1]}%`, position:'absolute',color:'black',/* background:`${color}` */}}> 
         <img src={`./images/${imagesName[image]}`} alt=""  /> </figure>}
        {notification && <p>Good streak! </p>}
    
      </section>
      <footer>  
       {status==='initial' &&  <button onClick={onHandlerClick}>Play</button>

         }

       {status==='finished' &&  <button onClick={onHandlerClick} style={{
      backgroundColor: "green",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "centerAnimation 0.5s ease-out forwards",
    }}>New Game</button>}
       {status==='playing' &&  <button onClick={onHandlerClickFinish}>Finish</button>}
       {status==='finished' && counter !== 0 && <p>{counter/10} Seconds</p>}
        </footer>
    </main>
  );
}

export default App;
