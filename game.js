const canvas = document.querySelector('#game');
const game = canvas.getContext('2d'); // Llamando el contexto donde será el juego, en este casó es un juego en 2D (eje X, eje Y).
const up = document.querySelector("#up")
const left = document.querySelector("#left")
const right = document.querySelector("#right")
const down = document.querySelector("#down")

let canvasSize; // Tamaño del canvas.
let elementSize; // Tamaño del elemento (emoji).

const playerPosition = {
  x: undefined,
  y: undefined,
}

window.addEventListener('load', setCanvasSize); // window es la ventana del HTML, el "load" significa que apenas cargue la página, se ejecutará la función startGame.

window.addEventListener('resize', setCanvasSize); // Con "resize" ya no es necesario recargar la página para ver los cambios de tamaño.

function setCanvasSize(params) {
  // Calculando el tamaño del canvas:
  
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  // Calculando el tamaño de los elementos:
  elementSize = (canvasSize / 10) - 0.3; // Tamaño del elemento.

  startGame();
}

// Función que iniciliza el principio del juego.
function startGame() {
    
    game.font = (elementSize) + "px Verdana"; // Tamaño del elemento.
    game.textAlign = "end"; // Posición del elemetno.

    
    // El método .trim() nos ayuda a eliminar los espacios en blanco que se tienen al principio y al final de un STRING. 
    // El método .split(), convierte un objeto de tipo STRING en un array, dependiendo su parametro (separador) (""), (" "), ("\n"), ...
    // \n es el salto de línea.

    const map = maps[0];
    const mapsRows = map.trim().split("\n"); // Creando un array en cada salto de línea. FILAS
    const mapsRowsColumns = mapsRows.map(row => row.trim().split("")); // Creando un array por cada elemento que haya en el array (array de arrays). COLUMNAS 

    /* mapsRowsColumns[filas1][columnas] */
    // Método forEach me permite recorrer un array, ademas que nos permite saber cual es el elemento que estamos recorriendo y su vez saber cual es su indice.

    game.clearRect(0,0, canvasSize, canvasSize); // Borrando todo lo que esta dentro del canvas.

    mapsRowsColumns.forEach( (row, rowIndex) => { 
      row.forEach( (column, columnIndex) => {
        const emoji = emojis[column]; // Obteniendo al emoji.
        const positionX = elementSize * (columnIndex + 1) + 10; 
        const positionY = elementSize * (rowIndex + 1) - 6; // Coordenada en X y Y del emoji.

        // Ubicación del jugador, se ubica justo con el emoji "O", ya que el jugador empieza en la puerta.
        if (column == "O") {
          if (!playerPosition.x && !playerPosition.y) {
            playerPosition.x = positionX;
            playerPosition.y = positionY;
            console.log(playerPosition);
          }
        }

        game.fillText(emoji, positionX, positionY); // Agregando los emojis.

      });
    });

    movePlayer();
}

function movePlayer() {
  game.fillText(emojis["PLAYER"], playerPosition.x , playerPosition.y); // Agregango al jugador.
}

up.addEventListener("click", moveUp); // Presionando el boton.
left.addEventListener("click", moveLeft);
right.addEventListener("click", moveRight);
down.addEventListener("click", moveDown);

window.addEventListener("keydown", moveByKeys); // Presionando el teclado.

function moveUp(event) {
  console.log("Arriba");
  // Limitando el movimiento del jugador al canvas.
  if ((playerPosition.y - elementSize) < 0) {
    console.log("Out");
  } else {
    playerPosition.y -= elementSize;
    startGame();
  }
}
function moveLeft(event) {
  console.log("Izquierda");

  if ((playerPosition.x - elementSize) < elementSize) {
    console.log("Out");
  } else {
    playerPosition.x -= elementSize;
    startGame();
  }
}
function moveRight(event) {
  console.log("Derecha");

  if ((playerPosition.x + elementSize) > canvasSize + elementSize) {
    console.log("Out");
  } else {
    playerPosition.x += elementSize;
    startGame();
  }
}
function moveDown(event) {
  console.log("Abajo");

  if ((playerPosition.y + elementSize) > canvasSize) {
    console.log("Out");
  } else {
    playerPosition.y += elementSize;
    startGame();
  }

}

function moveByKeys(event) {
  if (event.key == "ArrowUp") {
    moveUp();
  } else if (event.key == "ArrowRight") {
    moveRight();
  } else if (event.key == "ArrowLeft") {
    moveLeft();
  } else if (event.key == "ArrowDown") {
    moveDown();
  }
}