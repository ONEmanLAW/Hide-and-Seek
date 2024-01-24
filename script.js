////////////////////////////////////
// Variables.
////////////////////////////////////

const gridSize = 64;
const maxClicks = 10;
let clickCount = 0;
let intruderFound = false;
let gameOver = false;
let intruderIndex = Math.floor(Math.random() * gridSize);
let currentAnimatingCell = null;


////////////////////////////////////
// Récupération des éléments HTML.
////////////////////////////////////

const grid = document.getElementById('grid');
const clickCountDisplay = document.getElementById('clickCount');
const resultMessage = document.getElementById('resultMessage');

playMusicButton.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playMusicButton.src = 'soundElement/sound.png';
    } else {
        backgroundMusic.pause();
        playMusicButton.src = 'soundElement/soundOff.png';
    }
});


// ==== Main Menu ==== //

document.getElementById('playImage').addEventListener('click', () => {
    const mainMenu = document.getElementById('mainMenu');
    const grid = document.getElementById('grid');
    const clickCountDisplay = document.getElementById('clickCount');

    // Masquer Remaining Clicks: 10 dans le menu principal
    clickCountDisplay.style.display = 'none';

    // Masquer le menu principal avec un délai
    mainMenu.style.transition = 'opacity 1s ease-in-out';
    mainMenu.style.opacity = '0';
    setTimeout(() => {
        mainMenu.style.display = 'none';
    }, 1000);

    // Afficher le jeu avec un délai
    grid.style.transition = 'opacity 1s ease-in-out';
    grid.style.opacity = '1';
    grid.style.pointerEvents = 'auto';

    // Afficher Remaining Clicks: 10 dans le jeu
    clickCountDisplay.style.display = 'block';
});


////////////////////////////////////
// Fonction createGrid.
////////////////////////////////////

const createGrid = () => {
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(8, 1fr)";
    grid.style.gap = "5px";

    // Créer la grille
    for (let i = 0; i < gridSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        const image = document.createElement('img');
        image.src = 'Images/boxAnimation/SpriteSheet/00.png';
        image.alt = 'Une boîte';
        image.style.pointerEvents = 'none';
        cell.appendChild(image);

        // Montre ou ce trouve l'intrus (a enlever si on ne veut pas tricher)
        /*
        if (i === intruderIndex) {
            cell.classList.add('intruderCell');
        }
        */

        // Ajouter un événement de clic à chaque cellule
        cell.addEventListener('click', revealCell);
        grid.appendChild(cell);
    }
};


////////////////////////////////////
// Fonction playGifAnimation.
////////////////////////////////////

const playGifAnimation = (cell) => {
    // Remplacer l'image par le GIF sur la cellule cliquer 
    const image = cell.querySelector('img');
    image.src = 'Images/boxAnimation/SpriteSheet/gif.gif';

    cell.classList.add('image-center');
    cell.classList.add('animation-played');

    // Réinitialiser l'image après l'animation
    setTimeout(() => {
        cell.classList.remove('animation-played');
        image.src = '';
        currentAnimatingCell = null;

        // Déterminer quelle image afficher après l'animation
        if (cell.dataset.index === intruderIndex.toString()) {
            image.src = 'Images/cellElement/bazooka_display.png';
        } else {
            image.src = 'Images/cellElement/fist_display.png';
        }
    }, 750);
};


////////////////////////////////////
// Fonction newIntruderPosition.
////////////////////////////////////

const newIntruderPosition = () => {
    setInterval(() => {
        if (!intruderFound && !gameOver) {
            moveIntruder();
        }
    }, 3000);
};


////////////////////////////////////
// Fonction moveIntruder.
////////////////////////////////////

const moveIntruder = () => {
    const cells = document.getElementsByClassName('cell');

     // Crée un tableau d'indices représentant les positions valides où l'intrus peut se déplacer.
    const validPositions = Array.from(cells).reduce((positions, cell, index) => {
        // Vérifie si la cellule n'a pas été déjà cliquée et n'est pas marquée comme 'intruderCell'.
        if (!cell.classList.contains('clicked') && !cell.classList.contains('intruderCell')) {
            positions.push(index);     
        }
        return positions;
    }, []);

    // Trouve une cellule valide 
    cells[intruderIndex].classList.remove('intruderCell');
    intruderIndex = validPositions[Math.floor(Math.random() * validPositions.length)];

    cells[intruderIndex].classList.add('intruderCell');
};
newIntruderPosition();


////////////////////////////////////
// Fonction revealCell.
////////////////////////////////////

const revealCell = (event) => {
    if (intruderFound || gameOver) 
        return;

    const cell = event.target;

    // Vérifier si la cellule a déjà été cliquée
    if (cell.classList.contains('clicked')) 
        return;

    const cellIndex = parseInt(cell.dataset.index);

    // Vérifier si une autre cellule est en cours d'animation
   if (currentAnimatingCell !== null) {
        return;
    }

    currentAnimatingCell = cellIndex;

    // Jouer l'animation GIF
    playGifAnimation(cell);

    if (cellIndex === intruderIndex) {
        intruderFound = true;
        resultMessage.innerHTML = ` YOU WIN! Vous avez trouvé le bazooka en ${clickCount + 1} clics!`;
    } else {
        cell.classList.add('clicked');
        if (clickCount < maxClicks) { 
        }

        clickCount++;
        clickCountDisplay.innerHTML = `Remaining Clicks: ${maxClicks - clickCount}`;

        if (clickCount >= maxClicks) {
            resultMessage.innerHTML = "GAME OVER! Vous n'avez pas trouvé le bazooka!";
            revealIntruderLocation();
            gameOver = true;
            displayLossGif();
        }
    }
};


////////////////////////////////////
// Fonction displayLossGif.
////////////////////////////////////

const displayLossGif = () => {
    const lossGif = document.createElement('img');
    lossGif.src = 'Images/explosion.gif';
    lossGif.alt = 'You lost GIF';
    lossGif.classList.add('loss-gif');

    document.body.appendChild(lossGif);

    setTimeout(() => {
        lossGif.remove();
    }, 1500); 
};


////////////////////////////////////
// Fonction revealIntruderLocation.
////////////////////////////////////

const revealIntruderLocation = () => {
    const cells = document.getElementsByClassName('cell');
    for (let i = 0; i < gridSize; i++) {
        if (i === intruderIndex) {
            // Afficher l'animation GIF sur l'intrus
            const cell = cells[i];
            const image = cell.querySelector('img');
            image.src = 'Images/boxAnimation/SpriteSheet/gif.gif';
            cell.classList.add('animation-played');
            
            setTimeout(() => {
                cell.classList.remove('animation-played');
                image.src = 'Images/cellElement/bazooka_display.png';
            }, 1000);
        }
    }
};
createGrid();