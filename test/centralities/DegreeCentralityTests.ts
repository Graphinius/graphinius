/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $DC from '../../src/centralities/DegreeCentrality';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph),
    DC: $DC.degreeCentrality = new $DC.degreeCentrality();


describe("Degree Centrality Tests", () => {

  it('should return a degree distribution object of length 7', () => {
    let deg_dist = DC.getHistorgram( graph ).all;
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
    };
    let in_deg_dist = DC.getHistorgram( graph ).in;
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
    };
    let out_deg_dist = DC.getHistorgram( graph ).out;
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
    };
    let und_deg_dist = DC.getHistorgram( graph ).und;
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
    };
    let dir_deg_dist = DC.getHistorgram( graph ).dir;
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
    };
    let all_deg_dist = DC.getHistorgram( graph ).all;
    expect( all_deg_dist ).to.deep.equal( expected_all_dist );
  });

  let DC_map_all = DC.getCentralityMap(graph);
  let DC_map_in = DC.getCentralityMap(graph, $DC.DegreeMode.in);
  let DC_map_out = DC.getCentralityMap(graph, $DC.DegreeMode.out);
  let DC_map_dir = DC.getCentralityMap(graph, $DC.DegreeMode.dir);
  let DC_map_und = DC.getCentralityMap(graph, $DC.DegreeMode.und);

  console.log("A:" + DC_map_in["A"]);
  console.log("B:" + DC_map_in["B"]);
  console.log("C:" + DC_map_in["C"]);
  it('Single degree test on node A', () => {
    expect( DC_map_in["A"] ).to.equal( 2 );
    expect( DC_map_out["A"] ).to.equal( 3 );
    expect( DC_map_und["A"] ).to.equal( 0 );
    expect( DC_map_dir["A"] ).to.equal( 2+3 );
    expect( DC_map_all["A"] ).to.equal( 2+3+0 );
  });


  it('Single degree test on node B', () => {
    expect( DC_map_in["B"]).to.equal( 1 );
    expect( DC_map_out["B"] ).to.equal( 3 );
    expect( DC_map_und["B"] ).to.equal( 1 );
    expect( DC_map_dir["B"] ).to.equal( 1 + 3 );
    expect( DC_map_all["B"] ).to.equal( 1 + 3 + 1 );
  });


  it('Single degree test on node C', () => {
    expect( DC_map_in["C"]).to.equal( 4 );
    expect( DC_map_out["C"] ).to.equal( 2 );
    expect( DC_map_und["C"] ).to.equal( 0 );
    expect( DC_map_dir["C"] ).to.equal( 4 + 2 );
    expect( DC_map_all["C"] ).to.equal( 4 + 2 +0 );
  });


  it('Single degree test on node D', () => {
    expect( DC_map_in["D"]).to.equal( 1 );
    expect( DC_map_out["D"] ).to.equal( 2 );
    expect( DC_map_und["D"] ).to.equal( 1);
    expect( DC_map_dir["D"] ).to.equal( 1 + 2);
    expect( DC_map_all["D"] ).to.equal( 1 + 2 + 1);
  });


  it('Single degree test on node E', () => {
    expect( DC_map_in["E"]).to.equal( 3 );
    expect( DC_map_out["E"] ).to.equal( 0 );
    expect( DC_map_und["E"] ).to.equal( 2 );
    expect( DC_map_dir["E"] ).to.equal( 3 + 0 );
    expect( DC_map_all["E"] ).to.equal( 3 + 0 + 2 );
  });


  it('Single degree test on node F', () => {
    expect( DC_map_in["F"]).to.equal( 1 );
    expect( DC_map_out["F"] ).to.equal( 2 );
    expect( DC_map_und["F"] ).to.equal( 0 );
    expect( DC_map_dir["F"] ).to.equal( 1 + 2 );
    expect( DC_map_all["F"] ).to.equal( 1 + 2 + 0 );
  });

  it('Test default configuration',()=>{
    expect(DC_map_all).to.deep.equal(DC.getCentralityMap(graph,$DC.DegreeMode.all));
  });

});