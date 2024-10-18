// Board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Dino
let dinoWidth = 90;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;
let dinoSpriteColumns = 3; // número de colunas na sprite
let dinoSpriteIndex = 0; // índice do frame atual
let dinoFrameWidth = 90; // largura de um frame
let dinoFrameHeight = 94; // altura de um frame
let dinoFrameDelay = 5; // atraso entre os frames
let dinoFrameCounter = 0; // contador para controlar o atraso

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// Cactos
let cactusArray = [];

let cactus1Width = 64; //34
let cactus2Width = 88; //69
let cactus3Width = 104; //102

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Pássaro (bird)
let birdWidth = 100;
let birdHeight = 65;
let birdX = boardWidth; // começa fora do lado direito do board
let birdY = 10; // altura inicial para voar acima do Dino
let birdImg;
let birdSpriteColumns = 1; // o pássaro tem 2 frames
let birdSpriteIndex = 0;
let birdFrameDelay = 8; // atraso entre os frames para o pássaro
let birdFrameCounter = 0;
let birdActive = false; // controle se o pássaro está ativo ou não

let birdMinY = 10; // altura mínima do pássaro
let birdMaxY = 100; // altura máxima do pássaro

// Física
let velocityX = -8;// velocidade do cactus movendo para a esquerda
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); // utilizado para desenhar no board
    // carrega imagem do fundo
    fundoImg = new Image();
    fundoImg.src = "./img/fundo3.jpg";


    // Carregar a sprite do dinossauro
    dinoImg = new Image();
    dinoImg.src = "./img/dino-sprite2.png";

    dinoImg.onload = function () {
        context.drawImage(dinoImg, dinoFrameWidth * dinoSpriteIndex, 0, dinoFrameWidth, dinoFrameHeight, dino.x, dino.y, dino.width, dino.height);
    }

    // Carregar a sprite do pássaro
    birdImg = new Image();
    birdImg.src = "./img/zepelim2.png"; // imagem do pássaro com 2 frames (cada frame 97x68)

    cactus1Img = new Image();
    cactus1Img.src = "./img/barreira.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/barreira2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/barreira3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    setTimeout(placeBird, getRandomInterval()); // chama o pássaro em um intervalo aleatório
    document.addEventListener("keydown", moveDino);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        // Placar
        context.fillStyle = "red";
        context.font = "50px courier";        
        context.fillText("GAME OVER", 250, 100);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    context.drawImage(fundoImg, 0, 0, board.width, board.height);

    // Atualizar animação da sprite do Dino
    dinoFrameCounter++;
    if (dinoFrameCounter >= dinoFrameDelay) {
        dinoFrameCounter = 0;
        dinoSpriteIndex = (dinoSpriteIndex + 1) % dinoSpriteColumns; // alterna o frame atual do dino
    }


    // Aplicar gravidade ao Dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); // aplicar gravidade no dino
    
	// Cactos
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./img/dino-dead.png";
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, cactus.y-22, dino.width, dino.height);
            }
		    return	
        }
    }	    

    // Atualizar animação e movimento do pássaro
    if (birdActive) {
        birdFrameCounter++;
        if (birdFrameCounter >= birdFrameDelay) {
            birdFrameCounter = 0;
            birdSpriteIndex = (birdSpriteIndex + 1) % birdSpriteColumns; // alterna o frame atual do pássaro
        }

        // mover o pássaro para a esquerda
        birdX += velocityX+4;
        if (birdX + birdWidth < 0) {
            birdActive = false;
            setTimeout(placeBird, getRandomInterval()); // programa o próximo pássaro para aparecer em um intervalo aleatório
        }

        // Desenhar o pássaro animado
        context.drawImage(birdImg, birdWidth * birdSpriteIndex, 0, birdWidth, birdHeight, birdX, birdY, birdWidth, birdHeight);
    }

    // Desenhar o Dino animado
    context.drawImage(dinoImg, dinoFrameWidth * dinoSpriteIndex, 0, dinoFrameWidth, dinoFrameHeight, dino.x, dino.y, dino.width, dino.height);

    // Placar
    context.fillStyle = "white";
    context.font = "20px courier";
    score++;
    context.fillText(score, 5, 20);

    if (score > 300 && velocityX == -8)
    {    
       velocityX -= 1 
    }
    else if (score > 600 && velocityX == -9)
    {    
       velocityX -= 1 
    }
    else if (score > 900 && velocityX == -10)
    {    
       velocityX -= 1 
    }
    else if (score > 1000 && velocityX == -11)
    {    
       velocityX -= 1 
    }
    else if (score > 1500 && velocityX == -12)
    {    
       velocityX -= 1 
    }
    else if (score > 2000 && velocityX == -13)
    {    
       velocityX -= 1 
    }
     else if (score > 2500 && velocityX == -14)
    {    
       velocityX -= 1 
    }
    else if (score > 3000 && velocityX == -15)
    {    
       velocityX -= 1 
    }
    else if (score > 3500 && velocityX == -16)
    {    
       velocityX -= 1 
    }
    else if (score > 4000 && velocityX == -17)
    {    
       velocityX -= 1 
    }

}

// Função para gerar o pássaro em momentos aleatórios
function placeBird() {
    if (gameOver) return;

    birdX = boardWidth; // reseta a posição X para o lado direito
    birdY = Math.random() * (birdMaxY - birdMinY) + birdMinY; // altura aleatória entre birdMinY e birdMaxY
    birdActive = true;
}

// Função para gerar um intervalo aleatório (entre 2 e 5 segundos) para o pássaro aparecer
function getRandomInterval() {
    return Math.random() * 3000 + 2000; // retorna um valor entre 2000ms e 5000ms (2 a 5 segundos)
}

function moveDino(e) {
    //alert(e.code);
    if (e.code == "KeyR" ) {
        // Reiniciar
        location.reload();
    }

    if (gameOver) {
        return;
    }
    
    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        // Pular
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        // Agachar (pode adicionar ação aqui)
    }
}

function placeCactus() {
    if (gameOver) {
        return;
    }

    // Colocar cacto
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .80) { //10% chance para cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .60) { //30% chance para cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .40) { //50% chance para cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); // remove o primeiro elemento do array para que ele não cresça infinitamente
    }
}

// Função para detectar colisão
// Função para detectar colisão mais precisa usando bounding boxes
function detectCollision(a, b) {
    // Definindo margens para ajustar a caixa delimitadora
    //let aMargin = 10; // margens do Dino (ajustável)
    //let bMargin = 5;  // margens do Cactus/Pássaro (ajustável)
    let aMargin = 10; // margens do Dino (ajustável)
    let bMargin = 10;  // margens do Cactus/Pássaro (ajustável)

    let aLeft = a.x + aMargin;
    let aRight = a.x + a.width - aMargin;
    let aTop = a.y + aMargin;
    let aBottom = a.y + a.height - aMargin;

    let bLeft = b.x + bMargin;
    let bRight = b.x + b.width - bMargin;
    let bTop = b.y + bMargin;
    let bBottom = b.y + b.height - bMargin;

    // Verificando colisão entre as caixas delimitadoras
    return aRight > bLeft &&   // O lado direito do Dino ultrapassa o lado esquerdo do obstáculo
           aLeft < bRight &&   // O lado esquerdo do Dino está antes do lado direito do obstáculo
           aBottom > bTop &&   // O lado inferior do Dino está abaixo do topo do obstáculo
           aTop < bBottom;     // O topo do Dino está acima da parte inferior do obstáculo
}


function detectCollisionBB(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}