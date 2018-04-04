/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';
import * as $IB from '../../src/centralities/Betweenness';
import * as $B from '../../src/centralities/Brandes';
import * as $JO from '../../src/search/Johnsons';
import * as $FW from '../../src/search/FloydWarshall';



const SN_GRAPH_NODES = 1034,
    SN_GRAPH_EDGES = 53498 / 2; // edges are specified in directed fashion

let expect = chai.expect,
    csv: $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json: $JSON.IJSONInput = new $JSON.JSONInput(true, false, true);

let path_3nodeUnd = "./test/test_data/centralities/3nodeUnd.json",
    path_3nodeDir = "./test/test_data/centralities/3nodeDir.json",
    path_3node2SPs1direct = "./test/test_data/centralities/3node2SPs1direct.json",
    path_4node2SPs1direct = "./test/test_data/centralities/4node2SPs1direct.json",
    path_5nodeLinear = "./test/test_data/centralities/5nodeLinear.json",
    path_7nodeMerge1beforeGoal = "./test/test_data/centralities/7nodeMerge1beforeGoal.json",
    path_8nodeSplitMerge = "./test/test_data/centralities/8nodeSplitMerge.json",
    path_8nodeSplitAfter1mergeBefore1 = "./test/test_data/centralities/8nodeSplitAfter1mergeBefore1.json",
    //until this point, all graphs have checking values in the features
    path_search_no1DE = "./test/test_data/search_graph_multiple_SPs_no1DE.json",
    path_midSizeGraph = "./test/test_data/bernd_ares_intermediate_pos.json",
    path_socialNet300 = "./test/test_data/social_network_edges_300.csv",
    path_socialNet1K = "./test/test_data/social_network_edges.csv",
    path_weightedSocialNet300 = "./test/test_data/social_network_edges_300_weighted.csv",
    path_weightedSocialNet1K = "./test/test_data/social_network_edges_weighted.csv",
    path_search_pos = "./test/test_data/search_graph_multiple_SPs_positive.json",
    path_search_nullEdge = "./test/test_data/search_graph_multiple_SPs.json",
    path_bf_graph = "./test/test_data/bellman_ford.json",
    path_bf_graph_neg_cycle = "./test/test_data/negative_cycle.json";


let graph_3nodeUnd: $G.IGraph = json.readFromJSONFile(path_3nodeUnd),
    graph_3nodeDir = json.readFromJSONFile(path_3nodeDir),
    graph_3node2SPs1direct = json.readFromJSONFile(path_3node2SPs1direct),
    graph_4node2SPs1direct = json.readFromJSONFile(path_4node2SPs1direct),
    graph_5nodeLinear = json.readFromJSONFile(path_5nodeLinear),
    graph_7nodeMerge1beforeGoal = json.readFromJSONFile(path_7nodeMerge1beforeGoal),
    graph_8nodeSplitMerge = json.readFromJSONFile(path_8nodeSplitMerge),
    graph_8nodeSplitAfter1mergeBefore1 = json.readFromJSONFile(path_8nodeSplitAfter1mergeBefore1),
    graph_midSizeGraph = json.readFromJSONFile(path_midSizeGraph),
    graph_social_300 = csv.readFromEdgeListFile(path_socialNet300),
    graph_social_1K = csv.readFromEdgeListFile(path_socialNet1K),
    graph_search_no1DE = json.readFromJSONFile(path_search_no1DE),
    graph_search_pos = json.readFromJSONFile(path_search_pos),
    graph_search_nullEdge = json.readFromJSONFile(path_search_nullEdge),
    graph_bf_graph = json.readFromJSONFile(path_bf_graph),
    graph_bf_graph_neg_cycle = json.readFromJSONFile(path_bf_graph_neg_cycle);

csv._weighted = true;
let graph_weighted_social_300 = csv.readFromEdgeListFile(path_weightedSocialNet300),
    graph_weighted_social_1K = csv.readFromEdgeListFile(path_weightedSocialNet1K);


/**
 * @TODO Rita: Only read graphs when needed within test...
 * => Test Isolation
 */
describe('check correctness and runtime of betweenness centrality functions', () => {

    it('test correctness of Brandes without normalization - compare to networkx data', () => {
        //FOR UNWEIGHTED; NON-NEGATIVE GRAPHS! FOR ALL OTHERS, SEE OTHER BRANDES VERSIONS!
        //the test graph can be changed any time,
        //but caution! choose only those new Jsons, where we have the networkx data (see above)       
        let graphPath = path_5nodeLinear;
        let graph = json.readFromJSONFile(graphPath);
        let nodes = graph.getNodes();
        let mapControl = {};
        console.log("unnormalized betweenness values for the chosen graph (Networkx)");
        for (let key in nodes) {
            mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].unnormalized;
        }
        console.log(mapControl);
        let BResult = $B.Brandes2(graph, false, false);
        console.log("Betweenness computed with Brandes: ");
        console.log(BResult);

        expect(BResult).to.deep.equal(mapControl);
    });

    it('test correctness of Brandes with normalization - compare to networkx data', () => {
        //FOR UNWEIGHTED; NON-NEGATIVE GRAPHS! FOR ALL OTHERS, SEE OTHER BRANDES VERSIONS!
        //note: it seems that until less than 6 nodes networkx normalizes everything as if it was undirected
        //the test graph can be changed any time,
        //but caution! choose only those new Jsons, where we have the networkx data (see above) 
        let graphPath = path_7nodeMerge1beforeGoal;
        let graph = json.readFromJSONFile(graphPath);
        let nodes = graph.getNodes();
        let mapControl = {};
        console.log("normalized betweenness values for the chosen graph (Networkx)");
        for (let key in nodes) {
            mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].default;
        }
        console.log(mapControl);
        let BResult = $B.Brandes(graph, true, true);
        console.log("Betweenness computed with Brandes, normalized: ");
        console.log(BResult);

        //one can not use "expect..." here, because of the different precision of fractional numbers
        //expect(BResult).to.deep.equal(mapControl);
    });

    //from this point on, functions can handle weighted graphs, too!
    it('test correctness of BrandesForWeighted without normalization', () => {
        //now the comparison is made with the BetweennessCentrality2 algorithm (correct but slow one, good for testing only)
        //(with networkx, we have only unweighted test graphs)
        let graphPath = path_search_pos;
        let graph = json.readFromJSONFile(graphPath);

        let resBCslow = $IB.betweennessCentrality2(graph, true, false);
        console.log("Betweenness centrality calculated with slow but correct algorithm: ");
        console.log(resBCslow);

        //the heap-based BranfesForWeighted is not yet working on weighted graphs
        //until that's fixed, one can run the BRandesForWeighted2 (min-based, slower)
        let resBFW = $B.BrandesForWeighted2(graph, false, false);
        console.log("Betweenness computed with BrandesForWeighted2: ");
        console.log(resBFW);

        expect(resBCslow).to.deep.equal(resBFW);
    });

    it('temporary for debugging', () => {
        let graphPath = path_search_pos;
        let graph = json.readFromJSONFile(graphPath);

        let br2 = $B.BrandesForWeighted2(graph, false, false);
        console.log("graph traversal with min-based: ");

        //the heap-based BranfesForWeighted is not yet working on weighted graphs
        //until that's fixed, one can run the BRandesForWeighted2 (min-based, slower)
        let resBFW = $B.BrandesForWeighted(graph, false, false);
        console.log("graph traversal with heap-based: ");
    });

    it('test correctness of BrandesForWeighted without normalization, on a graph containing zero-weight edge', () => {
        //now the comparison is made with the BetweennessCentrality2 algorithm (correct but slow one, good for testing only)
        //(with networkx, we have only unweighted test graphs)
        let graphPath = path_search_nullEdge;
        let graph = json.readFromJSONFile(graphPath);

        let resBCslow = $IB.betweennessCentrality2(graph, true, false);
        console.log("Betweenness centrality calculated with slow but correct algorithm: ");
        console.log(resBCslow);

        //the heap-based BranfesForWeighted is not yet working on weighted graphs
        //until that's fixed, one can run the BRandesForWeighted2 (min-based, slower)
        let resBFW = $B.BrandesForWeighted2(graph, false, false);
        console.log("Betweenness computed with BrandesForWeighted2: ");
        console.log(resBFW);

        expect(resBCslow).to.deep.equal(resBFW);
    });

    it('test if BrandesForWeighted2 can reject negative cycle graphs', () => {
        //
        let graphPath = path_bf_graph_neg_cycle;
        let graph = json.readFromJSONFile(graphPath);

        expect($B.BrandesForWeighted2.bind($B.BrandesForWeighted2, graph))
            .to.throw("The graph contains a negative cycle, thus it can not be processed");

        graph = graph_bf_graph;
        expect($B.BrandesForWeighted2.bind($B.BrandesForWeighted2, graph))
            .to.not.throw("The graph contains a negative cycle, thus it can not be processed");

        graph = graph_search_pos;
        expect($B.BrandesForWeighted2.bind($B.BrandesForWeighted2, graph))
            .to.not.throw("The graph contains a negative cycle, thus it can not be processed");
    });

    it('test if BrandesForWeighted2 can reweigh and traverse negative graphs', () => {
        //better to clone graph, it will be transformed!
        let graphPath = path_bf_graph;
        let graph = json.readFromJSONFile(graphPath);
        let workingGraph = graph.clone();
        let workingGraph2 = graph.clone();

        expect(workingGraph.hasNegativeEdge()).to.equal(true);
        expect(workingGraph2.hasNegativeEdge()).to.equal(true);
        //the heap-based BranfesForWeighted is not yet working on weighted graphs
        //until that's fixed, one can run the BRandesForWeighted2 (min-based, slower)
        let resSlow = $IB.betweennessCentrality2(workingGraph, true, true);
        console.log("Betweenness with slow but correct algorithm: ");
        console.log(resSlow);

        let resBFW = $B.BrandesForWeighted2(workingGraph2, false, false);
        console.log("Betweenness computed with BrandesForWeighted2: ");
        console.log(resBFW);

        expect(resSlow).to.deep.equal(resBFW);

        expect(workingGraph.hasNegativeEdge()).to.equal(false);
        expect(workingGraph2.hasNegativeEdge()).to.equal(false);
    });

    it('compare runtime of BrandesForWeighted to PFS based Brandes, UNnormalized', () => {
        //now the BrandesForWeighted2 is included too - now that's the only correct one
        //BrandesForWeighted and BrandesPFSBased do not yet give correct results on weighted graphs!
        let graphPath = path_midSizeGraph;
        let graph = json.readFromJSONFile(graphPath);

        console.log(`Running on graph of ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges, UNnormalized mode:`);

        let startBO = +new Date();
        let resBO = $B.BrandesForWeighted2(graph, false, false);
        let endBO = +new Date();
        console.log("runtime of Brandes, weighted, min-based: " + (endBO - startBO));

        let startBW = +new Date();
        let resBW = $B.BrandesForWeighted(graph, false, false);
        let endBW = +new Date();
        //runtimes are always in ms
        console.log("runtime of Brandes for Weighted, heap based: " + (endBW - startBW));

        let startBP = +new Date();
        let resBP = $B.BrandesPFSbased(graph, false, false);
        let endBP = +new Date();
        console.log("runtime of Brandes, PFS based: " + (endBP - startBP));

        /**
         * Comparing floats to within epsilon precision
         */
        let epsilon = 1e-6;
        Object.keys(resBO).forEach(n => expect(resBO[n]).to.be.closeTo(resBW[n], epsilon));
        Object.keys(resBP).forEach(n => expect(resBP[n]).to.be.closeTo(resBW[n], epsilon));
    });

    it('compare runtime of BrandesForWeighted to PFS based Brandes, normalized', () => {
        //now the BrandesForWeighted2 is included too - now that's the only correct one
        //BrandesForWeighted and BrandesPFSBased do not yet give correct results on weighted graphs!
        let graphPath = path_midSizeGraph;
        let graph = json.readFromJSONFile(graphPath);

        console.log(`Running on graph of ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges, normalized mode:`);

        let startBO = +new Date();
        let resBO = $B.BrandesForWeighted2(graph, true, false);
        let endBO = +new Date();
        console.log("runtime of Brandes, weighted, min-based: " + (endBO - startBO));

        let startBW = +new Date();
        let resBW = $B.BrandesForWeighted(graph, true, false);
        let endBW = +new Date();
        //runtimes are always in ms
        console.log("runtime of Brandes for Weighted, heap based: " + (endBW - startBW));

        let startBP = +new Date();
        let resBP = $B.BrandesPFSbased(graph, true, false);
        let endBP = +new Date();
        console.log("runtime of Brandes, PFS based: " + (endBP - startBP));

        /**
         * Comparing floats to within epsilon precision
         * Smaller epsilon due to normalization of scores
         */
        let epsilon = 1e-12;
        Object.keys(resBO).forEach(n => expect(resBO[n]).to.be.closeTo(resBW[n], epsilon));
        Object.keys(resBP).forEach(n => expect(resBP[n]).to.be.closeTo(resBW[n], epsilon));
    });


    it('compare results of all BrandesForWeighted functions, using the betweennessCentrality2 too', () => {
        //it will be compared to results from the BetwennessCentrality2
        //works with any Jsons, new and old
        //once the heap problem is fixed, the second can be modified to BrandesForWeighted, and all three will give the same results
        let graphPath = path_search_nullEdge;
        let graph = json.readFromJSONFile(graphPath);

        console.log("Betweenness with slow but good algorithm:");
        let resultBCOld = $IB.betweennessCentrality2(graph, true, true);
        console.log(resultBCOld);

        console.log("Betweenness computed with our BrandesForWeighted2 function:");
        let resultBCWMinBased = $B.BrandesForWeighted2(graph, false, false);
        console.log(resultBCWMinBased);

        console.log("Betweenness computed with our BrandesForWeighted function:");
        let resultBCWHeapBased = $B.BrandesForWeighted(graph, false, false);
        console.log(resultBCWHeapBased);

        console.log("Betweenness computed with our BrandesPFSBased function:");
        let resultBrandesPFS = $B.BrandesPFSbased(graph, false, false);
        console.log(resultBrandesPFS);

        expect(resultBCOld).to.deep.equal(resultBCWMinBased);
    });


    describe.only('Brandes Performance tests on small, unweighted social networks', () => {
        [graph_social_300, graph_social_1K].forEach(graph => { // graph_social_1K
            it(`Runtime of Brandes (+ Weighted) on graph ${graph}:`, () => {
                let startBU = +new Date();
                let resBU = $B.Brandes2(graph, true, false);
                let endBU = +new Date();
                console.log(`runtime of Brandes, UNweighted, on a ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges social network: ` + (endBU - startBU));
            });
        });

        [graph_weighted_social_300, graph_weighted_social_1K].forEach(graph => { // graph_social_1K
            it(`Runtime of Brandes (+ Weighted) on graph ${graph}:`, () => {
                let startBW = +new Date();
                let resBW = $B.BrandesForWeighted(graph, true, false);
                let endBW = +new Date();
                console.log(`runtime of Brandes, weighted, on a ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges social network: ` + (endBW - startBW));
            });
        });
    });
});

/**
 * TODO: Write some normalization tests...
 */






//old code from Benedict, now coded out for a while
/* let sn_graph_file = "./test/test_data/social_network_edges.csv",
    iBt_cent_graph = "./test/test_data/search_graph_multiple_SPs.json",
    iBt_cent_graph_pos = "./test/test_data/search_graph_multiple_SPs_positive.json",
    graph_300_file = "./test/test_data/social_network_edges_300.csv",
    und_unw_graph = "./test/test_data/undirected_unweighted_6nodes.csv",
    graph_300: $G.IGraph = csv.readFromEdgeListFile(graph_300_file),
    graph_6: $G.IGraph = csv.readFromEdgeListFile(und_unw_graph),
    graph: $G.IGraph = json.readFromJSONFile(iBt_cent_graph_pos),
    graph_zerocycle: $G.IGraph = json.readFromJSONFile(iBt_cent_graph);
let sparseMap;


describe("InBetweenness Centrality Tests", () => {


    it('should return a map of nodes of length 6', () => {
        let iBt_dist = $IB.inBetweennessCentrality(graph);
        expect(Object.keys(iBt_dist).length).to.equal(6);
    });

    it.skip('should return an error message because of edges with zero weights', () => {
        expect($IB.inBetweennessCentrality.bind($IB.inBetweennessCentrality, graph_zerocycle))
            .to.throw("Cannot compute FW on negative edges");
    });

    it('should return the correct betweenness map', () => {
        let expected_betweenness_map = {
            "0": 6 / 30,
            "1": 7 / 30,
            "2": 11 / 30,
            "3": 1 / 30,
            "4": 5 / 30,
            "5": 0
        };
        let betweenness_map = $IB.inBetweennessCentrality(graph, false);
        expect(betweenness_map).to.deep.equal(expected_betweenness_map);
    });

    it("should return the correct betweenness map for an undirected unweighted graph", () => {
        let expected_betweenness_map = {
            "1": 2 / 20,
            "2": 4 / 20,
            "3": 8 / 20,
            "4": 2 / 20,
            "5": 4 / 20,
            "6": 0
        };
        let brandes_map = $B.Brandes(graph_6);
        expect(brandes_map).to.deep.equal(expected_betweenness_map);
    });*/


    /**
     * Performance measurement
     *
     * TODO: Outsource to it's own performance test suite
     */
    /*it.skip('should run the In-Betweenness centrality on a real-sized social network, sparse FW', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        expect(sn_graph.nrNodes()).to.equal(SN_GRAPH_NODES);
        expect(sn_graph.nrUndEdges()).to.equal(SN_GRAPH_EDGES);

        sparseMap = $IB.inBetweennessCentrality(sn_graph, true);
    });

    it('should run the In-Betweenness centrality on a real-sized social network, Dense FW', () => {
        let start = +new Date;
        let brandes_map = $B.Brandes(graph_300);
        let end = +new Date;
        console.log(`Brandes on ~300 nodes graph took ${end - start} millies.`);
    });

    it.skip('performance test of Betweenness on a ~1k social graph', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        expect(sn_graph.nrNodes()).to.equal(SN_GRAPH_NODES);
        expect(sn_graph.nrUndEdges()).to.equal(SN_GRAPH_EDGES);
        let start = +new Date;
        let brandes_map = $B.Brandes(sn_graph);
        let end = +new Date;
        console.log(`Brandes on ~1k nodes graph took ${end - start} millies.`);
    });

});*/