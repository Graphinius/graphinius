/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $EME from '../../src/energyminimization/expansionBoykov';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    eme_graph = "./test/test_data/min_cut_max_flow_graph.json",
    graph : $G.IGraph,
    labels : Array<string> = ["1", "2"],
    eme : $EME.IEMEBoykov;


describe('EME Boykov Tests - ', () => {

  beforeEach(() => {
    graph = json.readFromJSONFile(eme_graph);
    eme = new $EME.EMEBoykov(graph, labels);
  });


  describe.only("Base Tests - ", () => {

    it('should instantiate a standard config', () => {
      expect( eme.prepareEMEStandardConfig() ).to.deep.equal( {directed: true, labeled: false} );
    });

  });

});
