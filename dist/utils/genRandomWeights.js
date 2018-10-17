"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
/**
 * @todo Refactor into it's own class with distinct methods for
 * json / csv edge lists & options regarding range, precision etc.
 */
const scc20K_path = '../../test/test_data/social_network_edges_20K.csv';
let scc20K_weighted_path = '../../test/test_data/social_network_edges_20K_weighted.csv';
let graph_string = fs.readFileSync(scc20K_path).toString();
let result_graph = "";
let line_arr;
graph_string.split("\n").forEach(line => {
    line_arr = line.trim().split(" ");
    if (line_arr.length < 2) {
        return;
    }
    line_arr.push(1 + parseFloat((Math.random() * 20).toFixed(2)));
    result_graph += line_arr.join(' ') + '\n';
});
fs.writeFileSync(scc20K_weighted_path, result_graph);
