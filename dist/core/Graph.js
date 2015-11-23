var Nodes = require('./Nodes');
var GraphMode;
(function (GraphMode) {
    GraphMode[GraphMode["INIT"] = 0] = "INIT";
    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
})(GraphMode || (GraphMode = {}));
exports.GraphMode = GraphMode;
;
var Graph = (function () {
    function Graph() {
        this._mode = GraphMode.INIT;
    }
    Graph.prototype.addNode = function () {
        var node = new Nodes.BaseNode(1, "new");
        return node;
    };
    return Graph;
})();
exports.Graph = Graph;
