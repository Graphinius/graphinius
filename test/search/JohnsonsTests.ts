// /// <reference path="../../typings/tsd.d.ts" />

// import * as chai from 'chai';
// import * as $G from '../../src/core/Graph';
// import * as $J from '../../src/io/input/JSONInput';
// import * as $D from '../../src/search/Dijkstra';
// import * as $PFS from '../../src/search/PFS';
// import * as $BH from '../../src/datastructs/binaryHeap';
// import * as sinon from 'sinon';
// import * as $C from '../../src/io/input/CSVInput';
// import * as $BF from '../../src/search/BellmanFord';
// import * as $N from '../../src/core/Nodes';
// // import * as $JO from '../../src/search/Johnsons';
// import * as sinonChai from 'sinon-chai';

// //these are surely needed
// chai.use(sinonChai);
// let expect = chai.expect;

// //these are likely needed
// let JSON_IN = $J.JSONInput;
// let CSV_IN = $C.CSVInput;

// //creating the spies
// let BFASpy = sinon.spy($BF.BellmanFordArray),
//     BFDSpy = sinon.spy($BF.BellmanFordDict),
//     DijkstraSpy = sinon.spy($D.Dijkstra);

// //paths to the graphs
// let search_graph = "./test/test_data/search_graph_multiple_SPs.json",
//     bf_graph_file = "./test/test_data/bellman_ford.json",
//     bf_graph_neg_cycle_file = "./test/test_data/negative_cycle.json";


// describe('Johnsons ASPS TEST -', () => {
//     //these are likely needed
//     let JSON_IN = $J.JSONInput;
//     let CSV_IN = $C.CSVInput;

//     //initialize graph objects
//     let graph_search :$G.IGraph,
//         graph_BF : $G.IGraph,
//         graph_NC : $G.IGraph;



//     //=====================!
//     //should it be redundant? I mean, 
//     //should I copy-paste those features that were tested in other files?
//     //e.g. the "it should correctly instantiate the graph", or 
//     //it should reject an undefined or null graph, etc...


//     before(() => {
//         let json: $J.IJSONInput = new $J.JSONInput(true, false, true);

//         //read in the graph objects from file
//         graph_search=json.readFromJSONFile(search_graph),
//         graph_BF = json.readFromJSONFile(bf_graph_file),
//         graph_NC = json.readFromJSONFile(bf_graph_neg_cycle_file);

//         //I tried to mimic the lines as I saw it in the Dijkstra test, but something is wrong
//         //In the Dijkstra test file, that line is also problematic
//         $BF.BellmanFordArray = BFASpy;
//         $BF.BellmanFordDict = BFDSpy;
//         $D.Dijkstra = DijkstraSpy;
//     });

//     it('should be able to identify all-positive edge graphs', () => {
//         $JO. Johnsons(graph_search, true);
//         expect.hasNWE.to.equal(false);
//         $JO. Johnsons(graph_BF, true);
//         expect.hasNWE.to.equal(true);
//     }
//     );

//     it('should send all-positive directly to Dijkstra, omitting BF', () => {
//         $JO. Johnsons(graph_search, true);
//         expect(BFASpy).to.have.not.been.called;
//         expect(BFDSpy).to.have.not.been.called;
//         expect(DijkstraSpy).to.have.been.calledOnce;
//         expect(RWGraph).to.equal(graph);

//     });

//     it('should send graphs with negative edges to BF', () => {
//         $JO. Johnsons(graph_search, true);
//         expect(BFASpy).to.have.been.calledOnce;
//         expect(BFDSpy).to.have.been.calledOnce;
//         expect(DijkstraSpy).to.have.been.calledOnce;
//         expect(graphForBF.nrNodes()).to.equal(graph.nrNodes()+1);
//         expect(graphForBF.nrUndEdges()).to.equal(graph.nrUndEdges());
//         expect(graphForBF.nrDirEdges()).to.equal(graph.nrDirEdges()+graph.nrNodes());
//         expect(RWGraph).to.not.equal(graph);

//     });

// });



// /*
// test pseudocode: 

// Step 1: checking if this is an empty graph, throw error if so - do I need this?

// Step 2: adding extra node and edges
// graph: the original graph
// graphForBF: the one with extraNode and edges

// graphForBF.nrOfNodes.expect. (graph.nrOfNodes+1)
// graphForBF.nrofEdges.expect.(graph.nrOfEdges+graph.nrOfNodes)

// 3. Bellman-Ford: 
// make sure sanity checks are performed not necessary
// make sure it detect negative cycles not necessary

// 4. re-weighing graphs
// make sure data for extraNode is deleted from the BF Result dictionary
// make sure there are no negative weight edges after the re-weighing
// make sure re-weighed graph has the same number of dir and undir edges as the original

// 5. Dijkstra
// check outputs




// */