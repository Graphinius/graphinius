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
    // mcmf = new $MC.MCMFBoykov(graph, graph.getNodeById("80260"), graph.getNodeById("22457"));

  });


  describe("Base Tests - ", () => {

    it('should instantiate a standard config', () => {
      expect( mcmf.prepareMCMFStandardConfig() ).to.deep.equal( {directed: true} );
    });

  });

  describe.only("Min Cut Test - ", () => {

    it('should separate the graph in two disjoint sets so that the cost is minimized', () => {
      expect( mcmf.calculateCycle() ).to.deep.equal( {
        edges: [],
        cost: 0
      } );
    });
  });

});
