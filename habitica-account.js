module.exports = RED => {
    function HabiticaAccountNode(n) {
        RED.nodes.createNode(this, n);

        this.username = n.username;
        this.userId = n.userId;
        this.apiToken = n.apiToken;
    }

    RED.nodes.registerType('habitica-account', HabiticaAccountNode);
};