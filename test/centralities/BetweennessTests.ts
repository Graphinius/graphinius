/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';
import * as $IB from '../../src/centralities/Betweenness';
import * as $B from '../../src/centralities/Brandes';

const SN_GRAPH_NODES = 1034,
      SN_GRAPH_EDGES = 53498 / 2; // edges are specified in directed fashion

let expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json   : $JSON.IJSONInput = new $JSON.JSONInput(true, false, true),
    sn_graph_file = "./test/test_data/social_network_edges.csv",
    iBt_cent_graph = "./test/test_data/search_graph_multiple_SPs.json",
    iBt_cent_graph_pos = "./test/test_data/search_graph_multiple_SPs_positive.json",
    graph_300_file = "./test/test_data/social_network_edges_300.csv",
    und_unw_graph = "./test/test_data/undirected_unweighted_6nodes.csv",
    graph_300 : $G.IGraph = csv.readFromEdgeListFile(graph_300_file),
    graph_6 : $G.IGraph = csv.readFromEdgeListFile(und_unw_graph),
    graph : $G.IGraph = json.readFromJSONFile(iBt_cent_graph_pos),
    graph_zerocycle : $G.IGraph = json.readFromJSONFile(iBt_cent_graph);
    let sparseMap;


describe("InBetweenness Centrality Tests", () => {


    it('should return a map of nodes of length 6', () => {
        let iBt_dist = $IB.inBetweennessCentrality( graph );
        expect( Object.keys( iBt_dist ).length ).to.equal(6);
    });

    it.skip('should return an error message because of edges with zero weights', () => {
        expect($IB.inBetweennessCentrality.bind($IB.inBetweennessCentrality, graph_zerocycle))
            .to.throw("Cannot compute FW on negative edges");
    });

    it('should return the correct betweenness map', () => {
        let expected_betweenness_map = {
            "0": 6/30,
            "1": 7/30,
            "2": 11/30,
            "3": 1/30,
            "4": 5/30,
            "5": 0

        };
        let betweenness_map = $IB.inBetweennessCentrality( graph,false );
        expect( betweenness_map ).to.deep.equal( expected_betweenness_map );
    });

    it("should return the correct betweenness map for an undirected unweighted graph", () => {
        console.log("Graph 6:"+graph_6.nrNodes()+" edges:"+graph_6.nrDirEdges()+" und:"+graph_6.nrUndEdges());
        let brandes_map = $B.Brandes(graph_6);
        let betweenness_map = $IB.inBetweennessCentrality( graph_6,false );
        expect(brandes_map).to.equal(betweenness_map);
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

    it.only('should run the In-Betweenness centrality on a real-sized social network, Dense FW', () => {
        let sn_graph = csv.readFromEdgeListFile(sn_graph_file);
        expect(sn_graph.nrNodes()).to.equal(SN_GRAPH_NODES);
        expect(sn_graph.nrUndEdges()).to.equal(SN_GRAPH_EDGES);

        //let denseMap = $B.Brandes( sn_graph);
        //let denseMap = $IB.inBetweennessCentrality( sn_graph, false);
        let brandes_map = $B.Brandes(graph_300);
        //expect( sparseMap ).to.deep.equal( denseMap );
    });

});