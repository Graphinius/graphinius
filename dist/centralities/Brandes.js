"use strict";
function Brandes(graph) {
    var adj_array = graph.adjListArray(), nodes = graph.getNodes();
    var s, v, w, Pred = {}, sigma = {}, delta = {}, dist = {}, Q = [], S = [], CB = {};
    for (var n in nodes) {
        CB[nodes[n].getID()] = 0;
        dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
        sigma[nodes[n].getID()] = 0;
        delta[nodes[n].getID()] = 0;
    }
    var sum = 0;
    for (var i in nodes) {
        s = nodes[i];
        dist[s.getID()] = 0;
        sigma[s.getID()] = 1;
        Q.push(s);
        while (Q.length >= 1) {
            v = Q.shift();
            S.push(v);
            var neighbors = v.reachNodes();
            for (var ne in neighbors) {
                w = neighbors[ne].node;
                if (dist[w.getID()] == Number.POSITIVE_INFINITY) {
                    Q.push(w);
                    dist[w.getID()] = dist[v.getID()] + 1;
                    Pred[w.getID()] = [];
                }
                if (dist[w.getID()] == dist[v.getID()] + 1) {
                    sigma[w.getID()] += sigma[v.getID()];
                    Pred[w.getID()].push(v.getID());
                }
            }
        }
        while (S.length >= 1) {
            w = S.pop();
            for (var key in Pred[w.getID()]) {
                var lvKey = Pred[w.getID()][key];
                delta[lvKey] = delta[lvKey] + (sigma[lvKey] * (1 + delta[w.getID()]));
            }
            if (w.getID() != s.getID()) {
                CB[w.getID()] += delta[w.getID()];
                sum += delta[w.getID()];
            }
            sigma[w.getID()] = 0;
            delta[w.getID()] = 0;
            dist[w.getID()] = Number.POSITIVE_INFINITY;
        }
    }
    for (var n in nodes) {
        CB[nodes[n].getID()] /= sum;
    }
    return CB;
}
exports.Brandes = Brandes;
