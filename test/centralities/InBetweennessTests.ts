/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';
import * as $IB from '../../src/centralities/InBetweenness';

const SN_GRAPH_NODES = 1034,
      SN_GRAPH_EDGES = 53498 / 2; // edges are specified in directed fashion

let expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json   : $JSON.IJSONInput = new $JSON.JSONInput(true, false, true),
    sn_graph_file = "./test/test_data/social_network_edges.csv",
    iBt_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(iBt_cent_graph);


describe("InBetweenness Centrality Tests", () => {

    it('should return a map of nodes of length 6', () => {
        let iBt_dist = $IB.inBetweennessCentrality( graph );
        expect( Object.keys( iBt_dist ).length ).to.equal(6);
    });


    it('should return the correct betweenness map', () => {
        let expected_betweenness_map = {
            "A": 2.6,
            "B": 2.4,
            "C": 2.4,
            "D": 4.8,
            "E": 4.8,
            "F": 4.4
        };
        let closeness_map = $IB.inBetweennessCentrality( graph );
        expect( closeness_map ).to.deep.equal( expected_betweenness_map );
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

        let deg_dist = $IB.inBetweennessCentrality( sn_graph );
    });

});