/**
 * For graphs larger than ~375k nodes and ~1.5M edges,
 * extend the NodeJS heap size manually by invoking
 * --max_old_space_size=4096 (size in megabytes)
 * (NodeJS standard heap size is limited to 1.7 GB)
 */

var $G = require('../../index.js');
var yargs = require('yargs').argv;

var Logger = require('../../dist/utils/logger.js').Logger,
    logger = new Logger();


var init = +new Date(),
    start = +new Date(),
    end,
    node_id = "1",
    graph_mode = 2;


var TEST_DATA_PATH = "/home/bernd/Dropbox/datasets/graphs_scc/";
yargs.graph = yargs.graph || "SCC100k";

logger.log("\nYargs: ");
logger.dir(yargs);

//----------------------------------------------------------------
//                           LOAD TEST
//----------------------------------------------------------------
var file = TEST_DATA_PATH + yargs.graph + '.csv';
var csv = new $G.input.CSVInput(' ', false, false);
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


start = +new Date();
var max_distance = 0;
for (var node_idx in bfs) {
  if ( bfs.hasOwnProperty(node_idx) ) {
    if ( bfs[node_idx].distance > max_distance && bfs[node_idx].distance !== Number.POSITIVE_INFINITY ) {
      max_distance = bfs[node_idx].distance;
    }
  }
}
end = +new Date();
console.log("Computed max reachable distance in graph of " + graph.nrNodes() + " nodes and " + 
            graph.nrUndEdges() + " edges in " + (end-start) + " ms, MAX distance is: " + max_distance);

console.log("Whole run took: " + (end-init) + " ms.");



//----------------------------------------------------------------
//                           DFS TEST
//----------------------------------------------------------------
start = +new Date();
var root = graph.getNodeById(node_id);
$G.search.DFS(graph, root);

end = +new Date();
console.log("Computed DFS of " + yargs.graph + " with " + graph.nrNodes() + " nodes and " + 
            graph.nrUndEdges() + " edges in " + (end-start) + " ms.");




// PRELIMINARY RESULTS AFTER 5 RUNS:

// time_user = 11599
// time_sys = 488
// time_bfs_user = 2551
// time_bfs_sys = 107
// => a little faster than networkx, but 1-1.5 orders of magnitude slower
//    than optimized c libraries...

