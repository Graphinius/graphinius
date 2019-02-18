import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $DC from '../../src/centralities/Degree';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    deg_cent_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(deg_cent_graph),
    DC: $DC.DegreeCentrality = new $DC.DegreeCentrality();


describe("Degree Centrality Tests - ", () => {

  const GRAPH_SIZE = 7;

  test('should return a degree distribution object of length 7', () => {
    let deg_dist = DC.degreeDistribution( graph ).all;
    expect( deg_dist.length ).toBe(GRAPH_SIZE);
  });


  test('should return the correct IN degree distribution', () => {
    let expected_in_dist = new Uint32Array([0, 3, 1, 1, 1, 0, 0]);
    let in_dist = DC.degreeDistribution( graph ).in;
    expect( in_dist ).toEqual(expected_in_dist);
  });


  test('should return the correct OUT degree distribution', () => {
    let expected_out_dist = new Uint32Array([1, 0, 3, 2, 0, 0, 0]);
    let out_dist = DC.degreeDistribution( graph ).out;
    expect( out_dist ).toEqual(expected_out_dist);
  });


  test('should return the correct UND degree distribution', () => {
    let expected_und_dist = new Uint32Array([3, 2, 1, 0, 0, 0, 0]);
    let und_dist = DC.degreeDistribution( graph ).und;
    expect( und_dist ).toEqual(expected_und_dist);
  });


  test('should return the correct DIR degree distribution', () => {
    let expected_dir_dist = new Uint32Array([0, 0, 0, 3, 1, 1, 1]);
    let dir_dist = DC.degreeDistribution( graph ).dir;
    expect( dir_dist ).toEqual(expected_dir_dist);
  });


  test('should return the correct ALL degree distribution', () => {
    let expected_all_dist = new Uint32Array([0, 0, 0, 1, 1, 3, 1]);
    let all_dist = DC.degreeDistribution( graph ).all;
    expect( all_dist ).toEqual(expected_all_dist);
  });


  let DC_map_allW = DC.getCentralityMap(graph, true);
  let DC_map_inW = DC.getCentralityMap(graph, true, $DC.DegreeMode.in);
  let DC_map_outW = DC.getCentralityMap(graph, true,$DC.DegreeMode.out);
  let DC_map_dirW = DC.getCentralityMap(graph, true,$DC.DegreeMode.dir);
  let DC_map_undW = DC.getCentralityMap(graph, true,$DC.DegreeMode.und);

  test('Single degree test on node A, weighted', () => {
    expect( DC_map_inW["A"] ).toBe(6);
    expect( DC_map_outW["A"] ).toBe(8);
    expect( DC_map_undW["A"] ).toBe(0);
    expect( DC_map_dirW["A"] ).toBe(14);
    expect( DC_map_allW["A"] ).toBe(14);
  });


  test('Single degree test on node B, weighted', () => {
    expect( DC_map_inW["B"]).toBe(3);
    expect( DC_map_outW["B"] ).toBe(8);
    expect( DC_map_undW["B"] ).toBe(5);
    expect( DC_map_dirW["B"] ).toBe(11);
    expect( DC_map_allW["B"] ).toBe(16);
  });


  test('Single degree test on node C, weighted', () => {
    expect( DC_map_inW["C"]).toBe(15);
    expect( DC_map_outW["C"] ).toBe(2);
    expect( DC_map_undW["C"] ).toBe(0);
    expect( DC_map_dirW["C"] ).toBe(17);
    expect( DC_map_allW["C"] ).toBe(17);
  });


  test('Single degree test on node D, weighted', () => {
    expect( DC_map_inW["D"]).toBe(1);
    expect( DC_map_outW["D"] ).toBe(23);
    expect( DC_map_undW["D"] ).toBe(0);
    expect( DC_map_dirW["D"] ).toBe(24);
    expect( DC_map_allW["D"] ).toBe(24);
  });


  test('Single degree test on node E, weighted', () => {
    expect( DC_map_inW["E"]).toBe(23);
    expect( DC_map_outW["E"] ).toBe(0);
    expect( DC_map_undW["E"] ).toBe(5);
    expect( DC_map_dirW["E"] ).toBe(23);
    expect( DC_map_allW["E"] ).toBe(28);
  });


  test('Single degree test on node F, weighted', () => {
    expect( DC_map_inW["F"]).toBe(1);
    expect( DC_map_outW["F"] ).toBe(8);
    expect( DC_map_undW["F"] ).toBe(0);
    expect( DC_map_dirW["F"] ).toBe(9);
    expect( DC_map_allW["F"] ).toBe(9);
  });


  //Now test all of them with weighted edges
  let DC_map_all = DC.getCentralityMap(graph, false);
  let DC_map_in = DC.getCentralityMap(graph, false, $DC.DegreeMode.in);
  let DC_map_out = DC.getCentralityMap(graph, false,$DC.DegreeMode.out);
  let DC_map_dir = DC.getCentralityMap(graph, false,$DC.DegreeMode.dir);
  let DC_map_und = DC.getCentralityMap(graph, false,$DC.DegreeMode.und);

  test('Single degree test on node A', () => {
    expect( DC_map_in["A"] ).toBe(2);
    expect( DC_map_out["A"] ).toBe(3);
    expect( DC_map_und["A"] ).toBe(0);
    expect( DC_map_dir["A"] ).toBe(2+3);
    expect( DC_map_all["A"] ).toBe(2+3+0);
  });


  test('Single degree test on node B', () => {
    expect( DC_map_in["B"]).toBe(1);
    expect( DC_map_out["B"] ).toBe(3);
    expect( DC_map_und["B"] ).toBe(1);
    expect( DC_map_dir["B"] ).toBe(1 + 3);
    expect( DC_map_all["B"] ).toBe(1 + 3 + 1);
  });


  test('Single degree test on node C', () => {
    expect( DC_map_in["C"]).toBe(4);
    expect( DC_map_out["C"] ).toBe(2);
    expect( DC_map_und["C"] ).toBe(0);
    expect( DC_map_dir["C"] ).toBe(4 + 2);
    expect( DC_map_all["C"] ).toBe(4 + 2 +0);
  });


  test('Single degree test on node D', () => {
    expect( DC_map_in["D"]).toBe(1);
    expect( DC_map_out["D"] ).toBe(2);
    expect( DC_map_und["D"] ).toBe(1);
    expect( DC_map_dir["D"] ).toBe(1 + 2);
    expect( DC_map_all["D"] ).toBe(1 + 2 + 1);
  });


  test('Single degree test on node E', () => {
    expect( DC_map_in["E"]).toBe(3);
    expect( DC_map_out["E"] ).toBe(0);
    expect( DC_map_und["E"] ).toBe(2);
    expect( DC_map_dir["E"] ).toBe(3 + 0);
    expect( DC_map_all["E"] ).toBe(3 + 0 + 2);
  });


  test('Single degree test on node F', () => {
    expect( DC_map_in["F"]).toBe(1);
    expect( DC_map_out["F"] ).toBe(2);
    expect( DC_map_und["F"] ).toBe(0);
    expect( DC_map_dir["F"] ).toBe(1 + 2);
    expect( DC_map_all["F"] ).toBe(1 + 2 + 0);
  });

  test('Test default configuration', ()=>{
    expect(DC_map_all).toEqual(DC.getCentralityMap(graph,false,$DC.DegreeMode.all));
  });

});