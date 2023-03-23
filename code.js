const playerOneScore = 0;
const playerTwoScore = 0;

const connectBlocks = document.getElementsByClassName('connect-block');
const timerBtn = document.getElementsByClassName('timer')[0];
const timeField = document.getElementsByClassName('remaining-time')[0];
const turnIndicator = document.getElementsByClassName('turn-indicator')[0];

let timer=5;
let gameStatus=0;
let turn = 0;  //0 for player 1,1 for player 2

timerBtn.addEventListener('click',function(){
    StartGame();
})

function StartGame(){
    if(!gameStatus){
        timeField.innerText=timer+'s';
        Array.from(connectBlocks).forEach((block)=>{
            block.classList.add('active-block');
        });
        timerBtn.style.pointerEvents = 'none';
        gameStatus=1;
    }
    let countDownInterval = setInterval(CountDown,1000);
}

function CountDown(){
    if(timer==0){
      if(turn){
        turnIndicator.innerText="Player 1's Turn";
        timerBtn.style.backgroundColor = "var(--pink-color)";
        turn=0;
      }
      else{
        turnIndicator.innerText="Player 2's Turn";
        timerBtn.style.backgroundColor = "var(--yellow-color)";
        turn=1;
      }
      timer=5;
      timeField.innerText=timer+'s';
    }
    else{
      timeField.innerHTML = timer + 's';
      timer--;
    }
}
// window.addEventListener('mousemove',function(event){
//   const playerOneEye = document.querySelector('.player-one .eyes');
//   const playerTwoEye = document.querySelector('.player-two .eyes');
//   const x = -(window.innerWidth / 2 - event.pageX) / 200;
//   const y = -(window.innerHeight / 2 - event.pageY) / 100;
//   playerOneEye.style.transform = `translateY(${y}px) translateX(${x}px)`;
//   playerTwoEye.style.transform = `translateY(${y}px) translateX(${x}px)`;
// })

function GetOffset(element)
{
    if (!element.getClientRects().length)
    {
      return { top: 0, left: 0 };
    }

    let rect = element.getBoundingClientRect();
    let win = element.ownerDocument.defaultView;
    return (
    {
      top: rect.top + win.pageYOffset,
      left: rect.left + win.pageXOffset
    });   
}