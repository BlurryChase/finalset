// DOM elements uncalled - lowerThirdsTop, lowerThirdsBottom
// I'll come back and call these properly eventually - promise!

// Using params.json allows you to set specific variables for each text-associated action per game, or even scale it out as far as per event you do.
// The possibilities are endless! You can nest it even further if you want to! (scary)

// this function is unused here but is still called on to gather data. 
// If you want to have your bundle handle multiple events that may have different lower thirds graphics, you can manipulate the Top and Bottom variable sets using this.

let params = {}
fetch("js/params.json")
	.then((res) => res.json())
	.then((data) => {
		params = data;
	})

// these variables cover the top and bottom text of the lower thirds
// top text variables
let topTextSize = 60;
let topTextMove = '-128px';
let topTextTime = 0.3;
let topTextDelay = 0.3;

// bottom text variables
let botTextSize = 30;
let botTextMove = '93px';
let botTextTime = 0.3;
let botTextDelay = 0.3;

let eventName; // intentionally left empty so that if you want to edit the variables above using params.json paired with an eventGame replicant call

// call replicants and establish names
const visibleRep = nodecg.Replicant('visibility');
const lowerThirdRep = nodecg.Replicant('lowerthird', 'nodeFGC-dash'); // pulled from nodeFGC-dash

// waitFors that will execute before setTimeout gives us data to work with (textFit will error out with a race condition > see getData() below for a full explanation)

// unused here but you can use a block like this to edit topText, botText variables using params.json


// on changes

lowerThirdRep.on('change', (newValue, oldValue) => {
  if (!oldValue) return; // ignore inital undefined for oldValue when page loads
  // we check to see if we are visible or not to determine how data gets updated.
  if ( visibleRep.value.lowerThirdVisibility === true ) {
    updateInfoVisible(newValue, oldValue);
  } else {
    updateInfo(newValue);
  };
});

visibleRep.on('change', (newValue, oldValue) => {
  if (!oldValue) return; // ignore inital undefined for oldValue when page loads
  // when Visibility changes, we show or hide the graphics accordingly
  if (newValue.lowerThirdVisibility != oldValue.lowerThirdVisibility) {
    switch (newValue.lowerThirdVisibility) {
      case false: // HIDE IT ALL
        gsap.to("#lowerThirdBG", { duration: 0.3, delay: 0, opacity: 0 })
        gsap.to("#topWrapper", { duration: 0.3, delay: 0, opacity: 0 });
        gsap.to("#bottomWrapper", { duration: 0.3, delay: 0, opacity: 0 });
        break;
      case true: // SHOW IT ALL
        gsap.to("#lowerThirdBG", { duration: 0.3, delay: 0, opacity: 1 })
        gsap.to("#topWrapper", { x: 0, startAt: { x: topTextMove }, duration: topTextTime, delay: 0.3, opacity: 1 });
        gsap.to("#bottomWrapper", { x: 0, startAt: { x: botTextMove }, duration: botTextTime, delay: 0.3, opacity: 1 });
        break;
      };	
    };
});


// update functions for text data - these get used in getData later!

function updateInfo (value) {
	// this update function happens when nothing is visible. As a result, the block is very low-to-the-ground.
	// since the screen displays nothing we don't check to see if there actually was a change or not
  lowerThirdsTop.innerHTML = value.lowerThird.lowerThirdTop;
  lowerThirdsBottom.innerHTML = value.lowerThird.lowerThirdBottom;
  textFit(document.getElementById('lowerThirdsTop'), { maxFontSize: topTextSize, alignVert: true, detectMultiLine: false});
  textFit(document.getElementById('lowerThirdsBottom'), { maxFontSize: botTextSize, minFontSize: 5, alignVert: true, detectMultiLine: false, });
};

function updateInfoVisible (newStuff, oldStuff) {
  // due to information being visible, we will go through each point to see if something changed, and make it lose visibility temporarily while it gets updated and resized to fit the canvas.
	/*
	order of operations
	q: did something change? a: yes!!
	1. hide the current text with gsap
	2. modify the hidden text
	3. adjust the size of the hidden text with textfit
	4. bring it back in with gsap!
	*/
  // checking if Top Text Changed
  if (newStuff.lowerThird.lowerThirdTop != oldStuff.lowerThird.lowerThirdTop) {
    gsap.to("#lowerThirdsTop", { x:topTextMove, startAt:{x:0}, duration:topTextTime, delay: 0, opacity:0, onComplete:function(){
      lowerThirdsTop.innerHTML = newStuff.lowerThird.lowerThirdTop;
      textFit(document.getElementById('lowerThirdsTop'), { maxFontSize:topTextSize, alignVert:true, detectMultiLine: false});
      gsap.to("#lowerThirdsTop", { x:0, startAt:{x:topTextMove}, duration:topTextTime, delay: 0, opacity:1});
    }});
  };

  // checking if Bottom Text (ha!) changed
  if (newStuff.lowerThird.lowerThirdBottom != oldStuff.lowerThird.lowerThirdBottom) {
    gsap.to("#lowerThirdsBottom", { x:botTextMove, startAt:{x:0}, duration:botTextTime, delay: 0, opacity:0,onComplete:function(){
    lowerThirdsBottom.innerHTML = newStuff.lowerThird.lowerThirdBottom;
      textFit(document.getElementById('lowerThirdsBottom'), { maxFontSize: botTextSize, minFontSize: 5, detectMultiLine: false, alignVert: true });
      gsap.to("#lowerThirdsBottom", { x:0, startAt:{x:botTextMove}, duration:botTextTime, delay: 0, opacity:1 });
    }});
  };
};
  
  
function getData(){
  /*
	the reason setTimeout/getData exists and works in the way it does is because dynamic CSS loading will not load fast enough to allow the data we want dynamically targeted to be affected by it.
	TextFit will explicitly fail because we will not have valid heights & widths to run textfit through, and so all the loops for loading will fail on the first loop.
	*/
  gsap.to("#lowerThirdBG", { duration: 0.3, delay: 0, opacity: 1 });

  // load lowerThirdRep and set information
  NodeCG.waitForReplicants(lowerThirdRep).then(() => {
    updateInfo(lowerThirdRep.value);
    gsap.to("#lowerThirdsTop", { x: 0, startAt: { x: topTextMove }, duration: topTextTime, delay: topTextDelay, opacity: 1 });
    gsap.to("#lowerThirdsBottom", { x: 0, startAt: { x: botTextMove }, duration: botTextTime, delay: botTextDelay, opacity: 1 });
  });

  // when the page (re)loads, we load the visibility rep and set it to TRUE to create simple and expected behavior
  NodeCG.waitForReplicants(visibleRep).then(() => {
    // on startup, this defaults the visibility to TRUE
    visibleRep.value.lowerThirdVisibility = true;
  });
};

setTimeout(getData,300);
