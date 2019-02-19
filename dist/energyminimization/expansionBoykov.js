"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const $MC = require("../mincutmaxflow/minCutMaxFlowBoykov");
const logger_1 = require("../utils/logger");
const logger = new logger_1.Logger();
class EMEBoykov {
    constructor(_graph, _labels, config) {
        this._graph = _graph;
        this._labels = _labels;
        this._state = {
            expansionGraph: null,
            labeledGraph: null,
            activeLabel: '',
            energy: Infinity
        };
        this._config = config || this.prepareEMEStandardConfig();
        this._interactionTerm = this._config.interactionTerm;
        this._dataTerm = this._config.dataTerm;
        this._graph = this.initGraph(_graph);
        this._state.labeledGraph = this._graph.cloneStructure();
        this._state.activeLabel = this._labels[0];
    }
    calculateCycle() {
        var success = true;
        var mincut_options = { directed: true };
        while (success) {
            success = false;
            for (let i = 0; i < this._labels.length; i++) {
                this._state.activeLabel = this._labels[i];
                this._state.expansionGraph = this.constructGraph();
                var source = this._state.expansionGraph.getNodeById("SOURCE");
                var sink = this._state.expansionGraph.getNodeById("SINK");
                logger.log("compute mincut");
                var MinCut;
                MinCut = new $MC.MCMFBoykov(this._state.expansionGraph, source, sink, mincut_options);
                var mincut_result = MinCut.calculateCycle();
                logger.log("done mincut");
                if (mincut_result.cost < this._state.energy) {
                    this._state.energy = mincut_result.cost;
                    this._state.labeledGraph = this.labelGraph(mincut_result, source);
                    success = true;
                }
            }
            if (this._labels.length <= 2) {
                break;
            }
        }
        var result = {
            graph: this._state.labeledGraph
        };
        return result;
    }
    constructGraph() {
        var graph = this._state.labeledGraph.cloneStructure();
        var nodes = graph.getNodes();
        var node_ids = Object.keys(nodes);
        var source = graph.addNodeByID("SOURCE");
        var sink = graph.addNodeByID("SINK");
        var edge_ids = Object.keys(graph.getUndEdges());
        var edges_length = edge_ids.length;
        for (let i = 0; i < node_ids.length; i++) {
            var node = nodes[node_ids[i]];
            var edge_options = { directed: true, weighted: true, weight: 0 };
            edge_options.weight = this._dataTerm(this._state.activeLabel, this._graph.getNodeById(node.getID()).getLabel());
            var edge_source = graph.addEdgeByID(node.getID() + "_" + source.getID(), node, source, edge_options);
            var edge_source_reverse = graph.addEdgeByID(source.getID() + "_" + node.getID(), source, node, edge_options);
            edge_options.weight = (node.getLabel() == this._state.activeLabel) ? Infinity : this._dataTerm(node.getLabel(), this._graph.getNodeById(node.getID()).getLabel());
            var edge_sink = graph.addEdgeByID(node.getID() + "_" + sink.getID(), node, sink, edge_options);
            var edge_sink_source = graph.addEdgeByID(sink.getID() + "_" + node.getID(), sink, node, edge_options);
        }
        for (let i = 0; i < edges_length; i++) {
            var edge = graph.getEdgeById(edge_ids[i]);
            var node_p = edge.getNodes().a;
            var node_q = edge.getNodes().b;
            var edge_options = { directed: true, weighted: true, weight: 0 };
            if (node_p.getLabel() == node_q.getLabel()) {
                edge_options.weight = this._interactionTerm(node_p.getLabel(), this._state.activeLabel);
                graph.deleteEdge(edge);
                graph.addEdgeByID(node_p.getID() + "_" + node_q.getID(), node_p, node_q, edge_options);
                graph.addEdgeByID(node_q.getID() + "_" + node_p.getID(), node_q, node_p, edge_options);
                continue;
            }
            var node_aux = graph.addNodeByID("aux_" + node_p.getID() + "_" + node_q.getID());
            edge_options.weight = this._interactionTerm(node_p.getLabel(), this._state.activeLabel);
            var edge_p_aux = graph.addEdgeByID(node_p.getID() + "_" + node_aux.getID(), node_p, node_aux, edge_options);
            var edge_p_aux_reverse = graph.addEdgeByID(node_aux.getID() + "_" + node_p.getID(), node_aux, node_p, edge_options);
            edge_options.weight = this._interactionTerm(this._state.activeLabel, node_q.getLabel());
            var edge_aux_q = graph.addEdgeByID(node_aux.getID() + "_" + node_q.getID(), node_aux, node_q, edge_options);
            var edge_aux_q_reverse = graph.addEdgeByID(node_q.getID() + "_" + node_aux.getID(), node_q, node_aux, edge_options);
            edge_options.weight = this._interactionTerm(node_p.getLabel(), node_q.getLabel());
            var edge_aux_sink = graph.addEdgeByID(node_aux.getID() + "_" + sink.getID(), node_aux, sink, edge_options);
            var edge_aux_sink_reverse = graph.addEdgeByID(sink.getID() + "_" + node_aux.getID(), sink, node_aux, edge_options);
            graph.deleteEdge(edge);
        }
        return graph;
    }
    labelGraph(mincut, source) {
        var graph = this._state.labeledGraph;
        var source = this._state.expansionGraph.getNodeById("SOURCE");
        for (let i = 0; i < mincut.edges.length; i++) {
            var edge = mincut.edges[i];
            var node_a = edge.getNodes().a;
            var node_b = edge.getNodes().b;
            if (node_a.getID() == source.getID()) {
                graph.getNodeById(node_b.getID()).setLabel(this._state.activeLabel);
                continue;
            }
            if (node_b.getID() == source.getID()) {
                graph.getNodeById(node_a.getID()).setLabel(this._state.activeLabel);
            }
        }
        return graph;
    }
    initGraph(graph) {
        var nodes = graph.getNodes();
        var node_ids = Object.keys(nodes);
        var nodes_length = node_ids.length;
        for (let i = 0; i < nodes_length; i++) {
            var node = nodes[node_ids[i]];
            node.setLabel(node.getFeature('label'));
        }
        return graph;
    }
    prepareEMEStandardConfig() {
        var interactionTerm = function (label_a, label_b) {
            return (label_a == label_b) ? 0 : 1;
        };
        var dataTerm = function (label, observed) {
            var label_number = Number(label);
            var observed_number = Number(observed);
            if (isNaN(label_number) || isNaN(observed_number)) {
                throw new Error('Cannot convert labels to numbers!');
            }
            return 1.5 * Math.pow(label_number - observed_number, 2);
        };
        return {
            directed: false,
            labeled: false,
            interactionTerm: interactionTerm,
            dataTerm: dataTerm
        };
    }
}
exports.EMEBoykov = EMEBoykov;
