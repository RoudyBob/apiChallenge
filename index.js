const baseURL = "https://avatars.dicebear.com/4.4/api/";
const sprites = ["male", "female", "human", "identicon", "initials", "bottts", "avataaars", "jdenticon", "gridy"];

let seed; // String variable to store value of seed for API

// Get elements we'll be working with on the page.
const avataarPreview = document.querySelector('.previewAvataar');
const avataarLineup = document.querySelector('.avataarLineup');
const controlButton = document.getElementById('controlBtn');
const resetButton = document.getElementById('resetBtn');

var lineupArray = []; // Used to store URLs for lineup
var suspectUrl; // Used to store the URL for the suspect

// Pick a random spot in the array that will be built to insert the 
// suspect in the lineup - Random # between 0 and 15 inclusive.
var randomPosition = Math.floor(Math.random() * (71 - 0 + 1) + 0);

// Build an array with all of the URLs for the lineup
var lineupArray = [generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(), generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(), generateURL(), generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(), generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(),generateURL(), generateURL()];

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
    lineupArray.splice(randomPosition, 1, suspectUrl);

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
    // Get a random avataar to use as the suspect
    fetch(generateURL())
        .then (response => displaySuspect(response))
        .catch (error => console.log(error));

    let countdown = 4; // Wait 3 loops @ 500ms before displaying lineup

    let interval = setInterval(async function() {
        controlButton.innerText = -- countdown;
        controlButton.style.background = "red";

        if (countdown == 0) { // If we're at the end of the countdown show the lineup!
            controlButton.style.display = "none";
            clearInterval(interval);

            let lineupDiv = document.createElement('div');

            for (character in lineupArray) {
                let input = document.createElement('input');
                input.type = "image";
                input.src = lineupArray[character] + "?r=0";
                input.className = (character == randomPosition) ? "winner" : "loser";
                lineupDiv.appendChild(input);
            }

            avataarLineup.appendChild(lineupDiv);
            avataarPreview.style.display = "none"; // Turn off suspect display
            avataarLineup.style.display = "block"; // Turn on lineup display

            // If they click on the right Avataar, call the youWin function
            let winner = document.querySelector('.winner');
            winner.addEventListener('click', youWin);

            // If they click on the wrong Avataar, call the youLose function
            let losers = document.querySelectorAll('.loser');
            losers.forEach(i => i.addEventListener('click', youLose))
        }
    }, 500);
};

// If they won, let them know
function youWin() {
    console.log("You Win!");
    let message = document.createElement('h2');
    message.innerText = "You Win!"
    message.style.color = "green";
    message.style.marginLeft = "70px";
    message.style.paddingLeft = "20px";
    message.style.paddingRight = "20px"
    avataarLineup.appendChild(message);
    cleanupGame();
};

// If they lost, let them know
function youLose() {
    console.log("You Lose!")
    let message = document.createElement('h2');
    message.innerText = "You Lose!"
    message.style.color = "red";
    message.style.marginLeft = "55px";
    message.style.paddingLeft = "10px";
    message.style.paddingRight = "10px"
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