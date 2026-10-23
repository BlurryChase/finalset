// DOM elements uncalled - textWrapper, lowerThirdsBottom
// I'll come back and call these properly eventually - promise!

// Using params.json allows you to set specific variables for each text-associated action per game, or even scale it out as far as per event you do.
// The possibilities are endless! You can nest it even further if you want to! (scary)

// this function is unused here but is still called on to gather data. 
// If you want to have your bundle handle multiple events that may have different lower thirds graphics, you can manipulate the Top and Bottom variable sets using this.

// these variables cover the top and bottom text of the lower thirds
// top text variables
let topTextSize = 80;
let topTextMove = '-128px';
let topTextTime = 0.3;
let topTextDelay = 0.3;

// call replicants and establish names
const visibleRep = nodecg.Replicant('visibility');
const brbRep = nodecg.Replicant('brb'); // pulled from nodeFGC-dash
// const eventRep = nodecg.Replicant('eventGame'); // left as a comment for demonstation

// waitFors that will execute before setTimeout gives us data to work with (textFit will error out with a race condition > see getData() below for a full explanation)

// unused here but you can use a block like this to edit topText, botText variables using params.json

// NodeCG.waitForReplicants(eventRep).then(() => {
//     topTextSize = params[thisGame]["topTextSize"];
//     etc.
// });

brbRep.on('change', (newValue) => {
  // we check to see if we are visible or not to determine how data gets updated.
  updateInfoVisible(newValue);
});

function updateInfoVisible (newStuff) {
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
    gsap.to("#textWrapper", { x:0, duration:topTextTime, delay: 0, opacity:0, onComplete:function(){
      textWrapper.innerHTML = newStuff.brbText;
      textFit(document.getElementById('textWrapper'), { maxFontSize:topTextSize, alignVert:true, detectMultiLine: false});
      gsap.to("#textWrapper", { x:0, duration:topTextTime, delay: 0, opacity:1});
    }});
};
  
  
function getData(){
  /*
	the reason setTimeout/getData exists and works in the way it does is because dynamic CSS loading will not load fast enough to allow the data we want dynamically targeted to be affected by it.
	TextFit will explicitly fail because we will not have valid heights & widths to run textfit through, and so all the loops for loading will fail on the first loop.
	*/
  // load brbRep and set information
  NodeCG.waitForReplicants(brbRep).then(() => {
    updateInfoVisible(brbRep.value);
    gsap.to("#textWrapper", { x: 0, duration: topTextTime, delay: topTextDelay, opacity: 1 });
  });
};

setTimeout(getData,300);
