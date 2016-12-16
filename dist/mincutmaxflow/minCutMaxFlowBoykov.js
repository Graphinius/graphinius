"use strict";
var MCMFBoykov = (function () {
    function MCMFBoykov(_graph, _source, _sink, config) {
        this._graph = _graph;
        this._source = _source;
        this._sink = _sink;
        this._state = {
            activeNodes: {},
            orphans: {},
            treeS: {},
            treeT: {},
            path: []
        };
        this._config = config || this.prepareMCMFStandardConfig();
    }
    MCMFBoykov.prototype.calculateCycle = function () {
        var result = {
            edges: [],
            cost: 0
        };
        return result;
    };
    MCMFBoykov.prototype.prepareMCMFStandardConfig = function () {
        return {
            directed: true
        };
    };
    return MCMFBoykov;
}());
exports.MCMFBoykov = MCMFBoykov;
