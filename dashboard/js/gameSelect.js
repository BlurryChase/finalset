const thisGame = document.querySelector('#gameInput');

// Bracket Location & Best of

const eventRep = nodecg.Replicant('eventgame');

eventRep.on('change', newValue => {
  // The value of the Replicant has changed somewhere in NodeCG,
  // this could be another dashboard panel, a server initiated change,
  // or the doing of another user accessing your dashboard panel.
  thisGame.value = newValue.gameName;
})

// Replicant Changes

const submitButton = document.querySelector('#submitButton');

submitButton.onclick = () => {
  // A Replicant can be modified by modifying its `value`.
  eventRep.value.gameName = thisGame.value;
}