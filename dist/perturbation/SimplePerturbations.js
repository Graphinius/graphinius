"use strict";
var randgen = require('../utils/randGenUtils');
var logger_1 = require('../utils/logger');
var logger = new logger_1.Logger();
var SimplePerturber = (function () {
    function SimplePerturber(_graph) {
        this._graph = _graph;
    }
    SimplePerturber.prototype.randomlyDeleteNodesPercentage = function (percentage) {
        if (percentage > 100) {
            percentage = 100;
        }
        var nr_nodes_to_delete = Math.ceil(this._graph.nrNodes() * percentage / 100);
        this.randomlyDeleteNodesAmount(nr_nodes_to_delete);
    };
    SimplePerturber.prototype.randomlyDeleteUndEdgesPercentage = function (percentage) {
        if (percentage > 100) {
            percentage = 100;
        }
        var nr_edges_to_delete = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
        this.randomlyDeleteUndEdgesAmount(nr_edges_to_delete);
    };
    SimplePerturber.prototype.randomlyDeleteDirEdgesPercentage = function (percentage) {
        if (percentage > 100) {
            percentage = 100;
        }
        var nr_edges_to_delete = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
        this.randomlyDeleteDirEdgesAmount(nr_edges_to_delete);
    };
    SimplePerturber.prototype.randomlyDeleteNodesAmount = function (amount) {
        if (amount < 0) {
            throw 'Cowardly refusing to remove a negative amount of nodes';
        }
        if (this._graph.nrNodes() === 0) {
            return;
        }
        for (var nodeID = 0, randomNodes = this._graph.pickRandomProperties(this._graph._nodes, amount); nodeID < randomNodes.length; nodeID++) {
            this._graph.deleteNode(this._graph._nodes[randomNodes[nodeID]]);
        }
    };
    SimplePerturber.prototype.randomlyDeleteUndEdgesAmount = function (amount) {
        if (amount < 0) {
            throw 'Cowardly refusing to remove a negative amount of edges';
        }
        if (this._graph.nrUndEdges() === 0) {
            return;
        }
        for (var edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph._und_edges, amount); edgeID < randomEdges.length; edgeID++) {
            this._graph.deleteEdge(this._graph._und_edges[randomEdges[edgeID]]);
        }
    };
    SimplePerturber.prototype.randomlyDeleteDirEdgesAmount = function (amount) {
        if (amount < 0) {
            throw 'Cowardly refusing to remove a negative amount of edges';
        }
        if (this._graph.nrDirEdges() === 0) {
            return;
        }
        for (var edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph._dir_edges, amount); edgeID < randomEdges.length; edgeID++) {
            this._graph.deleteEdge(this._graph._dir_edges[randomEdges[edgeID]]);
        }
    };
    SimplePerturber.prototype.randomlyAddUndEdgesPercentage = function (percentage) {
        var nr_und_edges_to_add = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
        this.randomlyAddEdgesAmount(nr_und_edges_to_add, { directed: false });
    };
    SimplePerturber.prototype.randomlyAddDirEdgesPercentage = function (percentage) {
        var nr_dir_edges_to_add = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
        this.randomlyAddEdgesAmount(nr_dir_edges_to_add, { directed: true });
    };
    SimplePerturber.prototype.randomlyAddEdgesAmount = function (amount, config) {
        if (amount <= 0) {
            throw new Error('Cowardly refusing to add a non-positive amount of edges');
        }
        var node_a, node_b, nodes;
        var direction = (config && config.directed) ? config.directed : false, dir = direction ? "_d" : "_u";
        while (amount) {
            node_a = this._graph.getRandomNode();
            while ((node_b = this._graph.getRandomNode()) === node_a) { }
            var edge_id = node_a.getID() + "_" + node_b.getID() + dir;
            if (node_a.hasEdgeID(edge_id)) {
                logger.log("Duplicate edge creation, continuing...");
                continue;
            }
            else {
                this._graph.addEdge(edge_id, node_a, node_b, { directed: direction });
                --amount;
            }
        }
        logger.log("Created " + amount + " " + (direction ? "directed" : "undirected") + " edges...");
    };
    SimplePerturber.prototype.randomlyAddNodesPercentage = function (percentage, config) {
        var nr_nodes_to_add = Math.ceil(this._graph.nrNodes() * percentage / 100);
        this.randomlyAddNodesAmount(nr_nodes_to_add, config);
    };
    SimplePerturber.prototype.randomlyAddNodesAmount = function (amount, config) {
        if (amount < 0) {
            throw 'Cowardly refusing to add a negative amount of nodes';
        }
        var new_nodes = {};
        while (amount--) {
            var new_node_id = randgen.randBase36String();
            new_nodes[new_node_id] = this._graph.addNode(new_node_id);
        }
        if (config == null) {
            return;
        }
        else {
            this.createEdgesByConfig(config, new_nodes);
        }
    };
    SimplePerturber.prototype.createEdgesByConfig = function (config, new_nodes) {
        var degree, min_degree, max_degree, deg_probability;
        if (config.und_degree != null ||
            config.dir_degree != null ||
            config.min_und_degree != null && config.max_und_degree != null ||
            config.min_dir_degree != null && config.max_dir_degree != null) {
            if ((degree = config.und_degree) != null) {
                this._graph.createRandomEdgesSpan(degree, degree, false, new_nodes);
            }
            else if ((min_degree = config.min_und_degree) != null
                && (max_degree = config.max_und_degree) != null) {
                this._graph.createRandomEdgesSpan(min_degree, max_degree, false, new_nodes);
            }
            if (degree = config.dir_degree) {
                this._graph.createRandomEdgesSpan(degree, degree, true, new_nodes);
            }
            else if ((min_degree = config.min_dir_degree) != null
                && (max_degree = config.max_dir_degree) != null) {
                this._graph.createRandomEdgesSpan(min_degree, max_degree, true, new_nodes);
            }
        }
        else {
            if (config.probability_dir != null) {
                this._graph.createRandomEdgesProb(config.probability_dir, true, new_nodes);
            }
            if (config.probability_und != null) {
                this._graph.createRandomEdgesProb(config.probability_und, false, new_nodes);
            }
        }
    };
    return SimplePerturber;
}());
exports.SimplePerturber = SimplePerturber;
