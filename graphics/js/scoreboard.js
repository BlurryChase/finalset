// DOM elements - just using HTML IDs because I'm lazy
// p1Grands, p2Grands, matchLocation, matchLength, spacer

//	Using params.json allows you to set specific variables for each text-associated action per game, or even scale it out as far as per event you do.
// The possibilities are endless! You can nest it even further if you want to! (scary)

let params = {}
fetch("js/params.json")
	.then((res) => res.json())
	.then((data) => {
		params = data;
		console.log(data);
	})

let thisGame; //  declared so it can be manipulated by the Game replicant

// this set of variables determine the default values that TextFit uses, such as the max text size, movement, and delays to that movement.
// these are defaults, only around just in case params fails to load.

let nameSize = 40; // maxSize for name
let nameMove = ['-60px', '60px']; // left, right | p1, p2 -- this doesn't need to be an array if you want text manipulated in the same direction
let nameTime = 0.3; // runtime for name
let nameDelay = 0.1; // while used this is very low and exists in case you want to add further delay to names showing up/disappearing

let rdSize = 17; // maxSize for round
let rdTime = 0.2; // runtime for round

let scTime = 0.3; // runtime for score
let scDelay = 0; // time delay for score

// call the replicants through NodeCG
const eventRep = nodecg.Replicant('eventgame')  // to grab gameName
const visibleRep = nodecg.Replicant('visibility'); // replicant for visibility
const matchRep = nodecg.Replicant('match', 'nodeFGC-dash'); // pulls match.json from nodeFGC-dash

// create the link for the html page
let head = document.getElementsByTagName('HEAD')[0];
let link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';

// the above is what allows us to create game-specific css layouts. For sake of example, this project is built for Street Fighter 6, TEKKEN 8, and 2XKO.

// essential waitFors
// anything related to CSS/HTML fitting have to load first before setTimeout fires. 
// Otherwise, textFit will run into a race condition because it will try loading text first before elements have been resized for use.

NodeCG.waitForReplicants(eventRep).then(() => {
	// this waitForReplicant allows us to replace the text-associated variables with the values defined in params.json
	// this also lets us grab the gameName that we can use to create the CSS file for this layout
	thisGame = eventRep.value.gameName;
    link.href = `assets/games/match_${thisGame}.css`; // uses the gameName to find a CSS file
	link.onload = () => {
		setTimeout(getData, 0); // this allows CSS to load first before we fire our initial loads
	};
    head.appendChild(link); // appends the CSS link into HTML to be loaded

	// update textfit values using params.json info
    
    nameSize = params[thisGame]["nameSize"]; // name size
    nameMove = params[thisGame]["nameMove"]; // px move for players
    nameTime = params[thisGame]["nameTime"]; // name time

    rdSize = params[thisGame]["rdSize"]; // round size
    rdTime = params[thisGame]["rdTime"]; // round time
    
    scTime = params[thisGame]["scTime"]; // score timer
    scDelay = params[thisGame]["scDelay"]; // delay for score timer
    
});

// change functions for reps

// keep any onchange events on the same level as your replicant delcarations, or else you might run into data handling issues 
// the onchange fire could set itself with nothing instead of what we want the behavior to be

eventRep.on('change', (newValue, oldValue) => {
	if (!oldValue) return; // ignore initial onchange fire
	// whenever we change the gameName variable, it will automatically reload the page. The CSS changes will more likely than not break your current layout.
	// do note, astute eyes will notice elements zipping all over the place when the page reloads - try not to reload when your score scene is live if you can
	if (newValue.gameName != oldValue.gameName) {
		location.reload() // rise from your grave
	}

});


matchRep.on('change', (newValue, oldValue) => {
	if (!oldValue) return; // ignore initial onchange fire
	// we check to see if we are visible or not to determine how data gets updated.
	if ( visibleRep.value.scoreVisibility === true ) {
		updateInfoVisible(newValue, oldValue);
	} else {
		updateInfo(newValue);
	};
});

visibleRep.on('change', (newValue, oldValue) => {
	if (!oldValue) return; // ignore initial onchange fire
	// when Visibility changes, we show or hide the graphics accordingly
	// you can adjust the duration & delay knobs manually, or you can use the variables created at the top to apply in whatever way you see fit 
	// this includes per-game updates in params.json, if you so desire.
	if (newValue.scoreVisibility != oldValue.scoreVisibility) {
		switch (newValue.scoreVisibility) {
			case false: // HIDE IT ALL
				gsap.to("#scoreBG", { duration: 0.3, delay: 0, opacity: 0 })
				gsap.to("#p1Wrapper", { duration: 0.3, delay: 0, opacity: 0 });
				gsap.to("#p2Wrapper", { duration: 0.3, delay: 0, opacity: 0 });
				gsap.to(".scores", { duration: 0.3, delay: 0, opacity: 0 });
				gsap.to("#rdWrapper", {duration: 0.3, delay: 0, opacity: 0 });
				gsap.to("#grandsBG", { duration: 0.3, delay: 0, opacity: 0 });
				break;
			case true: // SHOW IT ALL
				gsap.to("#scoreBG", { duration: 0.3, delay: 0, opacity: 1 })
				gsap.to("#p1Wrapper", { x: 0, startAt: { x: nameMove[0] }, duration: nameTime, delay: 0.3, opacity: 1 });
				gsap.to("#p2Wrapper", { x: 0, startAt: { x: nameMove[1] }, duration: nameTime, delay: 0.3, opacity: 1 });
				gsap.to(".scores", { duration: scTime, delay: 0.3, opacity: 1 });
				gsap.to("#rdWrapper", {duration: rdTime, delay: 0.3, opacity: 1 });
				gsap.to("#grandsBG", { duration: 0.3, delay: 0, opacity: 1 });
				break;
		}	
	}
});

function bracketRotate() {
	var tl = gsap.timeline({repeat: -1});

	tl.to("#matchLocation", {duration:scTime, opacity:1});
	tl.to("#matchLocation", {duration:scTime, opacity:0, delay: 5})

	tl.to("#matchLength", {duration:scTime, opacity:1});
	tl.to("#matchLength", {duration:scTime, opacity:0, delay: 5})
}

function updateInfo ( newValue ) {

	// this update function happens when nothing is visible.
	// since the screen displays nothing we don't check to see if there actually was a change or not

	for ( let i = 0; i < 2; i++ ) {
		// for loop for Player 1 & Player 2
		document.querySelectorAll(".names")[i].innerHTML = newValue.players[i].name;
		document.querySelectorAll(".teams")[i].innerHTML = newValue.players[i].team;
		textFit(document.querySelectorAll('.nameWrapper')[i], { maxFontSize: nameSize, alignVert: true });
		document.querySelectorAll(".scores")[i].innerHTML = newValue.players[i].score;
	}
	matchLocation.innerHTML = newValue.matchInfo.matchLocation;
	textFit(document.querySelector('#matchLocation'), { maxFontSize: rdSize, alignVert: true });
	matchLength.innerHTML = newValue.matchInfo.matchLength;
	textFit(document.querySelector('#matchLength'), { maxFontSize: rdSize, alignVert: true })

}

function updateInfoVisible ( newValue , oldValue ) {

	// due to information being visible, we will go through each point to see if something changed, and make it lose visibility temporarily while it gets updated and resized to fit the canvas.
	/*
	order of operations
	q: did something change? a: yes!!
	1. hide the current text with gsap
	2. modify the hidden text
	3. adjust the size of the hidden text with textfit
	4. bring it back in with gsap! 
	*/

	for (let pNum = 0; pNum < 2; pNum++) {
		// this for loop runs twice (2) for Player 1 & Player 2

		// check if either NAME or TEAM changed
		if (newValue.players[pNum].name != oldValue.players[pNum].name || newValue.players[pNum].team != oldValue.players[pNum].team) {
			gsap.to(document.querySelectorAll(".nameWrapper")[pNum], { x:nameMove[pNum], startAt:{x:0}, duration:nameTime, delay:0, opacity:0, onComplete:function(){
				// this gsap minifunction will hide the name & team so that they can be updated, and then brings them back in
				document.querySelectorAll(".names")[pNum].innerHTML = newValue.players[pNum].name;
				document.querySelectorAll(".teams")[pNum].innerHTML = newValue.players[pNum].team;
				textFit(document.querySelectorAll(".nameWrapper")[pNum], {maxFontSize:nameSize, alignVert:true});
				gsap.to(document.querySelectorAll(".nameWrapper")[pNum], { x:0, startAt:{x:nameMove[pNum]}, duration:nameTime, delay: nameDelay, opacity:1 });
			}});
		};
		// check if SCORE changed
		if (newValue.players[pNum].score != oldValue.players[pNum].score) {
			gsap.to(document.querySelectorAll(".scores")[pNum], {duration: scTime, opacity: 0, delay: 0, onComplete: function () {
				// this gsap minifunction will hide the score so that they can be updated, and then brings them back in
				document.querySelectorAll(".scores")[pNum].innerHTML = matchRep.value.players[pNum].score;
				gsap.to(document.querySelectorAll(".scores")[pNum], { duration: scTime, opacity: 1, delay: 0 });
			}});
		};
	}; // loop ends here

	// check if BRACKET changed
	if (newValue.matchInfo.matchLocation != oldValue.matchInfo.matchLocation) {
	gsap.to("#matchLocation", { duration: rdTime, delay: 0, opacity: 0, onComplete: function () {
		// this gsap minifunction will hide the match info so that they can be updated, and then brings them back in
		matchLocation.innerHTML = m68pxatchRep.value.matchInfo.matchLocation;
		textFit(document.getElementsByClassName('rounds'), { maxFontSize: rdSize, alignVert: true });
		gsap.to("#matchLocation", {duration: rdTime, delay: 0, opacity: 1 });
		}});
	};


	if (newValue.matchInfo.matchLength != oldValue.matchInfo.matchLength) {
		gsap.to("#matchLength", { duration: rdTime, delay: 0, opacity: 0, onComplete: function () {
			// this gsap minifunction will hide the match info so that they can be updated, and then brings them back in
			matchLength.innerHTML = matchRep.value.matchInfo.matchLength;
			textFit(document.getElementsByClassName('formats'), { maxFontSize: rdSize, alignVert: true });
			gsap.to("#matchLength", {duration: rdTime, delay: 0, opacity: 1 });
			}});
	};

	// runs the Grands function to see if that needs to be made visible or not		
};

function getData() {
	/*
	the reason getData exists and works in the way it does is because dynamic CSS loading will not load fast enough to allow the data we want dynamically targeted to be affected by it.
	TextFit will explicitly fail because we will not have valid heights & widths to run textfit through, and so all the loops for loading will hang on the first loop.
	love race conditions lmao
	*/
	gsap.to("#scoreBG", { duration: 0.3, delay: 0, opacity: 1,  })

	// Load match replicant
	NodeCG.waitForReplicants(matchRep).then(() => {
		// this is the startup loop that grabs information and makes it visible				
		updateInfo (matchRep.value);
		gsap.to("#matchWrapper", {duration: rdTime, delay: 0.3, opacity: 1 });
		gsap.to("#p1Wrapper", { x: 0, startAt: { x: nameMove[0] }, duration: nameTime, delay: nameDelay, opacity: 1 });
		gsap.to("#p2Wrapper", { x: 0, startAt: { x: nameMove[1] }, duration: nameTime, delay: nameDelay, opacity: 1 });
		gsap.to(".scores", { duration: scTime, delay: 0.3, opacity: 1,  });					
		bracketRotate ()
	});
	
	NodeCG.waitForReplicants(visibleRep).then(() => {
		// on startup, this defaults the visibility to TRUE
		visibleRep.value.scoreVisibility = true;
	});
};




