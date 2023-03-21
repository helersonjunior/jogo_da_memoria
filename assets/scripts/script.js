let tempos = document.getElementById('tempo')
let score = document.getElementById('score')
const FRONT = "card_front"
const BACK = "card_back"
const CARD = "card"
const ICON = "icon"

startGame();

function getLocalStorage() {
    score.innerText = localStorage.getItem('time') || "99:99"
    
    if(score.innerHTML != "99:99") {
        document.getElementById('record').style.visibility = "visible"
        } 
}

function startGame() {
    initializeCards(game.createCardsFromTechs());
    getLocalStorage()
}

function initializeCards(cards) {
    let gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = '';
    game.cards.forEach(card => {

        let cardElement = document.createElement('div');
        cardElement.id = card.id;
        cardElement.classList.add(CARD);
        cardElement.classList.add('iniciarTempo')
        cardElement.dataset.icon = card.icon;

        createCardContent(card, cardElement);

        cardElement.addEventListener('click', flipCard)
        gameBoard.appendChild(cardElement);
    })
}

function createCardContent(card, cardElement) {

    createCardFace(FRONT, card, cardElement);
    createCardFace(BACK, card, cardElement);


}

function createCardFace(face, card, element) {

    let cardElementFace = document.createElement('div');
    cardElementFace.classList.add(face);
    if (face === FRONT) {
        let iconElement = document.createElement('img');
        iconElement.classList.add(ICON);
        iconElement.src = "./assets/images/" + card.icon + ".png";
        cardElementFace.appendChild(iconElement);
    } else {
        cardElementFace.innerHTML = "&lt/&gt";
    }
    element.appendChild(cardElementFace);
}


function flipCard() {


    /* console.log(this) */
    if (game.setCard(this.id)) {

        this.classList.add("flip");
        if (game.secondCard) {
            if (game.checkMatch()) {
                game.clearCards();
                if (game.checkGameOver()) {
                    let gameOverLayer = document.getElementById("gameOver");
                    gameOverLayer.style.display = 'flex';
                    document.querySelector('.gameOverTempo').innerHTML = tempos.innerText
                    pauseTime()
                }
            } else {
                setTimeout(() => {
                    let firstCardView = document.getElementById(game.firstCard.id);
                    let secondCardView = document.getElementById(game.secondCard.id);

                    firstCardView.classList.remove('flip');
                    secondCardView.classList.remove('flip');
                    game.unflipCards();
                }, 1000);

            };
        }
    }

    removeClass()

}

function restart() {
    tempos.innerHTML = ''
    game.clearCards();
    startGame();
    let gameOverLayer = document.getElementById("gameOver");
    gameOverLayer.style.display = 'none';
}

function tempo() {
    seconds = 0, minutes = 0, hours = 0

    interval = setInterval(() => {
        seconds++
        while (seconds === 60) {
            seconds = 0
            minutes++
        }
        while (minutes === 60) {
            minutes = 0
            hours++
        }

        const hoursValue = hours < 10 ? "0" + hours : hours
        const minutesValue = minutes < 10 ? "0" + minutes : minutes
        const secondsValue = seconds < 10 ? "0" + seconds : seconds

        tempos.innerHTML = /* hoursValue + ":" + */ minutesValue + ":" + secondsValue

    }, 1000);
}

const pauseTime = () => {
    clearInterval(interval)
    timeRecord()
}

function removeClass() {
    let iniciarTempo = document.querySelectorAll('.iniciarTempo')
    if (iniciarTempo.length > 0) {
        tempo()
    }
    iniciarTempo.forEach(iT => {
        iT.classList.remove('iniciarTempo')
    })
}


function timeRecord() {
    let novoTempo = tempos.innerHTML
    let minhaString = localStorage.getItem('time') || '99:99'
    
    minhaString = minhaString.substring(0, 2) + minhaString.substring(3);

    novoTempo = novoTempo.substring(0, 2) + novoTempo.substring(3);

    if (Number(novoTempo) < Number(minhaString)) {
        localStorage.setItem('time', tempos.innerText)
        console.log("set")
        getLocalStorage()
    }
}

function zerarRecord() {
    let confirmR = confirm('Rezetar o record ?')

    if (confirmR) {
        localStorage.setItem('time', '99:99')
        document.getElementById('record').style.visibility = "hidden"
        getLocalStorage()
    }
}




