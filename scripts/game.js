/** GAME DATA  */

let COUNT = 0;
let TIMELEFT = 600; // Time left in seconds
let TOTALTIME = 600; 

let click_rate = 0; // Automatic clicks (0 by default)
let click_multiplier = 1; // Adds clicks by multiplier
let game_started = false;

let secondsInterval;

const upgrades = {
    click_mult: [
        {price: 250, multiplier: 2, bought: false},
        {price: 500, multiplier: 4, bought: false},
    ]
    
}

// Section Selectors
const clicker = document.querySelector(".btn, .game--btn");


// Timer Functions
function returnTimerText( timeleft ){
    const minutes = Math.floor(timeleft / 60);
    const seconds = timeleft - minutes * 60;

    if(seconds < 10){
        return `${minutes}:0${seconds}`
    }

    return `${minutes}:${seconds}`; 
}

function setTimer() {
    const timerBar = document.querySelector(".timer--bar");
    const clock = document.querySelector(".timer--clock");
    
    TIMELEFT -= 1; // Get it started (makes it look more snappy)

    
    timerBar.style.width = `${ TIMELEFT / TOTALTIME * 100 }%`;
    clock.innerHTML = returnTimerText( TIMELEFT );
    
    secondsInterval = setInterval( () => {
        TIMELEFT -= 1;
        timerBar.style.width = `${ TIMELEFT / TOTALTIME * 100}%`;
        clock.innerHTML = returnTimerText( TIMELEFT );

        if( TIMELEFT <= 0 ){
            setLoseScreen();
        }
    }, 1000)
}

// HTML Altering Functions
function updateCounter(){
    const counter = document.querySelector(".number");
    if(COUNT >= 1000){
        setWinScreen()
        return;
    }
    counter.textContent = COUNT;
}

function sendNotif(content, status){
    const notifBar = document.querySelector(".notif");
    const time = 1500;
    notifBar.innerHTML = `${content}`;
    notifBar.className = `notif notif--display ${status}`;
    
    setTimeout( () => {
        notifBar.innerHTML = ``;
        notifBar.className = `notif`;
    }, time )
}

function setWinScreen(){
    // change innerHTML of game
    clearInterval(secondsInterval);
    // change innerHTML of game
    const clickerUI = document.querySelector(".clicker")
    const timerText = clickerUI.querySelector(".timer > .timer--clock")
    const clickerTitle = clickerUI.querySelector(".clicker--stats > .number");
    const clickerDesc = clickerUI.querySelector(".clicker--stats > p");
    const clickerBtn = clickerUI.querySelector(".btn");
    
    clickerTitle.textContent = "You Win!!"
    clickerDesc.textContent = "You got the points in time! You rock!";
    clickerBtn.textContent = "Try Again";
    timerText.textContent = "XX:XX";
    
    clickerBtn.removeEventListener("click", upCounter)
    clickerBtn.addEventListener("click", resetGame)
}

function setLoseScreen(){
    clearInterval(secondsInterval);
    // change innerHTML of game
    const clickerUI = document.querySelector(".clicker")

    const timerText = clickerUI.querySelector(".timer > .timer--clock")
    const clickerTitle = clickerUI.querySelector(".clicker--stats > .number");
    const clickerDesc = clickerUI.querySelector(".clicker--stats > p");
    const clickerBtn = clickerUI.querySelector(".btn");
    
    clickerTitle.textContent = "Game Over"
    clickerDesc.textContent = "It seems that you didn't get the point in time. You can do this!";
    clickerBtn.textContent = "Try Again";
    timerText.textContent = "XX:XX";
    
    clickerBtn.removeEventListener("click", startGame)
    clickerBtn.addEventListener("click", resetGame)
}

function resetGame(){
    TIMELEFT = TOTALTIME;
    COUNT = 0;
    game_started = false;
    
    upgrades.click_mult.forEach(mult => mult.bought = false);
    
    const timerBar = document.querySelector(".timer--bar");
    const timerText = clicker.querySelector(".timer > .timer--clock")
    const clickerDesc = clicker.querySelector(".clicker--stats > p");
    const clickerBtn = clicker.querySelector(".btn");

    timerText.textContent = returnTimerText( TIMELEFT );
    clickerDesc.textContent = "CLICKS";
    timerBar.style.width = "100%";
    
    updateCounter();

    clickerBtn.removeEventListener("click", resetGame);
    clickerBtn.addEventListener("click", startGame);
}

// Upgrade Functions (Might change later)
function upCounter(){
    COUNT += 1 * click_multiplier;
    
    if(!game_started){
        setTimer();
        game_started = true;
        
        clickerBtn.textContent = "Click Me";
        sendNotif("Get Clickin!", "");
    }
    updateCounter();
}


// Add indicator of count
function indicateCount(e){
    
    const plus = document.createElement('div');
    const variation = 20;
    const xVar = (Math.random() * (-variation - variation)) + variation;
    
    plus.className = 'plus';
    plus.style.top = `${window.pageYOffset + e.y}px`;
    plus.style.left = `${e.x + xVar}px`;
    
    plus.innerText = `+${click_multiplier}`;
    plus.style.animation = "fade 0.5s ease-in forwards";


    clicker.classList.remove('bouncebtn');

    // Force a reflow (browser recomputes layout)
    // This is crucial to reset the animation state
    void clicker.offsetWidth; // Accessing offsetWidth forces reflow

    // Re-add the class to restart the animation
    clicker.classList.add('bouncebtn');
    
    document.body.appendChild(plus);
    setTimeout(() => {
        plus.remove();
    }, 500);
}


function buyMultUpgrade( i, btn ){
    
    const powerupItem = btn.parentNode.parentNode; // Links to li element
    powerupItem.classList.add("bought");

    const upgrade = upgrades.click_mult[i];

    if(upgrade.bought){
        sendNotif("Already puchased this item", "bad");
        return;
    }

    if(COUNT >= upgrade.price){
        COUNT -= upgrade.price;
        console.log("Price is successful")
        click_multiplier = upgrade.multiplier;

        const mult = document.querySelector('.click--mult');
        mult.innerHTML = `${click_multiplier}x Clicks`

        updateCounter()
        sendNotif("Upgrade bought sucessfully", "good");
        upgrade.bought = true;
    } else{
        sendNotif("Not enough points", "bad");
        console.log("Don't have enough points");
        // sendNotif
    }
}


// Setup
const clickerBtn = document.querySelector(".btn");
clickerBtn.textContent = "Get Started"

window.addEventListener("click", (e) => {
    const clickerDim = clicker.getBoundingClientRect();
    
    if(
        e.x > clickerDim.x && e.x < (clickerDim.x + clickerDim.width) &&
        e.y > clickerDim.y && e.y < (clickerDim.y + clickerDim.height)
    ){
        upCounter();
        indicateCount(e);
    }

})


const multBtns = document.querySelectorAll(".powerup--cta .double");
multBtns.forEach( (btn, i) => btn.addEventListener("click", () => buyMultUpgrade(i, btn) ) );