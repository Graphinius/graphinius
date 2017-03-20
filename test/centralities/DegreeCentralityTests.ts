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

  let DC_map_allW = DC.getCentralityMap(graph, true);
  let DC_map_inW = DC.getCentralityMap(graph, true, $DC.DegreeMode.in);
  let DC_map_outW = DC.getCentralityMap(graph, true,$DC.DegreeMode.out);
  let DC_map_dirW = DC.getCentralityMap(graph, true,$DC.DegreeMode.dir);
  let DC_map_undW = DC.getCentralityMap(graph, true,$DC.DegreeMode.und);

  it('Single degree test on node A, weighted', () => {
    expect( DC_map_inW["A"] ).to.equal( 6 );
    expect( DC_map_outW["A"] ).to.equal( 8 );
    expect( DC_map_undW["A"] ).to.equal( 0 );
    expect( DC_map_dirW["A"] ).to.equal( 14 );
    expect( DC_map_allW["A"] ).to.equal( 14 );
  });


  it('Single degree test on node B, weighted', () => {
    expect( DC_map_inW["B"]).to.equal( 3 );
    expect( DC_map_outW["B"] ).to.equal( 8 );
    expect( DC_map_undW["B"] ).to.equal( 5 );
    expect( DC_map_dirW["B"] ).to.equal( 11 );
    expect( DC_map_allW["B"] ).to.equal( 16 );
  });


  it('Single degree test on node C, weighted', () => {
    expect( DC_map_inW["C"]).to.equal( 15 );
    expect( DC_map_outW["C"] ).to.equal( 2 );
    expect( DC_map_undW["C"] ).to.equal( 0 );
    expect( DC_map_dirW["C"] ).to.equal( 17 );
    expect( DC_map_allW["C"] ).to.equal( 17 );
  });


  it('Single degree test on node D, weighted', () => {
    expect( DC_map_inW["D"]).to.equal( 1 );
    expect( DC_map_outW["D"] ).to.equal( 23 );
    expect( DC_map_undW["D"] ).to.equal( 0);
    expect( DC_map_dirW["D"] ).to.equal( 24);
    expect( DC_map_allW["D"] ).to.equal( 24);
  });


  it('Single degree test on node E, weighted', () => {
    expect( DC_map_inW["E"]).to.equal( 23 );
    expect( DC_map_outW["E"] ).to.equal( 0 );
    expect( DC_map_undW["E"] ).to.equal( 5 );
    expect( DC_map_dirW["E"] ).to.equal( 23 );
    expect( DC_map_allW["E"] ).to.equal( 28 );
  });


  it('Single degree test on node F, weighted', () => {
    expect( DC_map_inW["F"]).to.equal( 1 );
    expect( DC_map_outW["F"] ).to.equal( 8 );
    expect( DC_map_undW["F"] ).to.equal( 0 );
    expect( DC_map_dirW["F"] ).to.equal( 9 );
    expect( DC_map_allW["F"] ).to.equal( 9 );
  });


  //Now test all of them with weighted edges
  let DC_map_all = DC.getCentralityMap(graph, false);
  let DC_map_in = DC.getCentralityMap(graph, false, $DC.DegreeMode.in);
  let DC_map_out = DC.getCentralityMap(graph, false,$DC.DegreeMode.out);
  let DC_map_dir = DC.getCentralityMap(graph, false,$DC.DegreeMode.dir);
  let DC_map_und = DC.getCentralityMap(graph, false,$DC.DegreeMode.und);

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
    expect(DC_map_all).to.deep.equal(DC.getCentralityMap(graph,false,$DC.DegreeMode.all));
  });

});