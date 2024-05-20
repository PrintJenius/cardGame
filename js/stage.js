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
let remainTimerOnOff = false;

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
            if(remainingTime === 0){
                clearInterval(remainTimerInterval);
                window.alert("실패T_T");
            } else {
                remainingTime--;
                timeObj.innerHTML = "";
                timeObj.innerHTML = remainingTime;
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

function cardClick(card) { // 카드를 클릭했을 때

    flip(card); // 카드 뒤집기


    createRec(); // 이전 카드배열 내용 기록(되돌아 가기 위함)

    if (frontCardNum() % 2 === 0) { // 카드 중 앞면 카드가 짝수개 일 때 마다

        if (!(rightAnswerCheck() === 0)) {
            update();
            onclickRemove();
            setTimeout(function () {
                frontCards = frontCardsRec[2].slice();
                backCards = backCardsRec[2].slice();
                update();
                createRec();
            }, 200)
            setTimeout(function () {
                onclickCreate();
            }, 200)

        }
    }

    if (frontCardNum() === 26) { // 클릭해서 뒤집은 카드가 전부 앞면일때
        update();
        clearInterval(remainTimerInterval);
        setTimeout(function () {
            window.alert("축하합니다. 성공하셨습니다.");
        }, 200)
    }
}

