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
    path_search_no1DE = "./test/test_data/search_graph_multiple_SPs_no1DE.json",
    //until this point, all graphs have checking values in the features
    path_midSizeGraph = "./test/test_data/bernd_ares_intermediate_pos.json",
    path_search_pos = "./test/test_data/search_graph_multiple_SPs_positive.json",
    path_search_nullEdge = "./test/test_data/search_graph_multiple_SPs.json";

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
    graph_search_nullEdge = json.readFromJSONFile(path_search_nullEdge);

describe('check correctness and runtime of new betweennessCentrality function', () => {
    it('should compute betweenness correctly and compare it to networkx values', () => {
        //the test graph can be changed any time,
        //but caution! this works only with the new Jsons, where we have the networkx data        
        let graph = graph_4node2SPs1direct;
        let nodes = graph.getNodes();
        let mapControl = {};
        console.log("unnormalized betweenness values for the chosen graph (Networkx)");
        for (let key in nodes) {
            mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].unnormalized;

        }
        console.log(mapControl);
        console.log("Betweenness computed with betweennessCentrality2 function:");
        //info: first boolean is yet indifferent (will have a role once we want to normalize)
        //second boolean: if true or missing, Johnsons is used, if false, FW with nextArray transformation
        console.log($IB.betweennessCentrality2(graph, false, false));
    });

    it('should compute betweenness correctly, no comparison to networkx', () => {
        let graph = graph_search_pos;
        console.log("Betweenness computed with betweennessCentrality2 function:");
        console.log($IB.betweennessCentrality2(graph, false, true));
    });

    
    it('our Brandes', () => {
        //here one can give in any graph from the above ones
        //it will be compared to results from the BetwennessCentrality2
        //works with any Jsons, new and old
        let graph = graph_8nodeSplitAfter1mergeBefore1;
        let nodes = graph.getNodes();
        let mapControl = {};
        console.log("unnormalized betweenness values for the chosen graph (Networkx)");
        for (let key in nodes) {
            mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].unnormalized;

        }
        console.log(mapControl);
        console.log("Betweenness computed with our Brandes function:");
        
        console.log($B.Brandes(graph, true));
    });

    it('BrandesForWeighted tests', () => {
        let graph = graph_search_pos;
        // console.log(graph.adjListDict());
        console.log("Betweenness with slow but good algorithm:");
        console.log($IB.betweennessCentrality2(graph, false, true));

        // let nodes = graph.getNodes();
        // let mapControl = {};
        // console.log("unnormalized betweenness values for the chosen graph (Networkx)");
        // for (let key in nodes) {
        //     mapControl[nodes[key].getID()] = nodes[key].getFeatures()["betweenness"].unnormalized;

        // }
        // console.log(mapControl);

        console.log("Betweenness computed with our BrandesForWeighted function:");
        console.log($B.BrandesForWeighted(graph, true));
        // console.log($JO.Johnsons(graph)[1]);
    });

    //to measure runtimes
    it.only('runtime checker for Brandes, compare to PFS', () => {
        let graph = graph_midSizeGraph;

        let startB = +new Date();
        $B.BrandesForWeighted(graph, true);
        let endB = +new Date();
        //runtimes are always in ms
        console.log("runtime of BrandesForWeighted: " + (endB - startB));

        let startP = +new Date();
        $B.BrandesHeapBased(graph, true);
        let endP = +new Date();
        console.log("runtime of BrandesHeapBased: " + (endP - startP));

    });

    //to test the PFS alternative for correctness
    it('test alternative PFS for correctness', () => {
        let graph = graph_search_no1DE;
        console.log("results by PFSforAllSources (Johnsons)");
        console.log($JO.Johnsons(graph)[0]);
        console.log($JO.Johnsons(graph)[1]);

        console.log("results from new PFS");
        console.log($B.PFSdictBased(graph)[0]);
        console.log($B.PFSdictBased(graph)[1]);
    });

    //to measure runtimes, unfortunately the dict based PFS is slower
    it('runtime checker for alternative PFS; a fair comparison', () => {
        let graph = graph_midSizeGraph;

        let startB = +new Date();
        $B.PFSdictBased(graph);
        let endB = +new Date();
        //runtimes are always in ms
        console.log("runtime of PFSdictBased: " + (endB - startB));

        let startP = +new Date();
        $JO.PFSforAllSources(graph);
        let endP = +new Date();
        console.log("runtime of PSFforAllSources: " + (endP - startP));

    });

});

//old part, now coded out for a while
/*let sn_graph_file = "./test/test_data/social_network_edges.csv",
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