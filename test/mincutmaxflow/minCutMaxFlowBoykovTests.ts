/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $MC from '../../src/mincutmaxflow/minCutMaxFlowBoykov';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    mcmf_graph = "./test/test_data/min_cut_max_flow_graph.json",
    graph : $G.IGraph,
    mcmf : $MC.IMCMFBoykov;


describe('MCMF Boykov Tests - ', () => {

  beforeEach(() => {
    graph = json.readFromJSONFile(mcmf_graph);
    mcmf = new $MC.MCMFBoykov(graph, graph.getNodeById("A"), graph.getNodeById("Z"));
  });


  describe("Base Tests - ", () => {

    it('should instantiate a standard config', () => {
      expect( mcmf.prepareMCMFStandardConfig() ).to.deep.equal( {directed: true} );
    });

  });

  describe("Min Cut Test - ", () => {

    it('should separate the graph in two disjoint sets so that the cost is minimized', () => {
      expect( mcmf.calculateCycle().cost ).to.equal( 14);
      expect( mcmf.calculateCycle().edgeIDs ).to.include.members(["A_B_d", "B_A_d", "C_E_d", "E_C_d", "C_D_d", "D_C_d"] );
    });

  });

  // describe("Tree FCT Test - ", () => {
  //
  //   it("should compute the right tree of the node", () => {
  //     expect(mcmf.tree)
  //   });
  // });

  describe.only("Lola test", () => {
    var lola_path = "/home/nico/MedicalImageData/LungLobeSegmentation/_lola_graph.json";
    var json_lola   : $I.IJSONInput = new $I.JSONInput(false, true, true);
    var graph_lola: $G.IGraph = json_lola.readFromJSONFile(lola_path);
    var mcmf_lola = new $MC.MCMFBoykov(graph_lola, graph_lola.getNodeById("92477"), graph_lola.getNodeById("37272"));

    it ('should work', () => {
      expect(mcmf_lola.calculateCycle().cost).to.equal(12);
    });
  });

});
