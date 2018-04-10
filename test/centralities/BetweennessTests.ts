/// <reference path="../../typings/tsd.d.ts" />

import * as fs from 'fs';
import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';
import * as $IB from '../../src/centralities/Betweenness';
import * as $B from '../../src/centralities/Brandes';
import * as $JO from '../../src/search/Johnsons';
import * as $FW from '../../src/search/FloydWarshall';

import {Logger} from '../../src/utils/logger';
const logger = new Logger();


const SN_GRAPH_NODES = 1034,
    SN_GRAPH_EDGES = 53498 / 2; // edges are specified in directed fashion

let expect = chai.expect,
    csv: $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json: $JSON.IJSONInput = new $JSON.JSONInput(true, false, true);
const PATH_PREFIX = "./test/test_data/",
      PATH_PREFIX_CENTRALITIES = PATH_PREFIX + "centralities/";

let socialNet300 = "social_network_edges_300",
    socialNet1K = "social_network_edges_1K",
    socialNet20K = "social_network_edges_20K",
    weightedSocialNet300 = "social_network_edges_300_weighted",
    weightedSocialNet1K = "social_network_edges_1K_weighted",
    weightedSocialNet20K = "social_network_edges_20K_weighted";

let path_3nodeUnd = PATH_PREFIX_CENTRALITIES + "3nodeUnd.json",
    path_3nodeDir = PATH_PREFIX_CENTRALITIES + "3nodeDir.json",
    path_3node2SPs1direct = PATH_PREFIX_CENTRALITIES + "3node2SPs1direct.json",
    path_4node2SPs1direct = PATH_PREFIX_CENTRALITIES + "4node2SPs1direct.json",
    path_5nodeLinear = PATH_PREFIX_CENTRALITIES + "5nodeLinear.json",
    path_7nodeMerge1beforeGoal = PATH_PREFIX_CENTRALITIES + "7nodeMerge1beforeGoal.json",
    path_8nodeSplitMerge = PATH_PREFIX_CENTRALITIES + "8nodeSplitMerge.json",
    path_8nodeSplitAfter1mergeBefore1 = PATH_PREFIX_CENTRALITIES + "8nodeSplitAfter1mergeBefore1.json",
    //until this point, all graphs have checking values in the features
    path_search_no1DE = PATH_PREFIX + "search_graph_multiple_SPs_no1DE.json",
    path_midSizeGraph = PATH_PREFIX + "bernd_ares_intermediate_pos.json",
    path_search_pos = PATH_PREFIX + "search_graph_multiple_SPs_positive.json",
    path_search_nullEdge = PATH_PREFIX + "search_graph_multiple_SPs.json",
    path_bf_graph = PATH_PREFIX + "bellman_ford.json",
    path_bf_graph_neg_cycle = PATH_PREFIX + "negative_cycle.json";


let graph_3nodeUnd: $G.IGraph = json.readFromJSONFile(path_3nodeUnd),
    graph_3nodeDir = json.readFromJSONFile(path_3nodeDir),
    graph_3node2SPs1direct = json.readFromJSONFile(path_3node2SPs1direct),
    graph_4node2SPs1direct = json.readFromJSONFile(path_4node2SPs1direct),
    graph_5nodeLinear = json.readFromJSONFile(path_5nodeLinear),
    graph_7nodeMerge1beforeGoal = json.readFromJSONFile(path_7nodeMerge1beforeGoal),
    graph_8nodeSplitMerge = json.readFromJSONFile(path_8nodeSplitMerge),
    graph_8nodeSplitAfter1mergeBefore1 = json.readFromJSONFile(path_8nodeSplitAfter1mergeBefore1),
    graph_midSizeGraph = json.readFromJSONFile(path_midSizeGraph),
    graph_search_no1DE = json.readFromJSONFile(path_search_no1DE),
    graph_search_pos = json.readFromJSONFile(path_search_pos),
    graph_search_nullEdge = json.readFromJSONFile(path_search_nullEdge),
    graph_bf_graph = json.readFromJSONFile(path_bf_graph),
    graph_bf_graph_neg_cycle = json.readFromJSONFile(path_bf_graph_neg_cycle);


/**
 * @TODO Rita: Only read graphs when needed within test...
 * => Test Isolation
 */
describe('check correctness and runtime of betweenness centrality functions', () => {

    it('test correctness of Brandes WITHOUT normalization - compare to networkx data', () => {
        //FOR UNWEIGHTED; NON-NEGATIVE GRAPHS! FOR ALL OTHERS, SEE OTHER BRANDES VERSIONS!
        //the test graph can be changed any time,
        //but caution! choose only those new Jsons, where we have the networkx data (see above)       
        let graphPath = path_5nodeLinear;
        let graph = json.readFromJSONFile(graphPath);
        let nodes = graph.getNodes();
        let mapControl = {};
        logger.log("unnormalized betweenness values for the chosen graph (Networkx)");
        for (let key in nodes) {
            mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].unnormalized;
        }
        logger.log(mapControl);
        let BResult = $B.BrandesUnweighted(graph, false, false);
        logger.log("Betweenness computed with Brandes: ");
        logger.log(BResult);

        expect(BResult).to.deep.equal(mapControl);
    });

    it('test correctness of Brandes WITH normalization - compare to networkx data', () => {
        // only unweighted graphs
        // the test graph can be changed any time,
        // but caution! choose only those new Jsons, where we have the networkx data (see above) 
        let graphPath = path_7nodeMerge1beforeGoal;
        let graph = json.readFromJSONFile(graphPath);
        let nodes = graph.getNodes();
        let mapControl = {};
        logger.log("normalized betweenness values for the chosen graph (Networkx)");
        for (let key in nodes) {
            mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].default;
        }

        logger.log(mapControl);
        let BUResult = $B.BrandesUnweighted(graph, true, true);
        logger.log("Betweenness computed with Brandes, normalized: ");
        logger.log(BUResult);

        logger.log(mapControl);
        let BWResult = $B.BrandesWeighted(graph, true, true);
        logger.log("Betweenness computed with Brandes, normalized: ");
        logger.log(BWResult);

        logger.log(mapControl);
        let BPResult = $B.BrandesWeighted(graph, true, true);
        logger.log("Betweenness computed with Brandes, normalized: ");
        logger.log(BPResult);

        let epsilon = 1e-4;
        Object.keys(BUResult).forEach( n => expect(BUResult[n]).to.be.closeTo(mapControl[n], epsilon) );
        Object.keys(BWResult).forEach( n => expect(BWResult[n]).to.be.closeTo(mapControl[n], epsilon) );
        Object.keys(BPResult).forEach( n => expect(BPResult[n]).to.be.closeTo(mapControl[n], epsilon) );
    });

    it('test correctness of BrandesForWeighted without normalization', () => {
        let graphPath = path_search_pos;
        let graph = json.readFromJSONFile(graphPath);

        let resBCslow = $IB.betweennessCentrality(graph, true, false);
        logger.log("Betweenness centrality calculated with slow but correct algorithm: ");
        logger.log(resBCslow);

        let resBFW = $B.BrandesWeighted(graph, false, false);
        logger.log("Betweenness computed with BrandesForWeighted2: ");
        logger.log(resBFW);

        expect(resBCslow).to.deep.equal(resBFW);
    });

    it('test correctness of BrandesForWeighted without normalization, on a graph containing zero-weight edge', () => {
        let graphPath = path_search_nullEdge;
        let graph = json.readFromJSONFile(graphPath);

        let resBCslow = $IB.betweennessCentrality(graph, true, false);
        logger.log("Betweenness centrality calculated with slow but correct algorithm: ");
        logger.log(resBCslow);

        let resBFW = $B.BrandesWeighted(graph, false, false);
        logger.log("Betweenness computed with BrandesForWeighted2: ");
        logger.log(resBFW);

        expect(resBCslow).to.deep.equal(resBFW);
    });

    it('test if BrandesWeighted rejects negative cycle graphs', () => {
        let graphPath = path_bf_graph_neg_cycle;
        let graph = json.readFromJSONFile(graphPath);

        expect($B.BrandesWeighted.bind($B.BrandesWeighted, graph))
            .to.throw("The graph contains a negative cycle, thus it can not be processed");

        graph = graph_bf_graph;
        expect($B.BrandesWeighted.bind($B.BrandesWeighted, graph))
            .to.not.throw("The graph contains a negative cycle, thus it can not be processed");

        graph = graph_search_pos;
        expect($B.BrandesWeighted.bind($B.BrandesWeighted, graph))
            .to.not.throw("The graph contains a negative cycle, thus it can not be processed");
    });

    it('test if BrandesWeighted can reweigh and traverse negative graphs', () => {
        let graphPath = path_bf_graph;
        let graph = json.readFromJSONFile(graphPath);
        let workingGraph = graph.clone();
        let workingGraph2 = graph.clone();

        expect(workingGraph.hasNegativeEdge()).to.equal(true);
        expect(workingGraph2.hasNegativeEdge()).to.equal(true);
        
        let resSlow = $IB.betweennessCentrality(workingGraph, true, true);
        logger.log("Betweenness with slow but correct algorithm: ");
        logger.log(resSlow);

        let resBFW = $B.BrandesWeighted(workingGraph2, false, false);
        logger.log("Betweenness computed with BrandesForWeighted2: ");
        logger.log(resBFW);

        expect(resSlow).to.deep.equal(resBFW);

        expect(workingGraph.hasNegativeEdge()).to.equal(false);
        expect(workingGraph2.hasNegativeEdge()).to.equal(false);
    });

    it('compare runtime of BrandesForWeighted to PFS based Brandes, UNnormalized', () => {
        let graphPath = path_midSizeGraph;
        let graph = json.readFromJSONFile(graphPath);

        logger.log(`Running on graph of ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges, UNnormalized mode:`);

        let startBW = +new Date();
        let resBW = $B.BrandesWeighted(graph, false, false);
        let endBW = +new Date();

        logger.log("runtime of Brandes for Weighted, heap based: " + (endBW - startBW));

        let startBP = +new Date();
        let resBP = $B.BrandesPFSbased(graph, false, false);
        let endBP = +new Date();
        logger.log("runtime of Brandes, PFS based: " + (endBP - startBP));

        /**
         * Comparing floats to within epsilon precision
         */
        let epsilon = 1e-6;
        Object.keys(resBP).forEach(n => expect(resBP[n]).to.be.closeTo(resBW[n], epsilon));
    });

    it('compare runtime of BrandesForWeighted to PFS based Brandes, normalized', () => {
        let graphPath = path_midSizeGraph;
        let graph = json.readFromJSONFile(graphPath);

        logger.log(`Running on graph of ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges, normalized mode:`);

        let startBW = +new Date();
        let resBW = $B.BrandesWeighted(graph, true, false);
        let endBW = +new Date();
        logger.log("runtime of Brandes for Weighted, heap based: " + (endBW - startBW));

        let startBP = +new Date();
        let resBP = $B.BrandesPFSbased(graph, true, false);
        let endBP = +new Date();
        logger.log("runtime of Brandes, PFS based: " + (endBP - startBP));

        /**
         * Comparing floats to within epsilon precision
         * Smaller epsilon due to normalization of scores
         */
        let epsilon = 1e-12;
        Object.keys(resBP).forEach(n => expect(resBP[n]).to.be.closeTo(resBW[n], epsilon));
    });


    it('compare results of all BrandesForWeighted functions, using the betweennessCentrality2 too', () => {
        let graphPath = path_search_nullEdge;
        let graph = json.readFromJSONFile(graphPath);

        logger.log("Betweenness with slow but good algorithm:");
        let resultBCOld = $IB.betweennessCentrality(graph, true, true);
        logger.log(resultBCOld);

        logger.log("Betweenness computed with our BrandesForWeighted function:");
        let resultBCWHeapBased = $B.BrandesWeighted(graph, false, false);
        logger.log(resultBCWHeapBased);

        logger.log("Betweenness computed with our BrandesPFSBased function:");
        let resultBrandesPFS = $B.BrandesPFSbased(graph, false, false);
        logger.log(resultBrandesPFS);

        expect(resultBCOld).to.deep.equal(resultBCWHeapBased);
        expect(resultBCOld).to.deep.equal(resultBrandesPFS);
    });


    /**
     * Usually, a social network would have undirected (bi-directional) friend relations - nevertheless, for sake of comparison (edge lists are read in a directed manner by networkx) we are switching to directed mode as well.
     */
    describe('Brandes Performance tests on small, unweighted social networks', () => {

        [socialNet300].forEach(graph_name => { // socialNet1K, socialNet20K
            it(`Runtime of Brandes (UNweighted) on graph ${graph_name}:`, () => {
                let csv: $CSV.ICSVInput = new $CSV.CSVInput(" ", false, true, false);
                let graph_path = PATH_PREFIX + graph_name + ".csv",
                    graph = csv.readFromEdgeListFile( graph_path );

                let startBU = +new Date();
                let resBU = $B.BrandesUnweighted(graph, true, true);
                let endBU = +new Date();
                logger.log(`runtime of Brandes, UNweighted, on a ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges social network: ${endBU - startBU} ms.`);

                let controlFileName = `./test/test_data/centralities/betweenness_${graph_name}_results.json`;
                let controlMap = JSON.parse(fs.readFileSync(controlFileName).toString());

                expect(Object.keys(resBU).length).to.equal(Object.keys(controlMap).length);
                
                let epsilon = 1e-12
                Object.keys(resBU).forEach(n => expect(resBU[n]).to.be.closeTo(controlMap[n], epsilon));
            });
        });

        [weightedSocialNet300].forEach(graph_name => { // weightedSocialNet1K, weightedSocialNet20K
            it(`Runtime of Brandes (Weighted) on graph ${graph_name}:`, () => {
                let csv: $CSV.ICSVInput = new $CSV.CSVInput(" ", false, true, true);
                let graph_path = PATH_PREFIX + graph_name + ".csv",
                    graph = csv.readFromEdgeListFile( graph_path );

                let startBW = +new Date();
                let resBW = $B.BrandesWeighted(graph, true, true);
                let endBW = +new Date();
                logger.log(`runtime of Brandes, weighted, on a ${graph.nrNodes()} nodes and ${graph.nrDirEdges() + graph.nrUndEdges()} edges social network: ${endBW - startBW} ms.`);

                let controlFileName = `./test/test_data/centralities/betweenness_${graph_name}_results.json`;
                let controlMap = JSON.parse(fs.readFileSync(controlFileName).toString());

                expect(Object.keys(resBW).length).to.equal(Object.keys(controlMap).length);

                let epsilon = 1e-12
                Object.keys(resBW).forEach(n => expect(resBW[n]).to.be.closeTo(controlMap[n], epsilon));
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
        logger.log(`Brandes on ~300 nodes graph took ${end - start} millies.`);
    });

    it.skip('performance test of Betweenness on a ~1k social graph', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        expect(sn_graph.nrNodes()).to.equal(SN_GRAPH_NODES);
        expect(sn_graph.nrUndEdges()).to.equal(SN_GRAPH_EDGES);
        let start = +new Date;
        let brandes_map = $B.Brandes(sn_graph);
        let end = +new Date;
        logger.log(`Brandes on ~1k nodes graph took ${end - start} millies.`);
    });

});*/