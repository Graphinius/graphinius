"use strict";
var $G = require('../core/Graph');
var $MC = require('../mincutmaxflow/minCutMaxFlowBoykov');
var EMEBoykov = (function () {
    function EMEBoykov(_graph, _labels, config) {
        this._graph = _graph;
        this._labels = _labels;
        this._state = {
            expansionGraph: null,
            labeledGraph: null,
            activeLabel: '',
            energy: Infinity
        };
        this._config = config || this.prepareEMEStandardConfig();
        this._labels = _labels;
        this._interactionTerm = this._config.interactionTerm;
        this._dataTerm = this._config.dataTerm;
    }
    EMEBoykov.prototype.calculateCycle = function () {
        var success = false;
        for (var i = 0; i < this._labels.length; i++) {
            this._state.activeLabel = this._labels[i];
            this._state.expansionGraph = this.constructGraph();
            var source = this._state.expansionGraph.getNodeById("SOURCE");
            var sink = this._state.expansionGraph.getNodeById("SINK");
            var MinCut;
            MinCut = new $MC.MCMFBoykov(this._state.expansionGraph, source, sink);
            var mincut_result = MinCut.calculateCycle();
            if (mincut_result.cost < this._state.energy) {
                this._state.energy = mincut_result.cost;
                this._state.labeledGraph = this.labelGraph(mincut_result, source);
                success = true;
            }
        }
        if (success) {
            this.calculateCycle();
        }
        var result = {
            graph: null
        };
        result.graph = this._state.labeledGraph;
        return result;
    };
    EMEBoykov.prototype.constructGraph = function () {
        var graph = this.deepCopyGraph(this._state.labeledGraph);
        var source = graph.addNode("SOURCE");
        var sink = graph.addNode("SINK");
        var edges = graph.getUndEdges();
        for (var i = 0; i < Object.keys(edges).length; i++) {
            var edge = edges[Object.keys(edges)[i]];
            var node_p = edge.getNodes().a;
            var node_q = edge.getNodes().b;
            var edge_options = { directed: false, weighted: true, weight: 0 };
            edge_options.weight = this._dataTerm(this._state.activeLabel, node_p.getID());
            var edge_p_source = graph.addEdge(node_p.getID() + "_" + source.getID(), node_p, source, edge_options);
            edge_options.weight = this._dataTerm(this._state.activeLabel, node_q.getID());
            var edge_q_source = graph.addEdge(node_q.getID() + "_" + source.getID(), node_q, source, edge_options);
            edge_options.weight = (node_p.getLabel() == this._state.activeLabel) ? Infinity : this._dataTerm(node_p.getLabel(), node_p.getID());
            var edge_p_sink = graph.addEdge(node_p.getID() + "_" + sink.getID(), node_p, sink, edge_options);
            edge_options.weight = (node_q.getLabel() == this._state.activeLabel) ? Infinity : this._dataTerm(node_q.getLabel(), node_q.getID());
            var edge_q_sink = graph.addEdge(node_q.getID() + "_" + sink.getID(), node_q, sink, edge_options);
            if (node_p.getLabel() == node_q.getLabel()) {
                edge.setWeight(this._interactionTerm(node_p.getLabel(), this._state.activeLabel));
                continue;
            }
            var node_aux = graph.addNode("aux_" + node_p.getID() + "_" + node_q.getID());
            edge_options.weight = this._interactionTerm(node_p.getLabel(), this._state.activeLabel);
            var edge_p_aux = graph.addEdge(node_p.getID() + "_" + node_aux.getID(), node_p, node_aux, edge_options);
            edge_options.weight = this._interactionTerm(this._state.activeLabel, node_q.getLabel());
            var edge_aux_q = graph.addEdge(node_aux.getID() + "_" + node_q.getID(), node_aux, node_q, edge_options);
            edge_options.weight = this._interactionTerm(node_p.getLabel(), node_q.getLabel());
            var edge_aux_sink = graph.addEdge(node_aux.getID() + "_" + sink.getID(), node_aux, sink, edge_options);
            graph.deleteEdge(edge);
        }
        return graph;
    };
    EMEBoykov.prototype.labelGraph = function (mincut, source) {
        var graph = this._state.labeledGraph;
        for (var i = 0; i < mincut.edges.length; i++) {
            var edge = mincut.edges[i];
            var node_a = edge.getNodes().a;
            var node_b = edge.getNodes().b;
            if (node_a.getID() == source.getID()) {
                node_b.setLabel(this._state.activeLabel);
                continue;
            }
            if (node_b.getID() == source.getID()) {
                node_a.setLabel(this._state.activeLabel);
            }
        }
        return graph;
    };
    EMEBoykov.prototype.deepCopyGraph = function (graph) {
        var cGraph = new $G.BaseGraph(graph._label + "_copy");
        var nodes = graph.getNodes();
        for (var i = 0; i < Object.keys(nodes).length; i++) {
            var node = nodes[Object.keys(nodes)[i]];
            var cNode = cGraph.addNode(node.getID());
            cNode.setLabel(node.getLabel());
        }
        var edges = graph.getUndEdges();
        for (var i = 0; i < Object.keys(edges).length; i++) {
            var edge = edges[Object.keys(edges)[i]];
            var options = { directed: false, weighted: true, weight: edge.getWeight() };
            var cEdge = cGraph.addEdge(edge.getID(), edge.getNodes().a, edge.getNodes().b, options);
        }
        return cGraph;
    };
    EMEBoykov.prototype.prepareEMEStandardConfig = function () {
        var interactionTerm = function (label_a, label_b) {
            return (label_a == label_b) ? 0 : 1;
        };
        var dataTerm = function (label, node_id) {
            var observed = this._graph.getNodeById(node_id).getLabel();
            var label_number = Number(label);
            var observed_number = Number(observed);
            if (isNaN(label_number) || isNaN(observed_number)) {
                throw new Error('Cannot convert labels to numbers!');
            }
            return Math.pow(label_number - observed_number, 2);
        };
        return {
            directed: false,
            labeled: false,
            interactionTerm: interactionTerm,
            dataTerm: dataTerm
        };
    };
    return EMEBoykov;
}());
exports.EMEBoykov = EMEBoykov;
