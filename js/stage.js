let cardArea = document.getElementById("cardArea");
let timerArea = document.getElementById("timerArea");
let startButton = document.getElementById("start");
let hintButton = document.getElementById("hint");
let chanceObj = document.getElementById("chance");
let timeObj = document.getElementById("time");

let hiddenDeck = [];
let visibleDeck = [];
let hiddenDeckRec = [];
let visibleDeckRec = [];

let playOnOff = false;
let timerInterval;
let timeInterval;
let timerOnOff = false;

let allCardNum = 26;

function hiddenDeckCreate() {
    for (let i = 0; i < 13; i++) {
        let frontCard = document.createElement("img");
        frontCard.className = "frontCard";
        frontCard.alt = i;
        frontCard.id = i;
        frontCard.src = "card_img\\card_img\\" + i + ".png";
        hiddenDeck.push(frontCard);
    }

    for (let i = 0; i < 13; i++) {
        let frontCard = document.createElement("img");
        frontCard.className = "frontCard";
        frontCard.alt = (i + 13);
        frontCard.id = (i * -1);
        frontCard.src = "card_img\\card_img\\" + (i + 13) + ".png";
        hiddenDeck.push(frontCard);
    }
}

function visibleDeckCreate() {
    for (let i = 0; i < 26; i++) {
        let backCard = document.createElement("img");
        backCard.className = "backCard";
        backCard.alt = i;
        backCard.onclick = function () {
            cardClick(this);
        };
        backCard.src = "card_img\\card_img\\back.png";
        visibleDeck.push(backCard);
    }
}

function displayCardsUpdate() {
    cardArea.innerHTML = "";
    for (let i = 0; i < visibleDeck.length; i++) {
        cardArea.appendChild(visibleDeck[i]);
    }
}



function allBack() {
    for (let i = 0; i < visibleDeck.length; i++) {
        if (hiddenDeck[i].className === "backCard")
            flip(hiddenDeck[i]);
    }
    recordCardState();
}

function allFront() {
    for (let i = 0; i < visibleDeck.length; i++) {
        if (visibleDeck[i].className === "backCard")
            flip(visibleDeck[i]);
    }
    recordCardState();
}

function shuffle() {
    if (visiblefrontCardNum() % 2 === 0) {
        for (let i = 0; i < hiddenDeck.length; i++) {
            if (hiddenDeck[i].className === "frontCard") {
                let tmp;
                let random = Math.floor(Math.random() * (hiddenDeck.length));
                if (hiddenDeck[random].className === "frontCard") {
                    tmp = hiddenDeck[i];
                    hiddenDeck[i] = hiddenDeck[random];
                    hiddenDeck[random] = tmp;
                }
            }
        }
        displayCardsUpdate();
        recordCardState();
    }
}

function useHint() {
    if(visiblefrontCardNum() % 2 === 0 && remainingChance > 0) {
        hintOnclickRemove();
        allFront();
        setTimeout(function () {
            hiddenDeck = hiddenDeckRec[1].slice();
            visibleDeck = visibleDeckRec[1].slice();
            recordCardState();
            displayCardsUpdate();
        }, 500)
        setTimeout(function () {
            hintOnclickCreate();
        }, 500)
    remainingChance--;
    chanceObj.innerHTML = "";
    chanceObj.innerHTML = remainingChance;
    }
}

function startCountdown() {
    timerOnOff = !timerOnOff
    if (timerOnOff) {
        timeInterval = setInterval(function () {
            if(remainingTime === 0){
                clearInterval(timeInterval);
                window.alert("실패T_T");
                disableCardClick(); // 더 이상 카드를 뒤집을 수 없게
            } else {
                remainingTime--;
                timeObj.innerHTML = "";
                timeObj.innerHTML = remainingTime;
            }
        },1000)
    }
}

function recordCardState() {
    if (!(hiddenDeckRec[1] === undefined))
        hiddenDeckRec[2] = hiddenDeckRec[1].slice();
    if (!(hiddenDeckRec[0] === undefined))
        hiddenDeckRec[1] = hiddenDeckRec[0].slice();
    hiddenDeckRec[0] = hiddenDeck.slice();
    if (!(visibleDeckRec[1] === undefined))
        visibleDeckRec[2] = visibleDeckRec[1].slice();
    if (!(visibleDeckRec[0] === undefined)) {
        visibleDeckRec[1] = visibleDeckRec[0].slice();
    }
    visibleDeckRec[0] = visibleDeck.slice();
}

function flip(card) {
    idx = parseInt(card.alt, 10);

    let tmp = hiddenDeck[idx];
    hiddenDeck[idx] = visibleDeck[idx];
    visibleDeck[idx] = tmp;

    displayCardsUpdate();
}

function visiblefrontCardNum() {
    let cnt = 0;
    for (let i = 0; i < visibleDeck.length; i++) {
        if (visibleDeck[i].className === "frontCard")
            cnt++;
    }
    return cnt;
}

function isMatch() {
    let point = 0;
    let match = false
    for (i = 0; i < visibleDeck.length; i++) {
        if (visibleDeck[i].className === "frontCard") {
            point += parseInt(visibleDeck[i].id, 10);
        }
    }
    if(point === 0) {
        match = true;
    }
    return match;
}

function disableCardClick() {
    for (let i = 0; i < visibleDeck.length; i++) {
        if (visibleDeck[i].className === "backCard")
            visibleDeck[i].onclick = null;
        if (hiddenDeck[i].className === "backCard")
            hiddenDeck[i].onclick = null;
    }
}

function enableCardClick() {
    for (let i = 0; i < visibleDeck.length; i++) {
        if (visibleDeck[i].className === "backCard")
            visibleDeck[i].onclick = function () {
                cardClick(this);
            }
        if (hiddenDeck[i].className === "backCard")
            hiddenDeck[i].onclick = function () {
                cardClick(this);
            }
    }
}

function hintOnclickRemove() {
    hintButton.onclick = "";
}

function hintOnclickCreate() {
    hintButton.onclick = function () {
        useHint();
    }
}

function cardClick(card) { // 카드를 클릭했을 때

    flip(card); // 카드 뒤집기

    recordCardState(); // 이전 카드배열 내용 기록(되돌아 가기 위함)

    if (visiblefrontCardNum() % 2 === 0) { // 카드 중 앞면 카드가 짝수개 일 때 마다

        if (!isMatch()) {
            disableCardClick();
            setTimeout(function () {
                hiddenDeck = hiddenDeckRec[2].slice();
                visibleDeck = visibleDeckRec[2].slice();
                displayCardsUpdate();
                recordCardState();
            }, 200)
            setTimeout(function () {
                enableCardClick();
            }, 200)
        }

    }

    if (visiblefrontCardNum() === allCardNum) { 
        clearInterval(timeInterval);
        setTimeout(function () {
            window.alert("축하합니다. 성공하셨습니다.");
        }, 200)
    }
}

hiddenDeckCreate();
visibleDeckCreate();
displayCardsUpdate();
shuffle();
shuffle();
recordCardState();
startCountdown();