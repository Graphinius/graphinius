"use strict";
function Brandes(graph) {
    var adj_array = graph.adjListArray(), nodes = graph.getNodes();
    var s, v, w, Pred = {}, sigma = {}, delta = {}, dist = {}, Q = [], S = [], CB = {};
    var N = graph.nrNodes();
    for (var i = 0; i < N; i++) {
        s = nodes[i];
        for (var n in nodes) {
            Pred[nodes[n].getID()] = [];
        }
        for (var n in nodes) {
            dist[nodes[n].getID()] = Number.POSITIVE_INFINITY;
            sigma[nodes[n].getID()] = 0;
        }
        dist[s.getID()] = 0;
        sigma[s.getID()] = 1;
        Q.push(s);
        while (Q.length >= 1) {
            v = Q.shift();
            S.push(s);
            var neighbors = v.nextNodes();
            for (var ne in neighbors) {
                w = neighbors[ne].node;
                if (dist[w.getID()] < 0) {
                    Q.push(w);
                    dist[w.getID()] = dist[v.getID()] + 1;
                }
                if (dist[w.getID()] == dist[v.getID()] + 1) {
                    sigma[w.getID()] += sigma[v.getID()];
                    Pred[w.getID()].push(v);
                }
            }
        }
        delta = {};
        while (S.length >= 1) {
            w = S.pop();
            for (var key in Pred[w.getID()]) {
                var lvKey = Pred[w.getID()][key].getID();
                delta[lvKey] += (sigma[lvKey] / sigma[w.getID()] * (1 + delta[w.getID()]));
            }
            if (w.getID() != s.getID()) {
                CB[w.getID()] += delta[w.getID()];
            }
        }
    }
    return CB;
}
;
