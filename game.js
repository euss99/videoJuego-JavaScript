const canvas = document.querySelector('#game');
const game = canvas.getContext('2d'); // Llamando el contexto donde será el juego, en este casó es un juego en 2D (eje X, eje Y).
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const pResult = document.querySelector("#result");

let canvasSize; // Tamaño del canvas.
let elementsSize; // Tamaño del elemento (emoji).
let level = 0; // Enumeración de niveles.
let lives = 3; // Vidas del jugador.

let timeStart; // Tiempo.
let timePlayer;
let timeInterval;

const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemiesPositions = [];

window.addEventListener('load', setCanvasSize); // window es la ventana del HTML, el "load" significa que apenas cargue la página, se ejecutará la función startGame.
window.addEventListener('resize', setCanvasSize); // Con "resize" ya no es necesario recargar la página para ver los cambios de tamaño.

function setCanvasSize() {
  // Calculando el tamaño del canvas:
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }

  canvasSize = Number(canvasSize.toFixed(0));
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  // Calculando el tamaño de los elementos:
  elementsSize = canvasSize / 10;

  playerPosition.x = undefined;
  playerPosition.y = undefined;

  startGame();
}

// Función que iniciliza el principio del juego.
function startGame() {
  // console.log({ canvasSize, elementsSize });

  game.font = elementsSize + 'px Verdana'; // Tamaño y fuente del elemento.
  game.textAlign = 'end'; // Posición del elemetno.

    // El método .trim() nos ayuda a eliminar los espacios en blanco que se tienen al principio y al final de un STRING. 
    // El método .split(), convierte un objeto de tipo STRING en un array, dependiendo su parametro (separador) (""), (" "), ("\n"), ...
    // \n es el salto de línea.

  const map = maps[level];

  if (!map) {
    gameWin();
    return;
  }

  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime);
    showRecord();
  }

  const mapRows = map.trim().split('\n'); // Creando un array en cada salto de línea. FILAS
  const mapRowCols = mapRows.map(row => row.trim().split('')); // Creando un array por cada elemento que haya en el array (array de arrays). COLUMNAS 
  // console.log({map, mapRows, mapRowCols});

    /* mapsRowsColumns[filas1][columnas] */
    // Método forEach me permite recorrer un array, ademas que nos permite saber cual es el elemento que estamos recorriendo y su vez saber cual es su indice.

    showLives();
  
    enemiesPositions = [];
    game.clearRect(0,0,canvasSize, canvasSize); // Borrando todo lo que esta dentro del canvas.

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1) + 10;
      const posY = elementsSize * (rowI + 1) - 7;  // Coordenadas en X y Y del emoji.


       // Ubicación del jugador, se ubica justo con el emoji "O", ya que el jugador empieza en la puerta.
      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          // console.log({playerPosition});
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemiesPositions.push({
          x: posX,
          y: posY,
        });
      }
      
      game.fillText(emoji, posX, posY); // Agregando los emojis.
    });
  });

  movePlayer();
}

function movePlayer() {
  
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  
  if (giftCollision) {
    levelWin();
  }
  
  const enemyCollision = enemiesPositions.find( enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });

  if (enemyCollision) {
    levelFail();
  }

  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);  // Agregango al jugador.
}

function levelWin() {
  console.log('Subiste de nivel!');
  level++;
  startGame();
}

function levelFail() {
  console.log("Chocaste con una bomba");
  lives--;

  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log();("Felicidades, pasaste todos los niveles!!");
  clearInterval(timeInterval);

  const recordTime = localStorage.getItem('record_time');
  const playerTime = ((Date.now() - timeStart) / 1000).toFixed(1);

  if (recordTime) {
    if (recordTime >= playerTime) {
      localStorage.setItem('record_time', playerTime);
      pResult.innerHTML = "Superaste el record 🥳";
    } else {
      pResult.innerHTML = "No superaste el record 🙁";
    }
  } else {
    localStorage.setItem('record_time', playerTime);
    pResult.innerHTML = "Juega por primera vez!! 😁";
  }
    console.log({recordTime, playerTime});
}

function showLives() {
  const heartsArray = Array(lives).fill(emojis['HEART']); // Creando un array con la cantidad de elementos de lives.

  // console.log(heartsArray);
  spanLives.innerHTML = "";
  heartsArray.forEach( heart => spanLives.append(heart)); // Agregando los corazones al HTML.

}

function showTime() {
  // La función Date.now nos permite imprimir la hora a la que estamos, pero en formato en milisegundos.
  spanTime.innerHTML = ((Date.now() - timeStart) / 1000).toFixed(1);
}

function showRecord() {
  spanRecord.innerHTML = localStorage.getItem("record_time");
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {
  // console.log('Me quiero mover hacia arriba');

  // Limitando el movimiento del jugador al canvas.
  if ((playerPosition.y - elementsSize).toFixed(5) < 0) {
    console.log('OUT');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  // console.log('Me quiero mover hacia izquierda');

  if ((playerPosition.x - elementsSize).toFixed(5) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  // console.log('Me quiero mover hacia derecha');

  if ((playerPosition.x + elementsSize).toFixed(5) > canvasSize + elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  // console.log('Me quiero mover hacia abajo');
  
  if ((playerPosition.y + elementsSize).toFixed(5) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}

/* 
setInterval( ) es una función que nos puede ayudar para que se reprodusca por un intervalo de timpo, ejemplo: setInterval( () => console.log("Hola"), 1000); Nos dara como resultado que por cada 1000 milisegundos se imprimira "Hola" en la pantalla.
Para poder parar esta función, se necesita de otra función llamada clearInterval:

const intervalo = setInterval( () => console.log("Hola"), 1000);
clearInterval(intervalo);
*/

// setTimeout () esta función se ejecuta una sola vez despues de que pasen el tiempo establecido, el mismo ejemplo: setTimeout( () => console.log("Hola"), 1000); Nod imprimirá "Hola" en la pantalla despues de que pasen los 1000 milisegundos.

/* 
  "localStorage" sirve solamente si se esta ejecutando el código JS en un navegador web o que se ejecute junto un HTML.
  Esto es el almacenamiento local en el navegador, es decir, se le pide al navegador que guarde alguna información por ti.

  - localStorage.getItem es para leer alguna información que tengamos dentro de localStorage. 
    Ejemplo: localStorage.getItem("Nombre variable").
  - localStorage.setItem es para guardar una variable por primera vez.
    Ejemplo: localStorage.setItem("Variable a guardar", "Valor de la variable").
  - localStorage.removeItem borra las variables guardadas en el   navegador. 
    Ejemplo: localStorage.removeItem("Nombre variable").
*/