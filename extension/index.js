const WebSocket = require('ws');

module.exports = function(nodecg) {
    const wss = new WebSocket.Server({ port: 9091 }); // pick a port not used by NodeCG

    wss.on('connection', (socket) => {
        nodecg.log.info('Companion connected [Graphics]');

        // push current state immediately on connection
        socket.send(JSON.stringify({
            scoreVisibility: visibleRep.value.scoreVisibility,
            casterVisibility: visibleRep.value.casterVisibility,
            lowerThirdVisibility: visibleRep.value.lowerThirdVisibility
        }));

        // receiving data FROM Companion
        socket.on('message', (data) => {
            const parsed = JSON.parse(data);
            nodecg.log.info('Received from Companion:', parsed);
            switch(parsed.action) {
                case 'setScoreVisibility':
                    visibleRep.value.scoreVisibility = parsed.value;
                    break;
                case 'setCasterVisibility':
                    visibleRep.value.casterVisibility = parsed.value;
                    break;
                case 'setLowerThirdVisibility':
                    visibleRep.value.lowerThirdVisibility = parsed.value;
                    break;
            };
        });

        socket.on('close', () => {
            nodecg.log.info('Companion disconnected');
        });

        socket.on('error', (err) => {
            nodecg.log.error('Companion WebSocket error:', err);
        });
    });

    // sending data TO Companion
    // wrap in a helper so you can call it from anywhere in your extension
    function sendToCompanion(data) {
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }

    // example — watch a replicant and push state changes to Companion
    const visibleRep = nodecg.Replicant('visibility');
    visibleRep.on('change', (newValue) => {
        sendToCompanion({ 
            scoreVisibility: newValue.scoreVisibility,
            casterVisibility: newValue.casterVisibility,
            lowerThirdVisibility: newValue.lowerThirdVisibility
        });
    });
};