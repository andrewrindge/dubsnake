// this is where the actual snake game functionality will live
// home -> snake -> restart

import Phaser from "phaser";

export default class Snake extends Phaser.Scene {
    // snake: [],  // stack containing parts of the snake
    // food: {},   // food object to be eaten
    // dimension: 55,  // size in px of a length of a unit on grid
    // score: 0,   // score of the game so far
    // speed: 0,   // speed snake is traveling at
    // updateDelay: 0,     // const to hold amount of delay
    // direction: 'right',     // direction for the snake
    // newDirection: null,     // next direction for the snake to go
    // eaten: false,   // variable to track if food has been eaten yet
    eaten;
    snake;

    constructor() {
        super("Snake");
        this.eaten = false;
        this.snake = [];
    }

    init(data) {
        this.roomKey = data.roomKey;
        this.players = data.players;
        this.numPlayers = data.numPlayers;
        this.socket = data.socket;
    }

    preload () {
        // loading images for snake & food
        // need about a million more snake images
        // game.load.image('snake', './assets/images/snake.png');
        // game.load.image('snakeHead', './assets/images/snakeHeadPointingRight.png');
        // game.load.image('food', './assets/images/food.png');
    }

    create () {
        const scene = this;

        // Set up a Phaser controller for keyboard input.
        let keys = this.input.keyboard.createCursorKeys();

        // placing starting head, body, and tail of snake
        snake[0] = game.add.sprite(357.5, 412.5, 'snakeHeadPointingRight');
        snake[1] = game.add.sprite(302.5, 412.5, 'horizSnakeBody');
        snake[2] = game.add.sprite(247.5, 412.5, 'tailPointingLeft');

        this.generateFood();

        // Add Text to top of game.
        let textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
        let textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };

        // add score stat to screen
        game.add.text(30, 20, "SCORE", textStyle_Key);
        let scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
    }

    update () {
         let newDirection;
        // handling key presses
        // illegal press if it is the opposite of the current direction
        if (keys.right.isDown && direction != 'left') {
            newDirection = 'right';
        } else if (keys.left.isDown && direction != 'right') {
            newDirection = 'left';
        } else if (keys.up.isDown && direction != 'down') {
            newDirection = 'up';
        } else if (keys.down.isDown && direction != 'up') {
            newDirection = 'down';
        }

        // updating game speed based on the score
        let speed = Math.min(10, Math.floor(score/5));
        // update user of speed we are at?

        // inc with every call
        updateDelay ++;

        if (updateDelay % (10 - speed) == 0) {
            // assigning variables to the head and tail values
            let head = snake[snake.length - 1],
                tail = snake.shift(),
                oldTailX = tail.x,
                oldTailY = tail.y;

            // if cursor chose a new direction, reassign direction
            if (newDirection) {
                direction = newDirection;
                newDirection = null;
                // put a variable here to mark the place where it turned
                // and adjust sprites accordingly
                // could cause problems if there are two turns and we need to keep track of both
            }

            // change the direction of the tail

            if (direction == 'right') {
                tail.x = head.x + 55;
                tail.y = head.y;
            } else if (direction == 'left') {
                tail.x = head.x - 55;
                tail.y = head.y;
            } else if (direction == 'up') {
                tail.x = head.x;
                tail.y = head.y +  55;  // -15 ?
            } else if (direction == 'down') {
                tail.x = head.x;
                tail.y = head.y - 55;   // + 15?
            }

            snake.push(tail);
            head = tail;
        }

        // stretch snake if it has eaten food
        if (eaten) {
            snake.unshift(game.add.sprite(tailX, tailY, 'snake'));
            eaten = false;
        }

        // check if snake has eaten food
        this.eatFood();

        // check if snake has collided with self
        this.selfCollide(head);

        // check if snake has collided with wall
        this.wallCollide(head);
    }

    generateFood () {
        // defining randomized variables for the coordinates of the food's location
        // x can be between 0 and 585, y between 0 and 435
        let randX = Math.random() * (15 - 1) + 1;
        let randY = Math.random() * (15 - 1) + 1;
        let X = Math.floor(Math.Random() * 40) * dimension,
            Y = Math.floor(Math.Random() * 30) * dimension;

        food = game.add.sprite(X, Y, 'food');
    }

    eatFood () {
        // for each portion of the snake (necessary in case food appears inside snake)
        for (let i = 0; i < snake.length(); i++) {
            // check if part of snake overlaps with the food
            if (snake[i].x === food.x && snake[i].y === food.y) {
                // marking that the next time the snake moves it should grow
                eaten = true;

                // remove old food and create a new one
                food.destroy();
                this.generateFood();

                // increase score & update score display
                score++;
                scoreTextValue.text = score.toString();
            }
        }
    }

    selfCollide (head) {
        // for each portion of the snake
        for (let i = 0; i < snake.length(); i++) {
            // check if the snake's head overlaps with the portion of it's body
            if (snake[i].x === head.x && snake[i].y === head.y) {
                game.state.start('gameOver');
            }
        }
    }

    wallCollide (head) {
        // for each portion of the snake
        for (let i = 0; i < snake.length(); i++) {
            // check if the snake's head has hit the wall anywhere
            if (head.x >= 600 || head.x <= 0 || head.y >= 450 || head.y < 0) {
                game.state.start('gameOver');
            }
        }
    }

}