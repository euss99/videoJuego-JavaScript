const canvas = document.querySelector('#game');
const game = canvas.getContext('2d'); // Llamando el contexto donde será el juego, en este casó es un juego en 2D (eje X, eje Y).
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');

let canvasSize; // Tamaño del canvas.
let elementsSize; // Tamaño del elemento (emoji).
let level = 0; // Enumeración de niveles.
let lives = 3; // Vidas del jugador.

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
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  // Calculando el tamaño de los elementos:
  elementsSize = canvasSize / 10;

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

  const mapRows = map.trim().split('\n'); // Creando un array en cada salto de línea. FILAS
  const mapRowCols = mapRows.map(row => row.trim().split('')); // Creando un array por cada elemento que haya en el array (array de arrays). COLUMNAS 
  // console.log({map, mapRows, mapRowCols});

    /* mapsRowsColumns[filas1][columnas] */
    // Método forEach me permite recorrer un array, ademas que nos permite saber cual es el elemento que estamos recorriendo y su vez saber cual es su indice.
  
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
  if (lives <= 0) {
    level = 0;
    lives = 3;
  }
  lives--;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
  console.log(lives);
}

function gameWin() {
  console.log();("Felicidades, pasaste todos los niveles!!");
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
  if ((playerPosition.y - elementsSize) < 0) {
    console.log('OUT');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  // console.log('Me quiero mover hacia izquierda');

  if ((playerPosition.x - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  // console.log('Me quiero mover hacia derecha');

  if ((playerPosition.x + elementsSize) > canvasSize + elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  // console.log('Me quiero mover hacia abajo');
  
  if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}