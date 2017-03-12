/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $PRC from '../../src/centralities/PageRankDeterministic';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph);


describe("PageRank Centrality Tests", () => {

    it('should print some output', () => {
        let deg_dist = $PRC.pageRankDetCentrality( graph );
        expect( deg_dist ).to.equal({});
    });

    /*
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