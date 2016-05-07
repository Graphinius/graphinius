require('../../index.js');
var yargs = require('yargs').argv;

var init = +new Date(),
    start = +new Date(),
    end,
    node_id = "1",
    graph_mode = 2;


yargs.graph = yargs.graph || "SCC100k";


//----------------------------------------------------------------
//                           LOAD TEST
//----------------------------------------------------------------
var file = '/home/bernd/Dropbox/arbeit/Graphinius/test_data/CSV/' + yargs.graph + '.csv';
var csv = new $G.input.CsvInput(' ', false, false);
var graph = csv.readFromEdgeListFile(file);
end = +new Date();
console.log(" \nRead graph " + yargs.graph + " with " + graph.nrNodes() + " nodes and " + 
            graph.nrUndEdges() + " edges in " + (end-start) + " ms.");


//----------------------------------------------------------------
//                           DEGREE DISTRIBUTION
//----------------------------------------------------------------
start = +new Date();
var deg_dist = graph.degreeDistribution();
end = +new Date();
console.log("Calculated degree distribution of " + yargs.graph + " in " + (end-start) + " ms.");


//----------------------------------------------------------------
//                           BFS TEST
//----------------------------------------------------------------
start = +new Date();
// var root = graph.getRandomNode();
var root = graph.getNodeById(node_id);
var bfs = $G.search.BFS(graph, root);
end = +new Date();
console.log("Computed BFS of " + yargs.graph + " with " + graph.nrNodes() + " nodes and " + 
            graph.nrUndEdges() + " edges in " + (end-start) + " ms.");


// start = +new Date();
// var max_distance = 0;
// for (var node_idx in bfs) {
//   if ( bfs.hasOwnProperty(node_idx) ) {
//     if ( bfs[node_idx].distance > max_distance && bfs[node_idx].distance !== Number.POSITIVE_INFINITY ) {
//       max_distance = bfs[node_idx].distance;
//     }
//   }
// }
// end = +new Date();
// console.log("Computed max reachable distance in graph of " + graph.nrNodes() + " nodes and " + 
//             graph.nrUndEdges() + " edges in " + (end-start)); // + " ms.\n Max distance is: " + max_distance

// console.log("Whole run took: " + (end-init) + " ms.");



//----------------------------------------------------------------
//                           DFS TEST
//----------------------------------------------------------------
start = +new Date();
var root = graph.getNodeById(node_id);
$G.search.DFS(graph, root);

end = +new Date();
console.log("Computed DFS of " + yargs.graph + " with " + graph.nrNodes() + " nodes and " + 
            graph.nrUndEdges() + " edges in " + (end-start) + " ms.");


// console.log("Whole run took: " + (end-init) + " ms.");



// PRELIMINARY RESULTS AFTER 5 RUNS:

// time_user = 11599
// time_sys = 488
// time_bfs_user = 2551
// time_bfs_sys = 107
// => a little faster than networkx, but 1-1.5 orders of magnitude slower
//    than optimized c libraries...

