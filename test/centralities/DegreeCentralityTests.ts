/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $DC from '../../src/centralities/DegreeCentrality';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph);


describe("Degree Centrality Tests", () => {

  it('should return a degree distribution object of length 7', () => {
    let deg_dist = $DC.degreeCentrality( graph ).all
    expect( Object.keys( deg_dist ).length ).to.equal(7);
  });


  it('should return the correct IN degree distribution', () => {
    let expected_in_dist = {
      0: 0,
      1: 3,
      2: 1,
      3: 1,
      4: 1,
      5: 0,
      6: 0
    }
    let in_deg_dist = $DC.degreeCentrality( graph ).in;
    expect( in_deg_dist ).to.deep.equal( expected_in_dist );
  });

  it('should return the correct OUT degree distribution', () => {
    let expected_out_dist = {
      0: 1,
      1: 0,
      2: 3,
      3: 2,
      4: 0,
      5: 0,
      6: 0
    }
    let out_deg_dist = $DC.degreeCentrality( graph ).out;
    expect( out_deg_dist ).to.deep.equal( expected_out_dist );
  });


  it('should return the correct UND degree distribution', () => {
    let expected_und_dist = {
      0: 3,
      1: 2,
      2: 1,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    }
    let und_deg_dist = $DC.degreeCentrality( graph ).und;
    expect( und_deg_dist ).to.deep.equal( expected_und_dist );
  });


  it('should return the correct DIR degree distribution', () => {
    let expected_dir_dist = {
      0: 0,
      1: 0,
      2: 0,
      3: 3,
      4: 1,
      5: 1,
      6: 1
    }
    let dir_deg_dist = $DC.degreeCentrality( graph ).dir;
    expect( dir_deg_dist ).to.deep.equal( expected_dir_dist );
  });


  it('should return the correct ALL degree distribution', () => {
    let expected_all_dist = {
      0: 0,
      1: 0,
      2: 0,
      3: 1,
      4: 1,
      5: 3,
      6: 1
    }
    let all_deg_dist = $DC.degreeCentrality( graph ).all;
    expect( all_deg_dist ).to.deep.equal( expected_all_dist );
  });


  it('Single degree test on node A', () => {
    expect( graph.getNodeById("A").inDegree() ).to.equal( 2 );
    expect( graph.getNodeById("A").outDegree() ).to.equal( 3 );
    expect( graph.getNodeById("A").degree() ).to.equal( 0 );
  });


  it('Single degree test on node B', () => {
    expect( graph.getNodeById("B").inDegree() ).to.equal( 1 );
    expect( graph.getNodeById("B").outDegree() ).to.equal( 3 );
    expect( graph.getNodeById("B").degree() ).to.equal( 1 );
  });


  it('Single degree test on node C', () => {
    expect( graph.getNodeById("C").inDegree() ).to.equal( 4 );
    expect( graph.getNodeById("C").outDegree() ).to.equal( 2 );
    expect( graph.getNodeById("C").degree() ).to.equal( 0 );
  });


  it('Single degree test on node D', () => {
    expect( graph.getNodeById("D").inDegree() ).to.equal( 1 );
    expect( graph.getNodeById("D").outDegree() ).to.equal( 2 );
    expect( graph.getNodeById("D").degree() ).to.equal( 1);
  });


  it('Single degree test on node E', () => {
    expect( graph.getNodeById("E").inDegree() ).to.equal( 3 );
    expect( graph.getNodeById("E").outDegree() ).to.equal( 0 );
    expect( graph.getNodeById("E").degree() ).to.equal( 2 );
  });


  it('Single degree test on node F', () => {
    expect( graph.getNodeById("F").inDegree() ).to.equal( 1 );
    expect( graph.getNodeById("F").outDegree() ).to.equal( 2 );
    expect( graph.getNodeById("F").degree() ).to.equal( 0 );
  });

});