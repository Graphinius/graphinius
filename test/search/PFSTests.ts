/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $BFS from '../../src/search/BFS';
import * as $DFS from '../../src/search/DFS';
import * as $PFS from '../../src/search/PFS';

var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    config : $PFS.PFS_Config,
    search_graph = "./test/input/test_data/search_graph.json",
    graph : $G.IGraph = json.readFromJSONFile(search_graph);


describe('PFS TESTS - ', () => {

  beforeEach(() => {
    expect(graph).not.to.be.undefined;
  });


  describe('Basic PFSBFS_Config instantiation tests - ', () => {

    it('Should correctly initialize MIXED mode as default direction', () => {
      config = $PFS.prepareStandardPFSBFSConfig();

      expect(config.dir_mode).to.equal($G.GraphMode.MIXED);
    });

    
    it('Should correctly initialize a non-null cost function', () => {
      config = $PFS.prepareStandardPFSBFSConfig();

      expect(config.cost_function).not.to.be.undefined;
      expect(config.cost_function).not.to.be.null;
    });


    it('Should correctly sort some test adjacency nodes', () => {
      config = $PFS.prepareStandardPFSBFSConfig();

      var context : $BFS.BFS_Scope = {
        adj_nodes: graph.getNodeById('A').adjNodes(),
        current: undefined,
        marked: undefined,
        next_edge: undefined,
        next_node: undefined,
        nodes: undefined,
        queue: undefined,
        root_node: undefined
      };
      var adj_nodes = config.cost_function(context);

      for ( var adj_idx in adj_nodes ) {
        if (adj_idx-1 >= 0) {
          expect(adj_nodes[adj_idx].edge.getWeight()).to.be.at.least(adj_nodes[adj_idx-1].edge.getWeight());
        }
      }

    });

  });

});