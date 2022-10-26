const canvas = document.querySelector('#game');
const game = canvas.getContext('2d'); // Llamando el contexto donde será el juego, en este casó es un juego en 2D (eje X, eje Y).

let canvasSize;
let elementSize;

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
  elementSize = (canvasSize / 10); // Medida del elemento.

  startGame();
}

// Función que iniciliza el principio del juego.
function startGame() {
    
    game.font = (elementSize) + "px Verdana"; // Tamaño del elemento.
    game.textAlign = "end"; // Posición del elemetno.

    
    // El método .trim() nos ayuda a limpiar los espacios en blanco que se tienen al principio o al final de un arreglo. 
    // El método .split(), convierte un arreglo en un objeto, dependiendo su parametro (""), (" "), ("\n"), ...
    // \n es el salto de línea.
    const map = maps[0];
    const mapsRows = map.trim().split("\n");
    const mapsRowsColumns = mapsRows.map(row => row.trim().split(""));
    console.log({map, mapsRows, mapsRowsColumns});

    // Ciclos for anidados para un array bidimensional.
    for (let row = 1; row <= 10; row++) /* Fila */ {
       for (let column = 1; column <= 10; column++) /* Columna */ {
          game.fillText(emojis[mapsRowsColumns[row - 1][column - 1]], elementSize * column + 9, elementSize * row - 7); // Ubicación de los elementos.
       }
    }
}



