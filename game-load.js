window.addEventListener("load", function(){
    // DEFINE CONSTANTS AND VARIABLES
    const SNAKE_SIZE = "12px";
    let snake = document.querySelector("#snake");
    // ON LOAD FUNCTIONS
    prepareSnake(snake, SNAKE_SIZE);
    // CONTROL MOVEMENTS
    window.addEventListener("keydown", function(event){
        switch (event.key){
            case "ArrowUp":
            case "w":
                console.log("Arriba");
                break
            case "ArrowLeft":
            case "a":
                console.log("Izquierda");
                break
            case "ArrowDown":
            case "s":
                console.log("Abajo");
                break
            case "ArrowRight":
            case "d":
                console.log("Derecha");
                break
        }
    });
});


// Prepare snake: set initial square sizes
function prepareSnake(snake, size){
    snake.style.width = size;
    snake.style.height = size;
}