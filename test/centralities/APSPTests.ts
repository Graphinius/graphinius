/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';
import * as $CC from '../../src/centralities/Closeness';
import * as $IC from '../../src/centralities/ICentrality';
import * as $AP from '../../src/centralities/APSP';

const SN_GRAPH_NODES = 1034,
    SN_GRAPH_EDGES = 53498 / 2; // edges are specified in directed fashion

let expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json   : $JSON.IJSONInput = new $JSON.JSONInput(true, false, true),
    sn_graph_file = "./test/test_data/social_network_edges.csv",
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph),
    CC: $IC.ICentrality = new $CC.closenessCentrality();


describe("All Pairs Shortest Path Tests", () => {

    it('should run without errors', () => {
        let AP = new $AP.APSP(graph);
        for(let n in graph.getNodes()){
            AP.addNode(graph.getNodeById(n));
        }
        //expect( Object.keys( cc ).length ).to.equal(6);
    });


    it('should return the correct closeness map', () => {
        let expected_closeness_map = {
            "A": 2.6,
            "B": 2.4,
            "C": 2.4,
            "D": 4.8,
            "E": 4.8,
            "F": 4.4
        };

        let AP = new $AP.APSP(graph);
        for(let n in graph.getNodes()){
            AP.addNode(graph.getNodeById(n));
        }
        let closeness_map = AP.getCloseness();
        expect( closeness_map ).to.deep.equal( expected_closeness_map );
    });


    /**
     * Performance measurement
     *
     * TODO: Outsource to it's own performance test suite
     */
    it.skip('should run the closeness centrality on a real-sized social network', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        expect(sn_graph.nrNodes()).to.equal(SN_GRAPH_NODES);
        expect(sn_graph.nrUndEdges()).to.equal(SN_GRAPH_EDGES);

        // console.log(sn_graph.getRandomUndEdge().isWeighted());

        let cc = CC.getCentralityMap(graph);
    });

});