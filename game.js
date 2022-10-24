const canvas = document.querySelector('#game');
const viewport = document.querySelector('.viewport');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#rigth');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');


let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;
let timeStart;
let timePlayer;
let timeInterval;

const playerposition = {
  x: undefined,
  y: undefined,
};

const creamPosition = {
  x: undefined,
  y: undefined,
};

let enemyPosition = [
];

window.addEventListener('load', setCanvasSize);

function setCanvasSize() {
  canvasSize = viewport.offsetHeight
  console.log(viewport.offsetHeight);
  console.dir(canvasSize);
  canvasSize = Number(canvasSize.toFixed(3));

  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = canvasSize / 10 -1 ;

  playerposition.x = undefined;
  playerposition.y = undefined;
  startGame();}

function startGame() {

  game.font = elementsSize + 'px Roboto';
  game.textAlign = 'end';

     const map = maps[level];

     if (!map) {
      gameWin();
      return;
     }

    
     if(!timeStart){
      timeStart = Date.now();
      timeInterval = setInterval(showTime,100)
      showRecord();
     }

     const positionY = map.trim().split('\n');
     const positions = positionY.map( (col) => col.trim().split(''));

     Lives();

    enemyPosition=[];
     //clearRect sirve para borrar todo 
    game.clearRect(0,0,canvasSize,canvasSize);

     positions.forEach( (col,colIndex) => {
      col.forEach((row,rowIndex) => {
        const emoji = emojis[row];
        const posX = elementsSize * (rowIndex + 1) +15;
        const posY = elementsSize * (colIndex + 1);
       
      //(renderizar luego de borrar) representa posicion iniciar del jugador
       if(row == "O" ) {
       if (!playerposition.x && !playerposition.y) {
          playerposition.x = posX;
          playerposition.y = posY;
        }
       }
      //posicion del helado
      else if (row == 'I') {
      creamPosition.x = posX;
      creamPosition.y = posY;
      }
      //posicion del enemigo 
      else if(row == "X"){
        enemyPosition.push({
          x: posX,
          y: posY
        })
      }

        game.fillText(emoji, posX, posY);
      });
    });
    //starGamer llamara esta funcion una vez que borre todo con clearRect
    //siempre que llame movePlayer el jugador se movera y no borrara nada
     movePlayer();

  }

  function movePlayer() {
    const creamCollisionX = playerposition.x.toFixed(5) == creamPosition.x.toFixed(5);
    const creamCollisionY = playerposition.y.toFixed(5) == creamPosition.y.toFixed(5);
    const creamCollision = creamCollisionX && creamCollisionY;
    

    if (creamCollision) {
      console.log('Subiste de nisvel!');
      advance()
    }


    const enemyCollision = enemyPosition.find(enemy => {
     const enemyCollisionX = enemy.x.toFixed(3) == playerposition.x.toFixed(3)
     const enemyCollisionY = enemy.y.toFixed(3) == playerposition.y.toFixed(3)
     return enemyCollisionX && enemyCollisionY;
    });
    
    if (enemyCollision) {
      levelFail();
    }
   
    
    game.fillText(emojis['PLAYER'], playerposition.x , playerposition.y);
  }

  function advance() {
    //console.log("subiste de nivel")
    level++;
    startGame()
  }


  //cuando choque volvera a la puerta inicial
  //volver a reiniciar el juego para definir posicion iniciar del jugador a la puertita 
  function levelFail() {
   lives--;
   console.log("me choque")
     
    if(lives <= 0){
      level = 0;
      lives = 3;
      timeStart = undefined;
    }

    playerposition.x = undefined;
    playerposition.y = undefined;
    startGame();

  
  }

//logica de los juegos
  function gameWin() {
  clearInterval(timeInterval)

 const recordTime = localStorage.getItem('record_time');
 const playerTime = Date.now() - timeStart;
 
 if (recordTime) {
  if (recordTime >= playerTime) {
    localStorage.setItem('record_time', playerTime);
    pResult.textContent = 'SUPERASTE EL RECORD :3';
  } else {
    pResult.textContent = 'no superaste el records :(';
  }
} else {
  localStorage.setItem('record_time', playerTime);
  pResult.textContent = 'Es tu primera vez!! ahora vuelve a intentarlo y rompe tu record';
}

console.log({recordTime, playerTime});

  }
 
  function Lives() {
    spanLives.textContent = emojis["HEART"].repeat(lives)
  }
   
function showTime() {
  spanTime.textContent = Date.now() - timeStart;
}

function showRecord() {
  spanRecord.textContent = localStorage.getItem('record_time');
}


btnUp.addEventListener("click", moveUp);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
btnDown.addEventListener("click", moveDown);

window.addEventListener("keydown", (moveKeys) => {
  let tecla = moveKeys.key;

  switch (tecla) {
    case "ArrowUp":
      moveUp();
      break;

    case "ArrowDown":
      moveDown();
      break;

    case "ArrowLeft":
      moveLeft();
      break;

    case "ArrowRight":
    moveRight();
      break;

    default:
      break;
  }
});

function moveUp() {
 if (playerposition.y <= elementsSize +1) {
  console.log("no se mueve hacia arriba", playerposition.y, elementsSize);
} else {
  console.log("se mueve hacia arriba", playerposition.y, elementsSize);
  playerposition.y -= elementsSize;
  startGame();
}
}

function moveLeft() {
  if ((playerposition.x - elementsSize) < elementsSize) {
    console.log("no se mueve hacia la izquierda",);
  } else{
    console.log("se mueve a la izquierda");
    playerposition.x -= elementsSize;
    startGame();
  }
}

function moveRight() {
  if (playerposition.x >= canvasSize) {
    console.log("no se mueve hacia la derecha");
  } else {
    console.log("se mueve a la derecha");
    playerposition.x += elementsSize;
    startGame();
  }
}

function moveDown() {
 if ((playerposition.y + elementsSize) > canvasSize) {
  console.log("no se mueve hacia abajo")
 } else {
  console.log("se mueve hacia abajo");
  playerposition.y += elementsSize;
  startGame();
 }}


const reset = document.querySelector('#reset');
reset.addEventListener('click', resetGame);
 function resetGame() {
  location.reload();
} 
