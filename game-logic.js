window.addEventListener("load", function(){
    // --------------- DEFINE CONSTANTS, VARIABLES AND ELEMENTS ---------------
    const BOARD_SIDE = 500; 
    const SNAKE_SIDE = 25; 
    const BOARD_LIMITS = {
        "top": 0,
        "bottom": BOARD_SIDE - SNAKE_SIDE,
        "right": BOARD_SIDE - SNAKE_SIDE,
        "left": 0
    }
    const SPEED = SNAKE_SIDE; 
    const SNAKE_COLOR = "black";
    const FOOD_COLOR = "red";
    const BOARD = document.getElementById("board");
    const BOARD_DIMENSIONS = BOARD.getContext("2d");
    let snake = [
        {
            "x" : (BOARD_SIDE/2 - SNAKE_SIDE), 
            "y" : (BOARD_SIDE/2 - SNAKE_SIDE) 
        }
    ];
    let direction = "";
    let foodX, foodY;
    let points = 0;
    let pointsHTML = document.querySelector("#points");

    // --------------- INITIALIZATE ELEMENTS ---------------
    prepareBoard(BOARD, BOARD_SIDE);
    prepareSnake();
    drawFood();
    updateScore(pointsHTML, points);
    
    // --------------- EVENTS ---------------
    // On keydown update direction variable with a new direction
    window.addEventListener("keydown", function(event){
        if (userDirection(event.key) !== undefined) {
            direction = userDirection(event.key);
        }
    });

    // Reset game button
    document.querySelector("#reset").addEventListener("click", function(){
        resetGame();
    })

    
    // --------------- GAME PROGRESS ---------------
    setInterval(function(){
        moveSnake(direction, snake, SPEED); // Move snake
        // Detect snake head eating the food: Eaten --> new food element; Not eaten --> repeat same food location
        if (eatFood()){
            drawFood();
            updateScore(pointsHTML, points);
        } else {
            drawOneElement(foodX,foodY,FOOD_COLOR);         
        } 
        // Check for game over, show final message and reset the game
        if (checkGameOver(snake)){
            finalMessage(points);
            resetGame();
        }
    }, 100);
    
    // --------------- FUNCTIONS ---------------

    // Prepare board: set initial board-square sizes
    function prepareBoard(board, size){
        board.width = size;
        board.height = size;
    }

    // Prepare snake: set initial square sizes
    function prepareSnake(){
        snake = [
            {
                "x" : (BOARD_SIDE/2 - SNAKE_SIDE), 
                "y" : (BOARD_SIDE/2 - SNAKE_SIDE) 
            }
        ];
        drawOneElement(snake[0]['x'],snake[0]['y']);
    }
    
    // Add 1 snake box (1 snake part)
    function drawOneElement(positionX, positionY, color = SNAKE_COLOR, boardContext = BOARD_DIMENSIONS, side = SNAKE_SIDE){
        boardContext.fillStyle = color;
        boardContext.fillRect(positionX,positionY,SNAKE_SIDE,SNAKE_SIDE);
    }

    // Create food and draw it
    function drawFood(){        
        foodX = Math.round((Math.random() * (BOARD_SIDE - SNAKE_SIDE)) / SNAKE_SIDE) * SNAKE_SIDE;
        foodY = Math.round((Math.random() * (BOARD_SIDE - SNAKE_SIDE)) / SNAKE_SIDE) * SNAKE_SIDE;        
        drawOneElement(foodX,foodY,FOOD_COLOR);
    }

    // Function to clear completely the board
    function clearCanvas(){
        BOARD_DIMENSIONS.clearRect(0, 0, BOARD_SIDE, BOARD_SIDE);
    }

    // Update points in HTML element
    function updateScore(htmlElement, counter){
        htmlElement.innerText = counter;
    }

    // Define snake direction on (allowed) key press
    function userDirection(keyPressed){
        const MOVEMENTS = {
            "w" : "up",
            "W" : "up",
            "ArrowUp" : "up",

            "a" : "left",
            "A" : "left",
            "ArrowLeft" : "left",

            "s" : "down",
            "S" : "down",
            "ArrowDown" : "down",

            "d" : "right",
            "D" : "right",
            "ArrowRight" : "right"
        }

        return MOVEMENTS[keyPressed];
    }

    // Move each element in the snake and draw it on the canvas
    function moveSnake(direction, snake, speed) {
        let  head = {
            "x" : snake[0].x,
            "y" : snake[0].y
        }
        switch (direction) {
            case "up":
                clearCanvas(); // Reset board
                // Determine cordinates according to the board limits (otherwise, snake appears from the other end fo the board)
                head["y"] = (BOARD_LIMITS['top'] > (head["y"] - speed)) ? BOARD_LIMITS['bottom'] : snake[0].y - speed;
                snake.unshift(head); // Save head position in first position of the snake array --> new head (moves the head towards the new position, then the old head its added automatically to the tail)
                if (!eatFood()){ // if no new food is eaten --> remove previous element (old head); otherwise, keeps it --> adds +1 part to tail (snake grows)
                    snake.pop(); 
                }
                // Draw all snake elements
                snake.forEach(element => {                    
                    drawOneElement(element["x"], element["y"]);     
                });
                break;
            case "left":
                clearCanvas();
                head["x"] = (BOARD_LIMITS['left'] > (head["x"] - speed)) ? BOARD_LIMITS['right'] : snake[0].x - speed;                 
                snake.unshift(head);
                if (!eatFood()){
                    snake.pop(); 
                }
                snake.forEach(element => {                    
                    drawOneElement(element["x"], element["y"]);     
                });
                break;
            case "right":
                clearCanvas();
                head["x"] = (BOARD_LIMITS['right'] < (head["x"] + speed)) ? BOARD_LIMITS['left'] : snake[0].x + speed;                              
                snake.unshift(head); 
                if (!eatFood()){ 
                    snake.pop(); 
                }
                snake.forEach(element => {                    
                    drawOneElement(element["x"], element["y"]);     
                });
                break;
            case "down":
                clearCanvas();
                head["y"] = (BOARD_LIMITS['bottom'] < (head["y"] + speed)) ? BOARD_LIMITS['top'] : snake[0].y + speed;                                      
                snake.unshift(head); 
                if (!eatFood()){
                    snake.pop(); 
                }
                snake.forEach(element => {                    
                    drawOneElement(element["x"], element["y"]);     
                });
                break;
        }
    }
    
    // Detect contact snake head - food 
    function eatFood(){
        let head = snake[0];
        if (head['x'] === foodX && head['y'] === foodY){
            points +=50;
            return true;
        } else {
            return false;
        }        
    }

    // Chek game end: snake head touches any part of the body
    function checkGameOver(snake){
        let gameOver = false;
        if (snake.length > 1) { // at least 1 item of food already eaten
            const  HEAD = {
                "x" : snake[0].x,
                "y" : snake[0].y
            }
            let body = snake.slice(); // get copy of the array
            body.shift(); // remvoe head (just check on body)
            body.forEach(bodyElement => {
                if (HEAD["x"] === bodyElement["x"] && HEAD["y"] === bodyElement["y"]){
                    gameOver = true;
                }
            });
        }
        return gameOver;
    }

    // Reset all game settings
    function resetGame(){
        clearCanvas(); 
        prepareSnake(); // Center snake
        drawFood(); // Random food
        direction = undefined; // Stop movement
        points = 0; // Reset points
        updateScore(pointsHTML, points);
    }

    
    // Create popup window with final punctuation
    function finalMessage(points){
        // Create element and style it
        let box = document.createElement("div");
        box.style.height = BOARD_SIDE/2 + "px";
        box.style.width = BOARD_SIDE/2 + "px";
        box.style.backgroundColor = "lightgray";
        box.style.border = "5px solid black";
        box.id = "finalMessage";

        // Center on canvas
        box.style.position = "absolute";
        box.style.left = "50%";
        // Get vertical center of the screen, matching with canvas: header + 1/4 board size (half board - half size of this div)
        let headerHeight = document.querySelector("header").offsetHeight;
        let boardHeigt = document.querySelector("canvas").offsetHeight;
        let verticalCenterHeight = headerHeight + boardHeigt/4;
        box.style.top = verticalCenterHeight + "px";
        box.style.transform = "translateX(-50%)";

        // Add text element
        let message = document.createElement("h2");
        message.innerText = "Final score:";
        message.style.textAlign = "center";
        message.style.position = "relative";
        message.style.top = "25%";
        let score = document.createElement("h2");
        score.innerText = points;
        score.style.textAlign = "center";
        score.style.position = "relative";
        score.style.top = "25%";

        // Add button
        let button = document.createElement("input");
        button.setAttribute("type", "button");
        button.value = "Play again!";
        button.id = "playAgain";
        button.style.position = "relative";
        button.style.top = "25%";
        button.style.left = "50%";
        button.style.transform = "translateX(-50%)";

        // Append all elements
        box.appendChild(message);
        box.appendChild(score);
        box.appendChild(button);
        document.querySelector("body").appendChild(box);

        // Add event on click button of the message --> removes the new message
        document.querySelector("#playAgain").addEventListener("click", function(){
            document.querySelector("#finalMessage").remove();
        })
    }
});




