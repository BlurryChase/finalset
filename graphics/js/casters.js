// DOM elements - sometimes we do be a little lazy (todo: not be lazy)
// 

// Using params.json allows you to set specific variables for each text-associated action per game, or even scale it out as far as per event you do.
// The possibilities are endless! You can nest it even further if you want to! (scary)

// params ends up unused here do to not being relevant, but there will be some commented blocks that should help you turn this functionality back on
// example - you want multiple caster layouts for different games, or you want to house multiple events in the same bundle

// general init variables 
// name variables
let nameSize = 50;
let nameMove = ['-50px', '50px']; // array to allow movement from different positions
let nameTime = 0.3;
let nameDelay = 0.1;
// socials variables
let socialSize = 20;
let socialMove = ['-40px','40px']; // array to allow movement from different positions
let socialTime = 0.3;
let socialDelay = 0.1;

const casterRep = nodecg.Replicant('caster', 'nodeFGC-dash');	
const visibleRep = nodecg.Replicant('visibility'); // links Visiblity Replicant for visibility control (YES part of this package)
// const eventRep = nodecg.Replicant('eventGame'); // left as a comment for demonstation

// waitFors that will execute before setTimeout gives us data to work with (textFit will error out with a race condition > see getData() below for a full explanation)

// unused here but you can use a block like this to edit topText, botText variables using params.json

// NodeCG.waitForReplicants(eventRep).then(() => {
//     topTextSize = params[thisGame]["topTextSize"];
//     etc.
// });


// ON.CHANGE EVENTS

		
casterRep.on('change', (newValue, oldValue) => {
  	if (!oldValue) return; // ignore inital undefined for oldValue when page loads
	// we check to see if we are visible or not to determine how data gets updated.
	if ( visibleRep.value.casterVisibility === true ) {
		updateInfoVisible(newValue, oldValue);
	} else {
		updateInfo(newValue);
	};
});

visibleRep.on('change', (newValue, oldValue) => {
  	if (!oldValue) return; // ignore inital undefined for oldValue when page loads
	// when Visibility changes, we show or hide the graphics accordingly
	if (newValue.casterVisibility != oldValue.casterVisibility) {
		switch (newValue.casterVisibility) {
			case false: // HIDE IT ALL
				gsap.to("#commBG", { duration: 0.3, delay: 0, opacity: 0 })
				gsap.to("#c1Wrapper", { duration: 0.3, delay: 0, opacity: 0 });
				gsap.to("#c1Social", { duration: 0.3, delay: 0, opacity: 0 });
				gsap.to("#c2Wrapper", { duration: 0.3, delay: 0, opacity: 0 });
				gsap.to("#c2Social", { duration: 0.3, delay: 0, opacity: 0 });
				break;
			case true: // SHOW IT ALL
				gsap.to("#commBG", { duration: 0.3, delay: 0, opacity: 1 })
				gsap.to("#c1Wrapper", { x: 0, startAt: { x: nameMove[0] }, duration: nameTime, delay: 0.3, opacity: 1 });
				gsap.to("#c1Social", { x: 0, startAt: { x: socialMove[0] }, duration: socialTime, delay: 0.3, opacity: 1 });
				gsap.to("#c2Wrapper", { x: 0, startAt: { x: nameMove[1] }, duration: nameTime, delay: 0.3, opacity: 1 });
				gsap.to("#c2Social", { x: 0, startAt: { x: socialMove[1] }, duration: socialTime, delay: 0.3, opacity: 1 });
				break;
		}	
	}
});

// color update function

// text update functions - these get used in getData later!

function updateInfo ( value ) {

	for ( let i = 0; i < 2; i++ ) {
		// this update function happens when nothing is visible. As a result, the block is very low-to-the-ground.
		// since the screen displays nothing we don't check to see if there actually was a change or not
		document.querySelectorAll(".name")[i].innerHTML = value.caster[i].name;
		document.querySelectorAll(".team")[i].innerHTML = value.caster[i].team;
		document.querySelectorAll(".socials")[i].innerHTML = value.caster[i].social;
	};
};

function updateInfoVisible (newValue, oldValue) {
  // due to information being visible, we will go through each point to see if something changed, and make it lose visibility temporarily while it gets updated and resized to fit the canvas.
	/*
	order of operations
	q: did something change? a: yes!!
	1. hide the current text with gsap
	2. modify the hidden text
	3. adjust the size of the hidden text with textfit
	4. bring it back in with gsap!
	*/
	for (let i = 0; i < 2; i++) {
		// looping twice (2) for each caster
		// checking if NAME changed
		if (newValue.caster[i].name != oldValue.caster[i].name || newValue.caster[i].team != oldValue.caster[i].team) {
			gsap.to(document.querySelectorAll(".wrappers")[i], {x:nameMove[i], startAt:{x:0}, duration:nameTime, delay:0, opacity: 0,  onComplete:function(){
				document.querySelectorAll(".name")[i].innerHTML = newValue.caster[i].name;
				document.querySelectorAll(".team")[i].innerHTML = newValue.caster[i].team;
				textFit(document.querySelectorAll(".wrappers")[i], {maxFontSize:nameSize, alignVert:true});
				gsap.to(document.querySelectorAll(".wrappers")[i], {x:0, startAt:{x:nameMove[i]}, duration:nameTime, delay:0, opacity: 1 });
			}});
		};
		// checking if SOCIAL changed
		if (newValue.caster[i].social != oldValue.caster[i].social) {
			gsap.to(document.querySelectorAll(".socials")[i], {x:socialMove[i], startAt:{x:0}, duration:socialTime, delay:0, opacity: 0, onComplete:function(){
				document.querySelectorAll(".socials")[i].innerHTML = newValue.caster[i].social;
				textFit(document.querySelectorAll('.socials')[i], {maxFontSize:socialSize, alignVert:true});
				gsap.to(document.querySelectorAll(".socials")[i], {x:0, startAt:{x:socialMove[i]}, duration:socialTime, delay:0, opacity: 1 });
			}});
		};
	};
};
  
  
function getData(){
  /*
	the reason setTimeout/getData exists and works in the way it does is because dynamic CSS loading will not load fast enough to allow the data we want dynamically targeted to be affected by it.
	TextFit will explicitly fail because we will not have valid heights & widths to run textfit through, and so all the loops for loading will fail on the first loop.
	*/
	gsap.to("#commBG", { duration: 0.3, delay: 0, opacity: 1 });

	// load the caster information
	NodeCG.waitForReplicants(casterRep).then(() => {
		updateInfo (casterRep.value);
		textFit(document.getElementsByClassName('wrappers'), {maxFontSize:nameSize, alignVert:true});
		textFit(document.getElementsByClassName('socials'), {maxFontSize:socialSize, alignVert:true});
		gsap.to("#c1Wrapper", { x:0, startAt:{x:nameMove[0]}, duration:nameTime, delay:nameDelay, opacity: 1 });
		gsap.to("#c2Wrapper", { x:0, startAt:{x:nameMove[1]}, duration:nameTime, delay:nameDelay, opacity: 1 });
		gsap.to("#c1Social", { x:0, startAt:{x:socialMove[0]}, duration:socialTime, delay:socialDelay, opacity: 1 });
		gsap.to("#c2Social", { x:0, startAt:{x:socialMove[1]}, duration:socialTime, delay:socialDelay, opacity: 1 });
		});

	NodeCG.waitForReplicants(visibleRep).then(() => {
		// on startup, defaults the visibility to TRUE
		visibleRep.value.casterVisibility = true;
	});
};

setTimeout(getData,300);
