const baseURL = "https://avatars.dicebear.com/4.4/api/";
const sprites = ["male", "female", "human", "identicon", "initials", "bottts", "avataaars", "jdenticon", "gridy"];

let seed; // String variable to store value of seed for API

// Get elements we'll be working with on the page.
let avataarPreview = document.querySelector('.previewAvataar');
let avataarLineup = document.querySelector('.avataarLineup');
let controlButton = document.getElementById('controlBtn');
let resetButton = document.getElementById('resetBtn');

var lineupArray = []; // Used to store URLs for lineup
var suspectUrl; // Used to store the URL for the suspect

// Start with lineup DIV and reset button hidden
avataarLineup.style.display = "none";
resetButton.style.display = "none";

// When user clicks the control buttom, go fetch suspect.
controlButton.addEventListener('click', fetchSuspect);

// This function generates the URL for the API call using a random string
// of numbers of the length specified as the seed.
function generateURL(length) {
    // Generate random number and convert to string, grabbing everything right of the decimal.
    let seed = Math.random().toString(length).substr(2, length); 
    
    let url = baseURL + sprites[6] + "/" + seed + ".svg";
    return url;
}

function displaySuspect(returnedSprite) {
    //console.log(returnedSprite);
    while (avataarPreview.firstChild) {
        avataarPreview.removeChild(avataarPreview.firstChild);
    }

    let img = document.createElement('img');

    img.src = returnedSprite.url;
    suspectUrl = returnedSprite.url; // Save the suspect for later
    //console.log(`Suspect URL: ${suspectUrl}`);
    img.alt = `${sprites[6]} avatar with seed ${seed}`;
    img.style.padding = 0;

    avataarPreview.style.background = "lightgray";
    avataarPreview.appendChild(img);
};

// This function contains most of the functionality for the webpage.
// It uses fetch to generate an Avataar for a suspect and then displays that suspect on the page.
// After displaying the suspect, it then builds the lineup and waits for the user to 
// make their guess.
function fetchSuspect(e) {
    fetch(generateURL())
        .then (response => displaySuspect(response))
        .catch (error => console.log(error));

    let countdown = 4; // Wait 3 loops @ 500ms before displaying lineup

    let interval = setInterval(async function() {
        controlButton.innerText = -- countdown;
        controlButton.style.background = "red";
        if (countdown == 0) {
            controlButton.style.display = "none";
            clearInterval(interval);

            avataarPreview.style.display = "none"; // Turn off suspect display
            avataarLineup.style.display = "block"; // Turn on lineup display
            
            // Pick a random spot in the array that will be built to insert the 
            // suspect in the lineup - Random # between 0 and 15 inclusive.
            let randomPosition = Math.floor(Math.random() * (15 - 0 + 1) + 0);

            for (i = 0; i < 16; i++) {
                let input = document.createElement('input');

                // If we're at the right spot in the array, insert the suspect
                // else just display one of the lineup avataars from the API.
                if (i == randomPosition) {
                    input.type = "image";
                    input.src = suspectUrl;
                    input.className = "winner";
                    avataarLineup.appendChild(input);
                } else {
                    let response = await fetch(generateURL())
                    input.type = "image";
                    input.src = response.url;
                    input.className = "loser";
                    avataarLineup.appendChild(input);
                }
            };

            // If they click on the right Avataar, call the youWin function
            let winner = document.querySelector('.winner');
            winner.addEventListener('click', youWin);

            // If they click on the wrong Avataar, call the youLose function
            let losers = document.querySelectorAll('.loser');
            losers.forEach(i => i.addEventListener('click', youLose))
        }
    }, 500);
};

// This function builds an array of 16 image URLs from the DiceBear API
function fetchLineup() {
    avataarPreview.style.display = "none";
    avataarLineup.style.display = "block";
    for (i = 0; i < 16; i++) {
        fetch(generateURL())
            .then(response => {
                lineupArray.push(response.url)
                console.log(`In Fetch Lineup, Lineup Array: ${lineupArray}`);
            })
            .catch(error => console.log(error));
    }
};

// If they won, let them know
function youWin() {
    console.log("You Win!");
    let message = document.createElement('h2');
    message.innerText = "You Win!"
    message.style.color = "green";
    message.style.marginLeft = "-25px";
    message.style.paddingLeft = "20px";
    avataarLineup.appendChild(message);
    cleanupGame();
};

// If they lost, let them know
function youLose() {
    console.log("You Lose!")
    let message = document.createElement('h2');
    message.innerText = "You Lose!"
    message.style.color = "red";
    message.style.marginLeft = "-55px";
    message.style.paddingLeft = "25px";
    avataarLineup.appendChild(message);
    cleanupGame();
};

// At the end of the game, remove all the Event Listeners so the user can't click anymore
// then display a buttom that will reload the page so they can try again.
function cleanupGame() {
    let elements = document.querySelectorAll('input')
    elements.forEach(element => element.removeEventListener('click', youLose));
    elements.forEach(element => element.removeEventListener('click', youWin));
    resetButton.style.display = "block";
};