/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import * as $JSON from '../../src/io/input/JSONInput';
import * as $DC from '../../src/centralities/Closeness';

const SN_GRAPH_NODES = 1034,
      SN_GRAPH_EDGES = 53498 / 2; // edges are specified in directed fashion

let expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
    json   : $JSON.IJSONInput = new $JSON.JSONInput(true, false, true),
    sn_graph_file = "./test/test_data/social_network_edges.csv",
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph);


describe("Closeness Centrality Tests", () => {

    it('should return a map of nodes of length 6', () => {
        let deg_dist = $DC.closenessCentrality( graph );
        expect( Object.keys( deg_dist ).length ).to.equal(6);
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
        let closeness_map = $DC.closenessCentrality( graph );
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

        let deg_dist = $DC.closenessCentrality( sn_graph );
    });

    /*
     it('Single Closeness test on node A', () => {
     expect( graph.getNodeById("A").inDegree() ).to.equal( 2 );
     expect( graph.getNodeById("A").outDegree() ).to.equal( 3 );
     expect( graph.getNodeById("A").degree() ).to.equal( 0 );
     });


     it('Single Closeness test on node B', () => {
     expect( graph.getNodeById("B").inDegree() ).to.equal( 1 );
     expect( graph.getNodeById("B").outDegree() ).to.equal( 3 );
     expect( graph.getNodeById("B").degree() ).to.equal( 1 );
     });


     it('Single Closeness test on node C', () => {
     expect( graph.getNodeById("C").inDegree() ).to.equal( 4 );
     expect( graph.getNodeById("C").outDegree() ).to.equal( 2 );
     expect( graph.getNodeById("C").degree() ).to.equal( 0 );
     });


     it('Single Closeness test on node D', () => {
     expect( graph.getNodeById("D").inDegree() ).to.equal( 1 );
     expect( graph.getNodeById("D").outDegree() ).to.equal( 2 );
     expect( graph.getNodeById("D").degree() ).to.equal( 1);
     });


     it('Single Closeness test on node E', () => {
     expect( graph.getNodeById("E").inDegree() ).to.equal( 3 );
     expect( graph.getNodeById("E").outDegree() ).to.equal( 0 );
     expect( graph.getNodeById("E").degree() ).to.equal( 2 );
     });


     it('Single Closeness test on node F', () => {
     expect( graph.getNodeById("F").inDegree() ).to.equal( 1 );
     expect( graph.getNodeById("F").outDegree() ).to.equal( 2 );
     expect( graph.getNodeById("F").degree() ).to.equal( 0 );
     });*/

});