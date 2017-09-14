/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';
import * as $IB from '../../src/centralities/InBetweenness';
import * as $FW from '../../src/search/FloydWarshall';

const SN_GRAPH_NODES = 1034,
      SN_GRAPH_EDGES = 53498 / 2; // edges are specified in directed fashion

let expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json   : $JSON.IJSONInput = new $JSON.JSONInput(true, false, true),
    sn_graph_file = "./test/test_data/social_network_edges.csv",
    iBt_cent_graph = "./test/test_data/search_graph_multiple_SPs.json",
    iBt_cent_graph_pos = "./test/test_data/search_graph_multiple_SPs_positive.json",
    graph_300_file = "./test/test_data/social_network_edges_300.csv",
    graph_300 : $G.IGraph = csv.readFromEdgeListFile(graph_300_file),
    graph : $G.IGraph = json.readFromJSONFile(iBt_cent_graph_pos),
    graph_zerocycle : $G.IGraph = json.readFromJSONFile(iBt_cent_graph);
    let sparseMap;


describe("InBetweenness Centrality Tests", () => {


    it('should return a map of nodes of length 6', () => {
        let iBt_dist = $IB.inBetweennessCentrality( graph );
        expect( Object.keys( iBt_dist ).length ).to.equal(6);
    });

    it('should return an error message because of edges with zero weights', () => {
        expect($IB.inBetweennessCentrality.bind($IB.inBetweennessCentrality, graph_zerocycle))
            .to.throw("Cannot compute FW on negative edges");
    });

    it.only('should return the correct betweenness map', () => {
        let expected_betweenness_map = {
            "A": 6/30,
            "B": 7/30,
            "C": 11/30,
            "D": 1/30,
            "E": 5/30,
            "F": 0

        };
        let closeness_map = $IB.inBetweennessCentrality( graph,false );
        expect( closeness_map ).to.deep.equal( expected_betweenness_map );
    });


    /**
     * Performance measurement
     *
     * TODO: Outsource to it's own performance test suite
     */
    it.skip('should run the In-Betweenness centrality on a real-sized social network, sparse FW', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        expect(sn_graph.nrNodes()).to.equal(SN_GRAPH_NODES);
        expect(sn_graph.nrUndEdges()).to.equal(SN_GRAPH_EDGES);

        sparseMap = $IB.inBetweennessCentrality( sn_graph, true);
    });

    it.skip('should run the In-Betweenness centrality on a real-sized social network, Dense FW', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        expect(sn_graph.nrNodes()).to.equal(SN_GRAPH_NODES);
        expect(sn_graph.nrUndEdges()).to.equal(SN_GRAPH_EDGES);

        let denseMap = $IB.inBetweennessCentrality( sn_graph, false);
        //expect( sparseMap ).to.deep.equal( denseMap );
    });

});