"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseNode_1 = require("./BaseNode");
const BaseEdge_1 = require("./BaseEdge");
const BFS_1 = require("../../search/BFS");
const DFS_1 = require("../../search/DFS");
const BellmanFord_1 = require("../../search/BellmanFord");
const Johnsons_1 = require("../../search/Johnsons");
const DEFAULT_WEIGHT = 1;
var GraphMode;
(function (GraphMode) {
    GraphMode[GraphMode["INIT"] = 0] = "INIT";
    GraphMode[GraphMode["DIRECTED"] = 1] = "DIRECTED";
    GraphMode[GraphMode["UNDIRECTED"] = 2] = "UNDIRECTED";
    GraphMode[GraphMode["MIXED"] = 3] = "MIXED";
})(GraphMode = exports.GraphMode || (exports.GraphMode = {}));
class BaseGraph {
    constructor(_label) {
        this._label = _label;
        this._nr_nodes = 0;
        this._nr_dir_edges = 0;
        this._nr_und_edges = 0;
        this._mode = GraphMode.INIT;
        this._nodes = {};
        this._dir_edges = {};
        this._und_edges = {};
    }
    reweighIfHasNegativeEdge(clone = false) {
        if (this.hasNegativeEdge()) {
            let result_graph = clone ? this.cloneStructure() : this;
            let extraNode = new BaseNode_1.BaseNode("extraNode");
            result_graph = Johnsons_1.addExtraNandE(result_graph, extraNode);
            let BFresult = BellmanFord_1.BellmanFordDict(result_graph, extraNode);
            if (BFresult.neg_cycle) {
                throw new Error("The graph contains a negative cycle, thus it can not be processed");
            }
            else {
                let newWeights = BFresult.distances;
                result_graph = Johnsons_1.reWeighGraph(result_graph, newWeights, extraNode);
                result_graph.deleteNode(extraNode);
            }
            return result_graph;
        }
    }
    toDirectedGraph(copy = false) {
        let result_graph = copy ? this.cloneStructure() : this;
        if (this._nr_dir_edges === 0 && this._nr_und_edges === 0) {
            throw new Error("Cowardly refusing to re-interpret an empty graph.");
        }
        return result_graph;
    }
    toUndirectedGraph() {
        return this;
    }
    hasNegativeEdge() {
        let has_neg_edge = false, edge;
        for (let edge_id in this._und_edges) {
            edge = this._und_edges[edge_id];
            if (!edge.isWeighted()) {
                continue;
            }
            if (edge.getWeight() < 0) {
                return true;
            }
        }
        for (let edge_id in this._dir_edges) {
            edge = this._dir_edges[edge_id];
            if (!edge.isWeighted()) {
                continue;
            }
            if (edge.getWeight() < 0) {
                has_neg_edge = true;
                break;
            }
        }
        return has_neg_edge;
    }
    hasNegativeCycles(node) {
        if (!this.hasNegativeEdge()) {
            return false;
        }
        let negative_cycle = false, start = node ? node : this.getRandomNode();
        DFS_1.DFS(this, start).forEach(comp => {
            let min_count = Number.POSITIVE_INFINITY, comp_start_node;
            Object.keys(comp).forEach(node_id => {
                if (min_count > comp[node_id].counter) {
                    min_count = comp[node_id].counter;
                    comp_start_node = node_id;
                }
            });
            if (BellmanFord_1.BellmanFordArray(this, this._nodes[comp_start_node]).neg_cycle) {
                negative_cycle = true;
            }
        });
        return negative_cycle;
    }
    nextArray(incoming = false) {
        let next = [], node_keys = Object.keys(this._nodes);
        const adjDict = this.adjListDict(incoming, true, 0);
        for (let i = 0; i < this._nr_nodes; ++i) {
            next.push([]);
            for (let j = 0; j < this._nr_nodes; ++j) {
                next[i].push([]);
                next[i][j].push(i === j ? j : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? j : null);
            }
        }
        return next;
    }
    adjListArray(incoming = false, include_self = false, self_dist = 0) {
        let adjList = [], node_keys = Object.keys(this._nodes);
        const adjDict = this.adjListDict(incoming, true, 0);
        for (let i = 0; i < this._nr_nodes; ++i) {
            adjList.push([]);
            for (let j = 0; j < this._nr_nodes; ++j) {
                adjList[i].push(i === j ? 0 : isFinite(adjDict[node_keys[i]][node_keys[j]]) ? adjDict[node_keys[i]][node_keys[j]] : Number.POSITIVE_INFINITY);
            }
        }
        return adjList;
    }
    adjListDict(incoming = false, include_self = false, self_dist = 0) {
        let adj_list_dict = {}, nodes = this.getNodes(), cur_dist, key, cur_edge_weight;
        for (key in nodes) {
            adj_list_dict[key] = {};
            if (include_self) {
                adj_list_dict[key][key] = self_dist;
            }
        }
        for (key in nodes) {
            let neighbors = incoming ? nodes[key].reachNodes().concat(nodes[key].prevNodes()) : nodes[key].reachNodes();
            neighbors.forEach((ne) => {
                cur_dist = adj_list_dict[key][ne.node.getID()] || Number.POSITIVE_INFINITY;
                cur_edge_weight = isNaN(ne.edge.getWeight()) ? DEFAULT_WEIGHT : ne.edge.getWeight();
                if (cur_edge_weight < cur_dist) {
                    adj_list_dict[key][ne.node.getID()] = cur_edge_weight;
                    if (incoming) {
                        adj_list_dict[ne.node.getID()][key] = cur_edge_weight;
                    }
                }
                else {
                    adj_list_dict[key][ne.node.getID()] = cur_dist;
                    if (incoming) {
                        adj_list_dict[ne.node.getID()][key] = cur_dist;
                    }
                }
            });
        }
        return adj_list_dict;
    }
    getMode() {
        return this._mode;
    }
    getStats() {
        return {
            mode: this._mode,
            nr_nodes: this._nr_nodes,
            nr_und_edges: this._nr_und_edges,
            nr_dir_edges: this._nr_dir_edges,
            density_dir: this._nr_dir_edges / (this._nr_nodes * (this._nr_nodes - 1)),
            density_und: 2 * this._nr_und_edges / (this._nr_nodes * (this._nr_nodes - 1))
        };
    }
    nrNodes() {
        return this._nr_nodes;
    }
    nrDirEdges() {
        return this._nr_dir_edges;
    }
    nrUndEdges() {
        return this._nr_und_edges;
    }
    addNodeByID(id, opts) {
        if (this.hasNodeID(id)) {
            throw new Error("Won't add node with duplicate ID.");
        }
        let node = new BaseNode_1.BaseNode(id, opts);
        return this.addNode(node) ? node : null;
    }
    addNode(node) {
        if (this.hasNodeID(node.getID())) {
            throw new Error("Won't add node with duplicate ID.");
        }
        this._nodes[node.getID()] = node;
        this._nr_nodes += 1;
        return true;
    }
    hasNodeID(id) {
        return !!this._nodes[id];
    }
    getNodeById(id) {
        return this._nodes[id];
    }
    getNodes() {
        return this._nodes;
    }
    getRandomNode() {
        return this.pickRandomProperty(this._nodes);
    }
    deleteNode(node) {
        let rem_node = this._nodes[node.getID()];
        if (!rem_node) {
            throw new Error('Cannot remove a foreign node.');
        }
        let in_deg = node.inDegree();
        let out_deg = node.outDegree();
        let deg = node.degree();
        if (in_deg) {
            this.deleteInEdgesOf(node);
        }
        if (out_deg) {
            this.deleteOutEdgesOf(node);
        }
        if (deg) {
            this.deleteUndEdgesOf(node);
        }
        delete this._nodes[node.getID()];
        this._nr_nodes -= 1;
    }
    hasEdgeID(id) {
        return !!this._dir_edges[id] || !!this._und_edges[id];
    }
    getEdgeById(id) {
        let edge = this._dir_edges[id] || this._und_edges[id];
        if (!edge) {
            throw new Error("cannot retrieve edge with non-existing ID.");
        }
        return edge;
    }
    static checkExistanceOfEdgeNodes(node_a, node_b) {
        if (!node_a) {
            throw new Error("Cannot find edge. Node A does not exist (in graph).");
        }
        if (!node_b) {
            throw new Error("Cannot find edge. Node B does not exist (in graph).");
        }
    }
    getDirEdgeByNodeIDs(node_a_id, node_b_id) {
        const node_a = this.getNodeById(node_a_id);
        const node_b = this.getNodeById(node_b_id);
        BaseGraph.checkExistanceOfEdgeNodes(node_a, node_b);
        let edges_dir = node_a.outEdges(), edges_dir_keys = Object.keys(edges_dir);
        for (let i = 0; i < edges_dir_keys.length; i++) {
            let edge = edges_dir[edges_dir_keys[i]];
            if (edge.getNodes().b.getID() == node_b_id) {
                return edge;
            }
        }
        throw new Error(`Cannot find edge. There is no edge between Node ${node_a_id} and ${node_b_id}.`);
    }
    getUndEdgeByNodeIDs(node_a_id, node_b_id) {
        const node_a = this.getNodeById(node_a_id);
        const node_b = this.getNodeById(node_b_id);
        BaseGraph.checkExistanceOfEdgeNodes(node_a, node_b);
        let edges_und = node_a.undEdges(), edges_und_keys = Object.keys(edges_und);
        for (let i = 0; i < edges_und_keys.length; i++) {
            let edge = edges_und[edges_und_keys[i]];
            let b;
            (edge.getNodes().a.getID() == node_a_id) ? (b = edge.getNodes().b.getID()) : (b = edge.getNodes().a.getID());
            if (b == node_b_id) {
                return edge;
            }
        }
    }
    getDirEdges() {
        return this._dir_edges;
    }
    getUndEdges() {
        return this._und_edges;
    }
    getDirEdgesArray() {
        let edges = [];
        for (let e_id in this._dir_edges) {
            edges.push(this._dir_edges[e_id]);
        }
        return edges;
    }
    getUndEdgesArray() {
        let edges = [];
        for (let e_id in this._und_edges) {
            edges.push(this._und_edges[e_id]);
        }
        return edges;
    }
    addEdgeByNodeIDs(label, node_a_id, node_b_id, opts) {
        let node_a = this.getNodeById(node_a_id), node_b = this.getNodeById(node_b_id);
        if (!node_a) {
            throw new Error("Cannot add edge. Node A does not exist");
        }
        else if (!node_b) {
            throw new Error("Cannot add edge. Node B does not exist");
        }
        else {
            return this.addEdgeByID(label, node_a, node_b, opts);
        }
    }
    addEdgeByID(id, node_a, node_b, opts) {
        let edge = new BaseEdge_1.BaseEdge(id, node_a, node_b, opts || {});
        return this.addEdge(edge) ? edge : null;
    }
    addEdge(edge) {
        let node_a = edge.getNodes().a, node_b = edge.getNodes().b;
        if (!this.hasNodeID(node_a.getID()) || !this.hasNodeID(node_b.getID())
            || this._nodes[node_a.getID()] !== node_a || this._nodes[node_b.getID()] !== node_b) {
            throw new Error("can only add edge between two nodes existing in graph");
        }
        node_a.addEdge(edge);
        if (edge.isDirected()) {
            node_b.addEdge(edge);
            this._dir_edges[edge.getID()] = edge;
            this._nr_dir_edges += 1;
            this.updateGraphMode();
        }
        else {
            if (node_a !== node_b) {
                node_b.addEdge(edge);
            }
            this._und_edges[edge.getID()] = edge;
            this._nr_und_edges += 1;
            this.updateGraphMode();
        }
        return true;
    }
    deleteEdge(edge) {
        let dir_edge = this._dir_edges[edge.getID()];
        let und_edge = this._und_edges[edge.getID()];
        if (!dir_edge && !und_edge) {
            throw new Error('cannot remove non-existing edge.');
        }
        let nodes = edge.getNodes();
        nodes.a.removeEdge(edge);
        if (nodes.a !== nodes.b) {
            nodes.b.removeEdge(edge);
        }
        if (dir_edge) {
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        else {
            delete this._und_edges[edge.getID()];
            this._nr_und_edges -= 1;
        }
        this.updateGraphMode();
    }
    deleteInEdgesOf(node) {
        this.checkConnectedNodeOrThrow(node);
        let in_edges = node.inEdges();
        let key, edge;
        for (key in in_edges) {
            edge = in_edges[key];
            edge.getNodes().a.removeEdge(edge);
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        node.clearInEdges();
        this.updateGraphMode();
    }
    deleteOutEdgesOf(node) {
        this.checkConnectedNodeOrThrow(node);
        let out_edges = node.outEdges();
        let key, edge;
        for (key in out_edges) {
            edge = out_edges[key];
            edge.getNodes().b.removeEdge(edge);
            delete this._dir_edges[edge.getID()];
            this._nr_dir_edges -= 1;
        }
        node.clearOutEdges();
        this.updateGraphMode();
    }
    deleteDirEdgesOf(node) {
        this.deleteInEdgesOf(node);
        this.deleteOutEdgesOf(node);
    }
    deleteUndEdgesOf(node) {
        this.checkConnectedNodeOrThrow(node);
        let und_edges = node.undEdges();
        let key, edge;
        for (key in und_edges) {
            edge = und_edges[key];
            let conns = edge.getNodes();
            conns.a.removeEdge(edge);
            if (conns.a !== conns.b) {
                conns.b.removeEdge(edge);
            }
            delete this._und_edges[edge.getID()];
            this._nr_und_edges -= 1;
        }
        node.clearUndEdges();
        this.updateGraphMode();
    }
    deleteAllEdgesOf(node) {
        this.deleteDirEdgesOf(node);
        this.deleteUndEdgesOf(node);
    }
    clearAllDirEdges() {
        for (let edge in this._dir_edges) {
            this.deleteEdge(this._dir_edges[edge]);
        }
    }
    clearAllUndEdges() {
        for (let edge in this._und_edges) {
            this.deleteEdge(this._und_edges[edge]);
        }
    }
    clearAllEdges() {
        this.clearAllDirEdges();
        this.clearAllUndEdges();
    }
    getRandomDirEdge() {
        return this.pickRandomProperty(this._dir_edges);
    }
    getRandomUndEdge() {
        return this.pickRandomProperty(this._und_edges);
    }
    cloneStructure() {
        let new_graph = new BaseGraph(this._label), old_nodes = this.getNodes(), old_edge, new_node_a = null, new_node_b = null;
        for (let node_id in old_nodes) {
            new_graph.addNode(old_nodes[node_id].clone());
        }
        [this.getDirEdges(), this.getUndEdges()].forEach((old_edges) => {
            for (let edge_id in old_edges) {
                old_edge = old_edges[edge_id];
                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
                new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
            }
        });
        return new_graph;
    }
    cloneSubGraphStructure(root, cutoff) {
        let new_graph = new BaseGraph(this._label);
        let config = BFS_1.prepareBFSStandardConfig();
        let bfsNodeUnmarkedTestCallback = function (context) {
            if (config.result[context.next_node.getID()].counter > cutoff) {
                context.queue = [];
            }
            else {
                new_graph.addNode(context.next_node.clone());
            }
        };
        config.callbacks.node_unmarked.push(bfsNodeUnmarkedTestCallback);
        BFS_1.BFS(this, root, config);
        let old_edge, new_node_a = null, new_node_b = null;
        [this.getDirEdges(), this.getUndEdges()].forEach((old_edges) => {
            for (let edge_id in old_edges) {
                old_edge = old_edges[edge_id];
                new_node_a = new_graph.getNodeById(old_edge.getNodes().a.getID());
                new_node_b = new_graph.getNodeById(old_edge.getNodes().b.getID());
                if (new_node_a != null && new_node_b != null)
                    new_graph.addEdge(old_edge.clone(new_node_a, new_node_b));
            }
        });
        return new_graph;
    }
    checkConnectedNodeOrThrow(node) {
        let inGraphNode = this._nodes[node.getID()];
        if (!inGraphNode) {
            throw new Error('Cowardly refusing to delete edges of a foreign node.');
        }
    }
    updateGraphMode() {
        let nr_dir = this._nr_dir_edges, nr_und = this._nr_und_edges;
        if (nr_dir && nr_und) {
            this._mode = GraphMode.MIXED;
        }
        else if (nr_dir) {
            this._mode = GraphMode.DIRECTED;
        }
        else if (nr_und) {
            this._mode = GraphMode.UNDIRECTED;
        }
        else {
            this._mode = GraphMode.INIT;
        }
    }
    pickRandomProperty(propList) {
        let tmpList = Object.keys(propList);
        let randomPropertyName = tmpList[Math.floor(Math.random() * tmpList.length)];
        return propList[randomPropertyName];
    }
    pickRandomProperties(propList, amount) {
        let ids = [];
        let keys = Object.keys(propList);
        let fraction = amount / keys.length;
        let used_keys = {};
        for (let i = 0; ids.length < amount && i < keys.length; i++) {
            if (Math.random() < fraction) {
                ids.push(keys[i]);
                used_keys[keys[i]] = i;
            }
        }
        let diff = amount - ids.length;
        for (let i = 0; i < keys.length && diff; i++) {
            if (used_keys[keys[i]] == null) {
                ids.push(keys[i]);
                diff--;
            }
        }
        return ids;
    }
}
exports.BaseGraph = BaseGraph;
