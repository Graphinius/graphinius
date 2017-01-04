"use strict";
var EMEBoykov = (function () {
    function EMEBoykov(_graph, _labels, config) {
        this._graph = _graph;
        this._labels = _labels;
        this._state = {
            expansionGraph: null,
            activeLabel: ''
        };
        this._config = config || this.prepareEMEStandardConfig();
        this._labels = _labels;
    }
    EMEBoykov.prototype.calculateCycle = function () {
        var success = false;
        if (success) {
            this.calculateCycle();
        }
        var result = {
            graph: null
        };
        result.graph = this._state.expansionGraph;
        return result;
    };
    EMEBoykov.prototype.prepareEMEStandardConfig = function () {
        return {
            directed: true,
            labeled: false
        };
    };
    return EMEBoykov;
}());
exports.EMEBoykov = EMEBoykov;
