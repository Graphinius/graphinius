"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDupe(e1, e2) {
    if (e1.isDirected() !== e2.isDirected()
        || e1.isWeighted() !== e2.isWeighted()) {
        return false;
    }
    if (!gotSameEndpoints(e1, e2)) {
        return false;
    }
}
exports.isDupe = isDupe;
function gotSameEndpoints(e1, e2) {
    const e1_nodes = e1.getNodes(), e2_nodes = e2.getNodes();
    if (e1.isDirected()) {
        return e1_nodes.a === e2_nodes.a && e1_nodes.b === e2_nodes.b;
    }
    else {
        return (e1_nodes.a === e2_nodes.a && e1_nodes.b === e2_nodes.b
            || e1_nodes.a === e2_nodes.b && e1_nodes.b === e2_nodes.a);
    }
}
exports.gotSameEndpoints = gotSameEndpoints;
