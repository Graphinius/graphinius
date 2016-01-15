var $G = require('../core/Graph');
function DFSVisit(graph, current_root, callbacks, dir_mode) {
    if (callbacks === void 0) { callbacks = {}; }
    if (dir_mode === void 0) { dir_mode = $G.GraphMode.MIXED; }
    var scope = {
        marked_temp: {},
        stack: [],
        adj_nodes: [],
        stack_entry: null,
        current: null,
        current_root: current_root
    };
    if (dir_mode === $G.GraphMode.INIT) {
        throw new Error('Cowardly refusing to traverse graph without edges.');
    }
    if (callbacks.init_dfs_visit) {
        execCallbacks(callbacks.init_dfs_visit, scope);
    }
    scope.stack.push({
        node: current_root,
        parent: current_root
    });
    while (scope.stack.length) {
        scope.stack_entry = scope.stack.pop();
        scope.current = scope.stack_entry.node;
        if (callbacks.node_popped) {
            execCallbacks(callbacks.node_popped, scope);
        }
        if (!scope.marked_temp[scope.current.getID()]) {
            scope.marked_temp[scope.current.getID()] = true;
            if (callbacks.node_unmarked) {
                execCallbacks(callbacks.node_unmarked, scope);
            }
            if (dir_mode === $G.GraphMode.MIXED) {
                scope.adj_nodes = scope.current.adjNodes();
            }
            else if (dir_mode === $G.GraphMode.UNDIRECTED) {
                scope.adj_nodes = scope.current.connNodes();
            }
            else if (dir_mode === $G.GraphMode.DIRECTED) {
                scope.adj_nodes = scope.current.nextNodes();
            }
            for (var adj_idx in scope.adj_nodes) {
                scope.stack.push({
                    node: scope.adj_nodes[adj_idx],
                    parent: scope.current
                });
            }
            if (callbacks.adj_nodes_pushed) {
                execCallbacks(callbacks.adj_nodes_pushed, scope);
            }
        }
        else {
            if (callbacks.node_marked) {
                execCallbacks(callbacks.node_marked, scope);
            }
        }
    }
}
exports.DFSVisit = DFSVisit;
function DFS(graph, callbacks, dir_mode) {
    if (callbacks === void 0) { callbacks = {}; }
    if (dir_mode === void 0) { dir_mode = $G.GraphMode.MIXED; }
    var scope = {
        marked: {},
        nodes: graph.getNodes()
    };
    if (callbacks.init_dfs) {
        execCallbacks(callbacks.init_dfs, scope);
    }
    callbacks.adj_nodes_pushed = callbacks.adj_nodes_pushed || [];
    var markNode = function (context) {
        scope.marked[context.current.getID()] = true;
    };
    callbacks.adj_nodes_pushed.push(markNode);
    for (var node_id in scope.nodes) {
        if (!scope.marked[node_id]) {
            DFSVisit(graph, scope.nodes[node_id], callbacks, dir_mode);
        }
    }
}
exports.DFS = DFS;
function prepareStandardDFSVisitCBs(result, callbacks, count) {
    var counter = function () {
        return count++;
    };
    callbacks.init_dfs_visit = callbacks.init_dfs_visit || [];
    callbacks.node_unmarked = callbacks.node_unmarked || [];
    var initDFSVisit = function (context) {
        result[context.current_root.getID()] = {
            parent: context.current_root
        };
    };
    callbacks.init_dfs_visit.push(initDFSVisit);
    var setResultEntry = function (context) {
        result[context.current.getID()] = {
            parent: context.stack_entry.parent,
            counter: counter()
        };
    };
    callbacks.node_unmarked.push(setResultEntry);
}
exports.prepareStandardDFSVisitCBs = prepareStandardDFSVisitCBs;
function prepareStandardDFSCBs(result, callbacks, count) {
    prepareStandardDFSVisitCBs(result, callbacks, count);
    callbacks.init_dfs = callbacks.init_dfs || [];
    var setInitialResultEntries = function (context) {
        for (var node_id in context.nodes) {
            result[node_id] = {
                parent: null,
                counter: -1
            };
        }
    };
    callbacks.init_dfs.push(setInitialResultEntries);
}
exports.prepareStandardDFSCBs = prepareStandardDFSCBs;
;
function execCallbacks(cbs, context) {
    cbs.forEach(function (cb) {
        if (typeof cb === 'function') {
            cb(context);
        }
    });
}
exports.execCallbacks = execCallbacks;
