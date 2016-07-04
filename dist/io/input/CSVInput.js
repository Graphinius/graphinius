"use strict";
var path = require('path');
var fs = require('fs');
var $G = require('../../core/Graph');
var $R = require('../../utils/remoteUtils');
var CSVInput = (function () {
    function CSVInput(_separator, _explicit_direction, _direction_mode) {
        if (_separator === void 0) { _separator = ','; }
        if (_explicit_direction === void 0) { _explicit_direction = true; }
        if (_direction_mode === void 0) { _direction_mode = false; }
        this._separator = _separator;
        this._explicit_direction = _explicit_direction;
        this._direction_mode = _direction_mode;
    }
    CSVInput.prototype.readFromAdjacencyListURL = function (fileurl, cb) {
        this.readGraphFromURL(fileurl, cb, this.readFromAdjacencyList);
    };
    CSVInput.prototype.readFromEdgeListURL = function (fileurl, cb) {
        this.readGraphFromURL(fileurl, cb, this.readFromEdgeList);
    };
    CSVInput.prototype.readGraphFromURL = function (fileurl, cb, localFun) {
        var self = this, graph_name = path.basename(fileurl), graph, request;
        if (typeof window !== 'undefined') {
            request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var input = request.responseText.split('\n');
                    graph = localFun.apply(self, [input, graph_name]);
                    cb(graph, undefined);
                }
            };
            request.open("GET", fileurl, true);
            request.setRequestHeader('Content-Type', 'text/csv; charset=ISO-8859-1');
            request.send();
        }
        else {
            $R.retrieveRemoteFile(fileurl, function (raw_graph) {
                var input = raw_graph.toString().split('\n');
                graph = localFun.apply(self, [input, graph_name]);
                cb(graph, undefined);
            });
        }
    };
    CSVInput.prototype.readFromAdjacencyListFile = function (filepath) {
        return this.readFileAndReturn(filepath, this.readFromAdjacencyList);
    };
    CSVInput.prototype.readFromEdgeListFile = function (filepath) {
        return this.readFileAndReturn(filepath, this.readFromEdgeList);
    };
    CSVInput.prototype.readFileAndReturn = function (filepath, func) {
        this.checkNodeEnvironment();
        var graph_name = path.basename(filepath);
        var input = fs.readFileSync(filepath).toString().split('\n');
        return func.apply(this, [input, graph_name]);
    };
    CSVInput.prototype.readFromAdjacencyList = function (input, graph_name) {
        var graph = new $G.BaseGraph(graph_name);
        for (var idx in input) {
            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator), node_id = elements[0], node, edge_array = elements.slice(1), edge, target_node_id, target_node, dir_char, directed, edge_id, edge_id_u2;
            if (!node_id) {
                continue;
            }
            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
            for (var e = 0; e < edge_array.length;) {
                if (this._explicit_direction && (!edge_array || edge_array.length % 2)) {
                    throw new Error('Every edge entry has to contain its direction info in explicit mode.');
                }
                target_node_id = edge_array[e++];
                target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
                dir_char = this._explicit_direction ? edge_array[e++] : this._direction_mode ? 'd' : 'u';
                if (dir_char !== 'd' && dir_char !== 'u') {
                    throw new Error("Specification of edge direction invalid (d and u are valid).");
                }
                directed = dir_char === 'd';
                edge_id = node_id + "_" + target_node_id + "_" + dir_char;
                edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
                if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
                    continue;
                }
                else {
                    edge = graph.addEdge(edge_id, node, target_node, { directed: directed });
                }
            }
        }
        return graph;
    };
    CSVInput.prototype.readFromEdgeList = function (input, graph_name) {
        var graph = new $G.BaseGraph(graph_name);
        for (var idx in input) {
            var line = input[idx], elements = this._separator.match(/\s+/g) ? line.match(/\S+/g) : line.replace(/\s+/g, '').split(this._separator);
            if (!elements) {
                continue;
            }
            if (elements.length < 2) {
                throw new Error('Edge list is in wrong format - every line has to consist of two entries (the 2 nodes)');
            }
            var node_id = elements[0], node, target_node, edge, target_node_id = elements[1], dir_char = this._explicit_direction ? elements[2] : this._direction_mode ? 'd' : 'u', directed, edge_id, edge_id_u2;
            node = graph.hasNodeID(node_id) ? graph.getNodeById(node_id) : graph.addNode(node_id);
            target_node = graph.hasNodeID(target_node_id) ? graph.getNodeById(target_node_id) : graph.addNode(target_node_id);
            if (dir_char !== 'd' && dir_char !== 'u') {
                throw new Error("Specification of edge direction invalid (d and u are valid).");
            }
            directed = dir_char === 'd';
            edge_id = node_id + "_" + target_node_id + "_" + dir_char;
            edge_id_u2 = target_node_id + "_" + node_id + "_" + dir_char;
            if (graph.hasEdgeID(edge_id) || (!directed && graph.hasEdgeID(edge_id_u2))) {
                continue;
            }
            else {
                edge = graph.addEdge(edge_id, node, target_node, { directed: directed });
            }
        }
        return graph;
    };
    CSVInput.prototype.checkNodeEnvironment = function () {
        if (typeof window !== 'undefined') {
            throw new Error('Cannot read file in browser environment.');
        }
    };
    return CSVInput;
}());
exports.CSVInput = CSVInput;
