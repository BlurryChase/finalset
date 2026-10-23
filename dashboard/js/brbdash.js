const brbText = document.querySelector('#brbText');
const brbTimer = document.querySelector('#brbTimer');
const submitButton = document.querySelector('#submitButton');
const clearButton = document.querySelector('#clearButton');

// Bracket Location & Best of

const brbRep = nodecg.Replicant('brb');
const timeRep = nodecg.Replicant('timeRep');

brbRep.on('change', newValue => {
  // The value of the Replicant has changed somewhere in NodeCG,
  // this could be another dashboard panel, a server initiated change,
  // or the doing of another user accessing your dashboard panel.
  brbText.value = newValue.brbText;
})

timeRep.on('change', newValue => {
  brbTimer.value = newValue;
})

// Replicant Changes


submitButton.onclick = () => {
  // A Replicant can be modified by modifying its `value`.
  
  // l3rds
  brbRep.value.brbText = brbText.value;
  timeRep.value = Number(brbTimer.value);
}


clearButton.onclick = () => {
  document.getElementById('brbText').value = "";
}