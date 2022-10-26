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
    
    game.font = (elementSize - 12) + "px Verdana"; // Tamaño del elemento.
    game.textAlign = "end";
    
    for (let i = 1; i <= 10; i++) {
        game.fillText(emojis["X"], elementSize * i, elementSize); // Posición del elemento.
    }
    
    console.log({canvasSize, elementSize});
}


