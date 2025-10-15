const https = require('https');

module.exports = RED => {
    function AcceptQuestNode(config) {
        const node = this;

        RED.nodes.createNode(node, config);

        node.apiAccount = RED.nodes.getNode(config.apiAccount);
        node.account = RED.nodes.getNode(config.account);

        const handleErr = (err, debugErr) => {
            console.log(debugErr);
            node.error('Something done broke: '+err);
            node.status({fill: 'red', shape: 'ring', text: 'Error accepting quest: '+err});
        };

        node.on('input', async function(msg) {

            const opts = {
                host: 'habitica.com',
                path: '/api/v3/groups/party/quests/accept',
                headers: {
                    'X-Client': `${node.apiAccount.username}-NodeRED`,
                    'X-API-User': node.account.userId,
                    'X-API-Key': node.account.apiToken,
                },
                method: 'POST'
            };

            const request = https.request(opts, req => {
                req.setEncoding('utf-8');
                
                let body = '',
                    response = null;

                req.on('data', data => {
                    body += data;
                });

                req.on('end', () => {
                    response = JSON.parse(body);

                    msg.payload = response.data;
                    if (response.success) {
                        node.send(msg);
                        node.status({fill: 'green', shape: 'dot', text: 'Quest accepted'});
                    }
                    else {
                        handleErr('The response was not successful: '+response.message, body);
                    }
                });
            }).on('error', err => handleErr(err));
            
            request.end();
        });
    }

    RED.nodes.registerType('habitica-accept-quest', AcceptQuestNode);
};