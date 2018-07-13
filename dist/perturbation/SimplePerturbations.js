"use strict";
/// <reference path="../../typings/tsd.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../utils/logger");
var logger = new logger_1.Logger();
var SimplePerturber = /** @class */ (function () {
    function SimplePerturber(_graph) {
        this._graph = _graph;
    }
    /**
     *
     * @param percentage
     */
    SimplePerturber.prototype.randomlyDeleteNodesPercentage = function (percentage) {
        if (percentage > 100) {
            percentage = 100;
        }
        var nr_nodes_to_delete = Math.ceil(this._graph.nrNodes() * percentage / 100);
        this.randomlyDeleteNodesAmount(nr_nodes_to_delete);
    };
    /**
     *
     * @param percentage
     */
    SimplePerturber.prototype.randomlyDeleteUndEdgesPercentage = function (percentage) {
        if (percentage > 100) {
            percentage = 100;
        }
        var nr_edges_to_delete = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
        this.randomlyDeleteUndEdgesAmount(nr_edges_to_delete);
    };
    /**
     *
     * @param percentage
     */
    SimplePerturber.prototype.randomlyDeleteDirEdgesPercentage = function (percentage) {
        if (percentage > 100) {
            percentage = 100;
        }
        var nr_edges_to_delete = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
        this.randomlyDeleteDirEdgesAmount(nr_edges_to_delete);
    };
    /**
     *
     */
    SimplePerturber.prototype.randomlyDeleteNodesAmount = function (amount) {
        if (amount < 0) {
            throw 'Cowardly refusing to remove a negative amount of nodes';
        }
        if (this._graph.nrNodes() === 0) {
            return;
        }
        for (var nodeID = 0, randomNodes = this._graph.pickRandomProperties(this._graph.getNodes(), amount); nodeID < randomNodes.length; nodeID++) {
            this._graph.deleteNode(this._graph.getNodes()[randomNodes[nodeID]]);
        }
    };
    /**
     *
     */
    SimplePerturber.prototype.randomlyDeleteUndEdgesAmount = function (amount) {
        if (amount < 0) {
            throw 'Cowardly refusing to remove a negative amount of edges';
        }
        if (this._graph.nrUndEdges() === 0) {
            return;
        }
        for (var edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph.getUndEdges(), amount); edgeID < randomEdges.length; edgeID++) {
            this._graph.deleteEdge(this._graph.getUndEdges()[randomEdges[edgeID]]);
        }
    };
    /**
     *
     */
    SimplePerturber.prototype.randomlyDeleteDirEdgesAmount = function (amount) {
        if (amount < 0) {
            throw 'Cowardly refusing to remove a negative amount of edges';
        }
        if (this._graph.nrDirEdges() === 0) {
            return;
        }
        for (var edgeID = 0, randomEdges = this._graph.pickRandomProperties(this._graph.getDirEdges(), amount); edgeID < randomEdges.length; edgeID++) {
            this._graph.deleteEdge(this._graph.getDirEdges()[randomEdges[edgeID]]);
        }
    };
    /**
     *
     */
    SimplePerturber.prototype.randomlyAddUndEdgesPercentage = function (percentage) {
        var nr_und_edges_to_add = Math.ceil(this._graph.nrUndEdges() * percentage / 100);
        this.randomlyAddEdgesAmount(nr_und_edges_to_add, { directed: false });
    };
    /**
     *
     */
    SimplePerturber.prototype.randomlyAddDirEdgesPercentage = function (percentage) {
        var nr_dir_edges_to_add = Math.ceil(this._graph.nrDirEdges() * percentage / 100);
        this.randomlyAddEdgesAmount(nr_dir_edges_to_add, { directed: true });
    };
    /**
     *
     * DEFAULT edge direction: UNDIRECTED
     */
    SimplePerturber.prototype.randomlyAddEdgesAmount = function (amount, config) {
        if (amount <= 0) {
            throw new Error('Cowardly refusing to add a non-positive amount of edges');
        }
        var node_a, node_b, nodes;
        var direction = (config && config.directed) ? config.directed : false, dir = direction ? "_d" : "_u";
        // logger.log("DIRECTION of new edges to create: " + direction ? "directed" : "undirected");
        while (amount) {
            node_a = this._graph.getRandomNode();
            while ((node_b = this._graph.getRandomNode()) === node_a) { }
            var edge_id = node_a.getID() + "_" + node_b.getID() + dir;
            if (node_a.hasEdgeID(edge_id)) {
                // TODO: Check if the whole duplication prevention is really necessary!
                // logger.log("Duplicate edge creation, continuing...");
                continue;
            }
            else {
                /**
                 * Enable random weights for edges ??
                 */
                this._graph.addEdgeByID(edge_id, node_a, node_b, { directed: direction });
                --amount;
            }
        }
        // logger.log(`Created ${amount} ${direction ? "directed" : "undirected"} edges...`);
    };
    /**
     *
     */
    SimplePerturber.prototype.randomlyAddNodesPercentage = function (percentage, config) {
        var nr_nodes_to_add = Math.ceil(this._graph.nrNodes() * percentage / 100);
        this.randomlyAddNodesAmount(nr_nodes_to_add, config);
    };
    /**
     *
     * If the degree configuration is invalid
     * (negative or infinite degree amount / percentage)
     * the nodes will have been created nevertheless
     */
    SimplePerturber.prototype.randomlyAddNodesAmount = function (amount, config) {
        if (amount < 0) {
            throw 'Cowardly refusing to add a negative amount of nodes';
        }
        var new_nodes = {};
        while (amount--) {
            /**
             * @todo check if this procedure is 'random enough'
             */
            var new_node_id = (Math.random() + 1).toString(36).substr(2, 32) + (Math.random() + 1).toString(36).substr(2, 32);
            new_nodes[new_node_id] = this._graph.addNodeByID(new_node_id);
        }
        if (config == null) {
            return;
        }
        else {
            this.createEdgesByConfig(config, new_nodes);
        }
    };
    /**
     * Go through the degree_configuration provided and create edges
     * as requested by config
     */
    SimplePerturber.prototype.createEdgesByConfig = function (config, new_nodes) {
        var degree, min_degree, max_degree, deg_probability;
        if (config.und_degree != null ||
            config.dir_degree != null ||
            config.min_und_degree != null && config.max_und_degree != null ||
            config.min_dir_degree != null && config.max_dir_degree != null) {
            // Ignore min / max undirected degree if specific amount is given
            if ((degree = config.und_degree) != null) {
                this.createRandomEdgesSpan(degree, degree, false, new_nodes);
            }
            else if ((min_degree = config.min_und_degree) != null
                && (max_degree = config.max_und_degree) != null) {
                this.createRandomEdgesSpan(min_degree, max_degree, false, new_nodes);
            }
            // Ignore min / max directed degree if specific amount is given
            if (degree = config.dir_degree) {
                this.createRandomEdgesSpan(degree, degree, true, new_nodes);
            }
            else if ((min_degree = config.min_dir_degree) != null
                && (max_degree = config.max_dir_degree) != null) {
                this.createRandomEdgesSpan(min_degree, max_degree, true, new_nodes);
            }
        }
        else {
            if (config.probability_dir != null) {
                this.createRandomEdgesProb(config.probability_dir, true, new_nodes);
            }
            if (config.probability_und != null) {
                this.createRandomEdgesProb(config.probability_und, false, new_nodes);
            }
        }
    };
    /**
     * Simple edge generator:
     * Go through all node combinations, and
     * add an (un)directed edge with
     * @param probability and
     * @direction true or false
     * CAUTION: this algorithm takes quadratic runtime in #nodes
     */
    SimplePerturber.prototype.createRandomEdgesProb = function (probability, directed, new_nodes) {
        if (0 > probability || 1 < probability) {
            throw new Error("Probability out of range.");
        }
        directed = directed || false;
        new_nodes = new_nodes || this._graph.getNodes();
        var all_nodes = this._graph.getNodes(), node_a, node_b, edge_id, dir = directed ? '_d' : '_u';
        for (node_a in new_nodes) {
            for (node_b in all_nodes) {
                if (node_a !== node_b && Math.random() <= probability) {
                    edge_id = all_nodes[node_a].getID() + "_" + all_nodes[node_b].getID() + dir;
                    // Check if edge already exists
                    if (this._graph.getNodes()[node_a].hasEdgeID(edge_id)) {
                        continue;
                    }
                    this._graph.addEdgeByID(edge_id, all_nodes[node_a], all_nodes[node_b], { directed: directed });
                }
            }
        }
    };
    /**
     * Simple edge generator:
     * Go through all nodes, and
     * add [min, max] (un)directed edges to
     * a randomly chosen node
     * CAUTION: this algorithm could take quadratic runtime in #nodes
     * but should be much faster
     */
    SimplePerturber.prototype.createRandomEdgesSpan = function (min, max, directed, setOfNodes) {
        if (min < 0) {
            throw new Error('Minimum degree cannot be negative.');
        }
        if (max >= this._graph.nrNodes()) {
            throw new Error('Maximum degree exceeds number of reachable nodes.');
        }
        if (min > max) {
            throw new Error('Minimum degree cannot exceed maximum degree.');
        }
        directed = directed || false;
        // Do we need to set them integers before the calculations?
        var min = min | 0, max = max | 0, new_nodes = setOfNodes || this._graph.getNodes(), all_nodes = this._graph.getNodes(), idx_a, node_a, node_b, edge_id, 
        // we want edges to all possible nodes
        // TODO: enhance with types / filters later on
        node_keys = Object.keys(all_nodes), keys_len = node_keys.length, rand_idx, rand_deg, dir = directed ? '_d' : '_u';
        for (idx_a in new_nodes) {
            node_a = new_nodes[idx_a];
            rand_idx = 0;
            rand_deg = (Math.random() * (max - min) + min) | 0;
            while (rand_deg) {
                rand_idx = (keys_len * Math.random()) | 0; // should never reach keys_len...
                node_b = all_nodes[node_keys[rand_idx]];
                if (node_a !== node_b) {
                    edge_id = node_a.getID() + "_" + node_b.getID() + dir;
                    // Check if edge already exists
                    if (node_a.hasEdgeID(edge_id)) {
                        continue;
                    }
                    this._graph.addEdgeByID(edge_id, node_a, node_b, { directed: directed });
                    --rand_deg;
                }
            }
        }
    };
    return SimplePerturber;
}());
exports.SimplePerturber = SimplePerturber;
