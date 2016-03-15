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
    search_graph = "./test/input/test_data/search_graph_pfs.json",
    graph : $G.IGraph = json.readFromJSONFile(search_graph);


describe('PFS TESTS - ', () => {

  beforeEach(() => {
    expect(graph).not.to.be.undefined;
    expect(graph.nrNodes()).to.equal(6);
    expect(graph.nrUndEdges()).to.equal(0);
    expect(graph.nrDirEdges()).to.equal(9);
  });


  describe('Basic PFS_BFS_Config instantiation tests - ', () => {

    it('Should correctly initialize MIXED mode as default direction', () => {
      config = $PFS.preparePFSBFSStandardConfig();

      expect(config.dir_mode).to.equal($G.GraphMode.MIXED);
    });

    
    it('Should correctly initialize a non-null cost function', () => {
      config = $PFS.preparePFSBFSStandardConfig();

      expect(config.cost_function).not.to.be.undefined;
      expect(config.cost_function).not.to.be.null;
    });


    it('Should correctly sort some test adjacency nodes', () => {
      config = $PFS.preparePFSBFSStandardConfig();

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

      var idx;
      for ( var adj_idx in adj_nodes ) {
        idx = ~~adj_idx;
        if ( idx ) {
          expect(adj_nodes[idx].edge.getWeight()).to.be.at.least(adj_nodes[idx-1].edge.getWeight());
        }
      }
      expect(idx).to.equal(2);
      expect(adj_nodes[0].node.getID()).to.equal('D');
      expect(adj_nodes[0].edge.getWeight()).to.equal(1);
      expect(adj_nodes[1].node.getID()).to.equal('B');
      expect(adj_nodes[1].edge.getWeight()).to.equal(3);
      expect(adj_nodes[2].node.getID()).to.equal('C');
      expect(adj_nodes[2].edge.getWeight()).to.equal(4);
    });

  });


  /**
   * Standard PFS config sorts edges by weight, ascending,
   * so we use standard for 2 nodes and then a custom
   * (descending weight) cost function for the same nodes again
   */
  describe('PFS_BFS graph traversal tests with edge weight ascending sort - ', () => {
    
    it('Should traverse search graph in correct order, ascending, root is A', () => {
      var root = graph.getNodeById('A'),
          pfs_bfs_res = $PFS.PFS_BFS(graph, root);

      expect(Object.keys(pfs_bfs_res).length).to.equal(6);

      expect(pfs_bfs_res['A'].counter).to.equal(0);
      expect(pfs_bfs_res['B'].counter).to.equal(2);
      expect(pfs_bfs_res['C'].counter).to.equal(3);
      expect(pfs_bfs_res['D'].counter).to.equal(1);
      expect(pfs_bfs_res['E'].counter).to.equal(4);
      expect(pfs_bfs_res['F'].counter).to.equal(5);

      expect(pfs_bfs_res['A'].distance).to.equal(0);
      expect(pfs_bfs_res['B'].distance).to.equal(1);
      expect(pfs_bfs_res['C'].distance).to.equal(1);
      expect(pfs_bfs_res['D'].distance).to.equal(1);
      expect(pfs_bfs_res['E'].distance).to.equal(2);
      expect(pfs_bfs_res['F'].distance).to.equal(2);

      expect(pfs_bfs_res['A'].parent).to.equal(root);
      expect(pfs_bfs_res['B'].parent).to.equal(root);
      expect(pfs_bfs_res['C'].parent).to.equal(root);
      expect(pfs_bfs_res['D'].parent).to.equal(root);
      expect(pfs_bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
      expect(pfs_bfs_res['F'].parent).to.equal(graph.getNodeById('B'));
    });


    it('Should traverse search graph in correct order, ascending, root is D', () => {
      var root = graph.getNodeById('D'),
          pfs_bfs_res = $PFS.PFS_BFS(graph, root);

      expect(Object.keys(pfs_bfs_res).length).to.equal(6);

      expect(pfs_bfs_res['A'].counter).to.equal(-1);
      expect(pfs_bfs_res['B'].counter).to.equal(-1);
      expect(pfs_bfs_res['C'].counter).to.equal(1);
      expect(pfs_bfs_res['D'].counter).to.equal(0);
      expect(pfs_bfs_res['E'].counter).to.equal(2);
      expect(pfs_bfs_res['F'].counter).to.equal(-1);

      expect(pfs_bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
      expect(pfs_bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
      expect(pfs_bfs_res['C'].distance).to.equal(1);
      expect(pfs_bfs_res['D'].distance).to.equal(0);
      expect(pfs_bfs_res['E'].distance).to.equal(1);
      expect(pfs_bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);

      expect(pfs_bfs_res['A'].parent).to.equal(null);
      expect(pfs_bfs_res['B'].parent).to.equal(null);
      expect(pfs_bfs_res['C'].parent).to.equal(root);
      expect(pfs_bfs_res['D'].parent).to.equal(root);
      expect(pfs_bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
      expect(pfs_bfs_res['F'].parent).to.equal(null);
    });


    it('Should traverse search graph in correct order, DEscending, root is A', () => {
      config = $PFS.preparePFSBFSStandardConfig();
      config.cost_function = (context: $BFS.BFS_Scope) => {
        return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
          return b.edge.getWeight() - a.edge.getWeight();
        });
      };
      var root = graph.getNodeById('A'),
          pfs_bfs_res = $PFS.PFS_BFS(graph, root, config);

      expect(Object.keys(pfs_bfs_res).length).to.equal(6);

      expect(pfs_bfs_res['A'].counter).to.equal(0);
      expect(pfs_bfs_res['B'].counter).to.equal(2);
      expect(pfs_bfs_res['C'].counter).to.equal(1);
      expect(pfs_bfs_res['D'].counter).to.equal(3);
      expect(pfs_bfs_res['E'].counter).to.equal(4);
      expect(pfs_bfs_res['F'].counter).to.equal(5);

      expect(pfs_bfs_res['A'].distance).to.equal(0);
      expect(pfs_bfs_res['B'].distance).to.equal(1);
      expect(pfs_bfs_res['C'].distance).to.equal(1);
      expect(pfs_bfs_res['D'].distance).to.equal(1);
      expect(pfs_bfs_res['E'].distance).to.equal(2);
      expect(pfs_bfs_res['F'].distance).to.equal(2);

      expect(pfs_bfs_res['A'].parent).to.equal(root);
      expect(pfs_bfs_res['B'].parent).to.equal(root);
      expect(pfs_bfs_res['C'].parent).to.equal(root);
      expect(pfs_bfs_res['D'].parent).to.equal(root);
      expect(pfs_bfs_res['E'].parent).to.equal(graph.getNodeById('C'));
      expect(pfs_bfs_res['F'].parent).to.equal(graph.getNodeById('B'));
    });


    it('Should traverse search graph in correct order, DEscending, root is D', () => {
      config = $PFS.preparePFSBFSStandardConfig();
      config.cost_function = (context: $BFS.BFS_Scope) => {
        return context.adj_nodes.sort((a: $N.NeighborEntry, b: $N.NeighborEntry) => {
          return b.edge.getWeight() - a.edge.getWeight();
        });
      };
      var root = graph.getNodeById('D'),
        pfs_bfs_res = $PFS.PFS_BFS(graph, root, config);

      expect(Object.keys(pfs_bfs_res).length).to.equal(6);

      expect(pfs_bfs_res['A'].counter).to.equal(-1);
      expect(pfs_bfs_res['B'].counter).to.equal(-1);
      expect(pfs_bfs_res['C'].counter).to.equal(2);
      expect(pfs_bfs_res['D'].counter).to.equal(0);
      expect(pfs_bfs_res['E'].counter).to.equal(1);
      expect(pfs_bfs_res['F'].counter).to.equal(-1);

      expect(pfs_bfs_res['A'].distance).to.equal(Number.POSITIVE_INFINITY);
      expect(pfs_bfs_res['B'].distance).to.equal(Number.POSITIVE_INFINITY);
      expect(pfs_bfs_res['C'].distance).to.equal(1);
      expect(pfs_bfs_res['D'].distance).to.equal(0);
      expect(pfs_bfs_res['E'].distance).to.equal(1);
      expect(pfs_bfs_res['F'].distance).to.equal(Number.POSITIVE_INFINITY);

      expect(pfs_bfs_res['A'].parent).to.equal(null);
      expect(pfs_bfs_res['B'].parent).to.equal(null);
      expect(pfs_bfs_res['C'].parent).to.equal(root);
      expect(pfs_bfs_res['D'].parent).to.equal(root);
      expect(pfs_bfs_res['E'].parent).to.equal(graph.getNodeById('D'));
      expect(pfs_bfs_res['F'].parent).to.equal(null);
    });
    
  });


  describe('Basic PFS_DFS_Config instantiation tests - ', () => {

    it('Should correctly initialize MIXED mode as default direction', () => {
      config = $PFS.preparePFSDFSStandardConfig();

      expect(config.dir_mode).to.equal($G.GraphMode.MIXED);
    });


    it('Should correctly initialize a non-null cost function', () => {
      config = $PFS.preparePFSDFSStandardConfig();
    
      expect(config.cost_function).not.to.be.undefined;
      expect(config.cost_function).not.to.be.null;
    });
    
    
    it('Should correctly sort some test adjacency nodes', () => {
      config = $PFS.preparePFSDFSStandardConfig();
    
      var context : $DFS.DFSVisit_Scope = {
        adj_nodes: graph.getNodeById('A').adjNodes(),
        current: undefined,
        current_root: undefined,
        stack: undefined,
        stack_entry: undefined
      };
      var adj_nodes = config.cost_function(context);
    
      var idx;
      for ( var adj_idx in adj_nodes ) {
        idx = ~~adj_idx;
        if ( idx ) {
          expect(adj_nodes[idx].edge.getWeight()).to.be.at.least(adj_nodes[idx-1].edge.getWeight());
        }
      }
      expect(idx).to.equal(2);
      expect(adj_nodes[0].node.getID()).to.equal('D');
      expect(adj_nodes[0].edge.getWeight()).to.equal(1);
      expect(adj_nodes[1].node.getID()).to.equal('B');
      expect(adj_nodes[1].edge.getWeight()).to.equal(3);
      expect(adj_nodes[2].node.getID()).to.equal('C');
      expect(adj_nodes[2].edge.getWeight()).to.equal(4);
    });

  });

});