// Graphics Control

// declare replicants

var visControl = nodecg.Replicant('visibility');

// declare queryselectors


var scoreVisBTN = document.querySelector('#scoreVisibleButton');
var casterVisBTN = document.querySelector('#commentaryVisibleButton');
var lowerThirdsVisBTN = document.querySelector('#lowerThirdsVisibleButton');

function buttonSwap( targetButton, value ) {
  if (value === false) {
    targetButton.innerHTML = 'HIDDEN';
    targetButton.style.backgroundColor = "red";
  } else {
    targetButton.innerHTML = 'VISIBLE';
    targetButton.style.backgroundColor = "green";
  };
};

// replicant logic

visControl.on('change', newValue => {

  buttonSwap( scoreVisBTN, newValue.scoreVisibility )
  buttonSwap( casterVisBTN, newValue.casterVisibility )
  buttonSwap( lowerThirdsVisBTN, newValue.lowerThirdVisibility )

})

// declare button logic

scoreVisBTN.onclick = () => {
  if (visControl.value.scoreVisibility != true) {
    visControl.value.scoreVisibility = true;
  } else {
    visControl.value.scoreVisibility = false;
  }
};

casterVisBTN.onclick = () => {
  if (visControl.value.casterVisibility != true) {
    visControl.value.casterVisibility = true;
  } else {
    visControl.value.casterVisibility = false;
  }
};

lowerThirdsVisBTN.onclick = () => {
  if (visControl.value.lowerThirdVisibility != true) {
    visControl.value.lowerThirdVisibility = true;
  } else {
    visControl.value.lowerThirdVisibility = false;
  }
};