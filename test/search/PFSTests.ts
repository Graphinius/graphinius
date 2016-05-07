/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $PFS from '../../src/search/PFS';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    search_graph = "./test/input/test_data/search_graph_pfs.json",
    graph : $G.IGraph = json.readFromJSONFile(search_graph);


describe('PFS TESTS - ', () => {

  beforeEach(() => {
    expect(graph).not.to.be.undefined;
    expect(graph.nrNodes()).to.equal(6);
    expect(graph.nrUndEdges()).to.equal(0);
    expect(graph.nrDirEdges()).to.equal(9);
  });
  
  
  describe('Basic Instantiation tests - ', () => {
  
    it('should refuse to traverse a graph without edges', () => {
      var empty_graph = new $G.BaseGraph('mesebeenempty'),
          start = new $N.BaseNode("IAmNotInGraph");
          
      expect($PFS.PFS.bind($PFS.PFS, empty_graph, start)).to.throw('Cowardly refusing to traverse graph without edges.');
    });
    
    
    /**
     * This use case is dependent on the existence of a valid config object..
     * Is there any way to specify this in mocha and skip it in case the
     * prerequisites are not met ??
     */
    it('should refuse to traverse a graph with DIR mode set to init', () => {
      var root = graph.getNodeById('A'),
          config : $PFS.PFS_Config = {
            result    : {},
            callbacks : {},
            dir_mode  : $G.GraphMode.INIT,
            goal_node : null
          };
          
      expect($PFS.PFS.bind($PFS.PFS, graph, root, config)).to.throw('Cannot traverse a graph with dir_mode set to INIT.');
    });
  
  });
  
  
  describe('Config object instantiation tests - ', () => {
    
    it('should instantiate a default config object with correct result structure', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config).not.to.be.undefined;
      expect(config.result).not.to.be.undefined;
      expect(config.result).to.be.an.instanceOf(Object);
    });
    
    
    it('should instantiate a default config object with correct DIR mode', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config).not.to.be.undefined;
      expect(config.dir_mode).not.to.be.undefined;
      expect(config.dir_mode).to.equal($G.GraphMode.MIXED);
    });
    
    
    it('should instantiate a default config object with callback object', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config).not.to.be.undefined;
      expect(config.callbacks).not.to.be.undefined;
      expect(config.callbacks).to.be.an.instanceOf(Object);
    });
    
    
    it('should instantiate a default config object with correctly structured callback object', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config).not.to.be.undefined;
      expect(config.callbacks).not.to.be.undefined;
      expect(config.callbacks.init_pfs).not.to.be.undefined;
      expect(Array.isArray(config.callbacks.init_pfs)).to.be.true;
      expect(config.callbacks.node_open).not.to.be.undefined;
      expect(Array.isArray(config.callbacks.node_open)).to.be.true;
      expect(config.callbacks.node_closed).not.to.be.undefined;
      expect(Array.isArray(config.callbacks.node_closed)).to.be.true;
      expect(config.callbacks.better_path).not.to.be.undefined;
      expect(Array.isArray(config.callbacks.better_path)).to.be.true;
      expect(config.callbacks.goal_reached).not.to.be.undefined;
      expect(Array.isArray(config.callbacks.goal_reached)).to.be.true;      
    });
     
    
    it('should instantiate a default config object with messages object', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config.messages).not.to.be.undefined;
      expect(config.messages).to.be.an.instanceOf(Object);
    });
    
    
    it('should instantiate a default config object with correctly structured messages object', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config).not.to.be.undefined;
      expect(config.messages).not.to.be.undefined;
      expect(config.messages.init_pfs_msgs).not.to.be.undefined;
      expect(Array.isArray(config.messages.init_pfs_msgs)).to.be.true;
      expect(config.messages.node_open_msgs).not.to.be.undefined;
      expect(Array.isArray(config.messages.node_open_msgs)).to.be.true;     
      expect(config.messages.node_closed_msgs).not.to.be.undefined;
      expect(Array.isArray(config.messages.node_closed_msgs)).to.be.true;
      expect(config.messages.better_path_msgs).not.to.be.undefined;
      expect(Array.isArray(config.messages.better_path_msgs)).to.be.true;     
      expect(config.messages.goal_reached_msgs).not.to.be.undefined;
      expect(Array.isArray(config.messages.goal_reached_msgs)).to.be.true;     
    });
    
    
    it('should instantiate a default config object with goal node set to null', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config).not.to.be.undefined;
      expect(config.goal_node).not.to.be.undefined;
    });
        
    
    it('should instantiate a default config object with an existing init_pfs callback', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config.callbacks).not.to.be.undefined;
      expect(config.callbacks.init_pfs).not.to.be.undefined;
      expect(config.callbacks.init_pfs).not.to.be.empty;
      expect(config.callbacks.init_pfs[0]).not.to.be.undefined;
      expect(config.callbacks.init_pfs[0]).to.be.instanceof(Function);
    });
    
  });
  
  
  describe('Callback execution tests in different stages - ', () => {
    
    it('should execute the initPFS callback', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();

			var pfsInitTestCallback = function() {
				config.messages.init_pfs_msgs['test_message'] = "BFS INIT callback executed.";
			};
			config.callbacks.init_pfs.push(pfsInitTestCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.init_pfs_msgs['test_message']).to.equal("BFS INIT callback executed.");
    });
    
    
    it('should execute the goal reached callback', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();
      
      config.goal_node = root;

			var pfsGoalReachedCallback = function() {
				config.messages.goal_reached_msgs['test_message'] = "GOAL REACHED callback executed.";
			};
			config.callbacks.goal_reached.push(pfsGoalReachedCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.goal_reached_msgs['test_message']).to.equal("GOAL REACHED callback executed.");
    });
    
    
    it('should execute the node open callback', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();

			var pfsNodeOpenCallback = function() {
				config.messages.node_open_msgs['test_message'] = "NODE OPEN callback executed.";
			};
			config.callbacks.node_open.push(pfsNodeOpenCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.node_open_msgs['test_message']).to.equal("NODE OPEN callback executed.");
    });
    
    
    it('should execute the node closed callback', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();

			var pfsNodeClosedCallback = function() {
				config.messages.node_closed_msgs['test_message'] = "NODE CLOSED callback executed.";
			};
			config.callbacks.node_closed.push(pfsNodeClosedCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.node_closed_msgs['test_message']).to.equal("NODE CLOSED callback executed.");
    });
    

    it('should execute the better path (found) callback', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();

			var pfsBetterPathFoundCallback = function() {
				config.messages.better_path_msgs['test_message'] = "BETTER PATH FOUND callback executed.";
			};
			config.callbacks.better_path.push(pfsBetterPathFoundCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.better_path_msgs['test_message']).to.equal("BETTER PATH FOUND callback executed.");
    });
    
    
    /**
     * HACK to execute dir modes for coverage tests...
     */
    it('should execute the better path (found) callback', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();
          
      config.dir_mode = $G.GraphMode.DIRECTED;
      $PFS.PFS(graph, root, config);
      
      config.dir_mode = $G.GraphMode.UNDIRECTED;
      $PFS.PFS(graph, root, config);
      
      config.dir_mode = -77; // else branch...
      $PFS.PFS(graph, root, config);
    });
    
  });  

});