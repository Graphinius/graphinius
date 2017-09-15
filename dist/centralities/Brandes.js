"use strict";
var $SU = require('../utils/structUtils');
function Brandes(graph) {
    var adj_array = graph.adjListArray(), nodes = graph.getNodes();
    var s, v, w, Pred = {}, sigma = {}, delta = {}, dist = {}, Q = [], S = [], CB = {};
    var N = graph.nrNodes();
    for (var i in nodes) {
        s = nodes[i];
        for (var n in nodes) {
            Pred[nodes[n].getID()] = [];
        }
        for (var n in nodes) {
            dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
            sigma[nodes[n].getID()] = 0;
            delta[nodes[n].getID()] = 0;
        }
        dist[s.getID()] = 0;
        sigma[s.getID()] = 1;
        Q.push(s);
        while (Q.length >= 1) {
            v = Q.shift();
            S.push(v);
            var neighbors = [];
            var edges = $SU.mergeObjects([v.undEdges(), v.outEdges()]);
            for (var e in edges) {
                var edge_nodes = edges[e].getNodes();
                if (edge_nodes.a.getID() == v.getID()) {
                    neighbors.push(edge_nodes.b);
                }
                else {
                    neighbors.push(edge_nodes.a);
                }
            }
            for (var ne in neighbors) {
                w = neighbors[ne];
                if (dist[w.getID()] == Number.POSITIVE_INFINITY) {
                    Q.push(w);
                    dist[w.getID()] = dist[v.getID()] + 1;
                }
                if (dist[w.getID()] == dist[v.getID()] + 1) {
                    sigma[w.getID()] += sigma[v.getID()];
                    Pred[w.getID()].push(v.getID());
                    console.log("PUSHED V:" + v.getID() + " now is:" + JSON.stringify(Pred[w.getID()]));
                }
            }
        }
        console.log("Pred: " + JSON.stringify(Pred));
        while (S.length >= 1) {
            w = S.pop();
            console.log("Popping: " + w.getID());
            console.log("Pred on w:" + JSON.stringify(Pred[w.getID()]));
            for (var key in Pred[w.getID()]) {
                var lvKey = Pred[w.getID()][key];
                console.log("Values: sigma[v]:" + sigma[lvKey] + " sigma[w]:" + sigma[w.getID()] + " delta[w]:" + delta[w.getID()]);
                delta[lvKey] = delta[lvKey] + (sigma[lvKey] / sigma[w.getID()] * (1 + delta[w.getID()]));
            }
            if (w.getID() != s.getID()) {
                CB[w.getID()] = (CB[w.getID()] | 0) + delta[w.getID()];
                CB[w.getID()] /= 2;
                console.log("CB:" + CB[w.getID()]);
            }
        }
    }
    return CB;
}
exports.Brandes = Brandes;
