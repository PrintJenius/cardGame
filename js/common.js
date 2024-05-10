let cardArea = document.getElementById("cardArea");
let timerArea = document.getElementById("timerArea");
let startButton = document.getElementById("start");
let hintButton = document.getElementById("hint");
let frontCards = [];
let backCards = [];
let frontCardsRec = [];
let backCardsRec = [];
let playTime = 0;
let playOnOff = false;
let timerInterval;
let remainTimerInterval;
let chanceObj = document.getElementById("chance");
let timeObj = document.getElementById("time");
let wrongCount = document.getElementById("wrongCount");
let remainTimerOnOff = false;
let shuffleCnt = 0;

function output() {
    for (let i = 0; i < backCards.length; i++) {
        cardArea.appendChild(backCards[i]);
    }
}

function update() {
    cardArea.innerHTML = "";
    output();
}

function frontCardsCreate() {
    for (let i = 0; i < 13; i++) {
        let frontCard = document.createElement("img");
        frontCard.className = "frontCard";
        frontCard.alt = i;
        frontCard.id = i;
        frontCard.src = "card_img\\card_img\\" + i + ".png";
        frontCards.push(frontCard);
    }

    for (let i = 0; i < 13; i++) {
        let frontCard = document.createElement("img");
        frontCard.className = "frontCard";
        frontCard.alt = (i + 13);
        frontCard.id = (i * -1);
        frontCard.src = "card_img\\card_img\\" + (i + 13) + ".png";
        frontCards.push(frontCard);
    }
}

function backCardsCreate() {
    for (let i = 0; i < 26; i++) {
        let backCard = document.createElement("img");
        backCard.className = "backCard";
        backCard.alt = i;
        backCard.onclick = function () {
            cardClick(this);
        };
        backCard.src = "card_img\\card_img\\back.png";
        backCards.push(backCard);
    }
}

function allBack() {
    for (let i = 0; i < backCards.length; i++) {
        if (frontCards[i].className === "backCard")
            flip(frontCards[i]);
    }
    createRec();
}

function allFront() {
    for (let i = 0; i < backCards.length; i++) {
        if (backCards[i].className === "backCard")
            flip(backCards[i]);
    }
    createRec();
}

function shuffle() {
    if (frontCardNum() % 2 === 0) {
        for (let i = 0; i < frontCards.length; i++) {
            if (frontCards[i].className === "frontCard") {
                let tmp;
                let random = Math.floor(Math.random() * (frontCards.length));
                if (frontCards[random].className === "frontCard") {
                    tmp = frontCards[i];
                    frontCards[i] = frontCards[random];
                    frontCards[random] = tmp;
                }
            }
        }
        update();
        createRec();
    }
}

function hint() {
    if (frontCardNum() % 2 === 0 && remainingChance > 0) {
        hintOnclickRemove();
        allFront();
        setTimeout(function () {
            frontCards = frontCardsRec[1].slice();
            backCards = backCardsRec[1].slice();
            createRec();
            update();
        }, 500)
        setTimeout(function () {
            hintOnclickCreate();
        }, 500)
    }
}

function startTimer() {
    remainTimerOnOff = !remainTimerOnOff
    if (remainTimerOnOff) {
        remainTimerInterval = setInterval(function () {
            remainingTime--;
            timeObj.innerHTML = "";
            timeObj.innerHTML = remainingTime;
            if(remainingTime === -1){
                clearInterval(remainTimerInterval);
                window.alert("실패T_T");
            }
        },1000)
    }
}

function timerOnOff() {
    playOnOff = !playOnOff;
    if (playOnOff) {
        timerInterval = setInterval(function () {
            playTime++;
            timerArea.innerHTML = "";
            timerArea.innerHTML = playTime ;
        }, 1000)
        startButton.innerHTML = "";
        startButton.innerHTML = "정지";
    } else {
        clearInterval(timerInterval);
        startButton.innerHTML = "";
        startButton.innerHTML = "시작";
    }
}

function useHint() {
    if(frontCardNum() % 2 === 0 && remainingChance > 0) {
    remainingChance--;
    chanceObj.innerHTML = "";
    chanceObj.innerHTML = remainingChance;
    }
}

function createRec() {
    if (!(frontCardsRec[1] === undefined))
        frontCardsRec[2] = frontCardsRec[1].slice();
    if (!(frontCardsRec[0] === undefined))
        frontCardsRec[1] = frontCardsRec[0].slice();
    frontCardsRec[0] = frontCards.slice();
    if (!(backCardsRec[1] === undefined))
        backCardsRec[2] = backCardsRec[1].slice();
    if (!(backCardsRec[0] === undefined)) {
        backCardsRec[1] = backCardsRec[0].slice();
    }
    backCardsRec[0] = backCards.slice();
}

function flip(card) {
    idx = parseInt(card.alt, 10);
    let tmp = frontCards[idx];
    frontCards[idx] = backCards[idx];
    backCards[idx] = tmp;
    update();
}

function frontCardNum() {
    let cnt = 0;
    for (let i = 0; i < backCards.length; i++) {
        if (backCards[i].className === "frontCard")
            cnt++;
    }
    return cnt;
}

function rightAnswerCheck() {
    let point = 0;
    for (i = 0; i < backCards.length; i++) {
        if (backCards[i].className === "frontCard") {
            point += parseInt(backCards[i].id, 10);
        }
    }
    return point;
}

function onclickRemove() {
    for (let i = 0; i < backCards.length; i++) {
        if (backCards[i].className === "backCard")
            backCards[i].onclick = null;
        if (frontCards[i].className === "backCard")
            frontCards[i].onclick = null;
    }
}

function onclickCreate() {
    for (let i = 0; i < backCards.length; i++) {
        if (backCards[i].className === "backCard")
            backCards[i].onclick = function () {
                cardClick(this);
            }
        if (frontCards[i].className === "backCard")
            frontCards[i].onclick = function () {
                cardClick(this);
            }
    }
}

function hintOnclickRemove() {
    hintButton.onclick = "";
}

function hintOnclickCreate() {
    hintButton.onclick = function () {
        hint();
        useHint();
    }
}

