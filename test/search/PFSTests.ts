/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $PFS from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';


var expect = chai.expect,
    json   : $I.IJSONInput = new $I.JSONInput(true, false, true),
    search_graph = "./test/test_data/search_graph_pfs_extended.json",
    graph : $G.IGraph = json.readFromJSONFile(search_graph);


describe('PFS TESTS - ', () => {

  beforeEach(() => {
    expect(graph).not.to.be.undefined;
    expect(graph.nrNodes()).to.equal(6);
    expect(graph.nrUndEdges()).to.equal(2);
    expect(graph.nrDirEdges()).to.equal(12);
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
            goal_node : null,
            evalPriority : function(ne: $N.NeighborEntry) { return ne.best; },
            evalObjID : function(ne: $N.NeighborEntry) { return ne.node.getID(); }
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
    
    it('should execute the initPFS callbacks', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();

			var pfsInitTestCallback = function() {
				config.messages.init_pfs_msgs['test_message'] = "BFS INIT callback executed.";
			};
			config.callbacks.init_pfs.push(pfsInitTestCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.init_pfs_msgs['test_message']).to.equal("BFS INIT callback executed.");
    });
    
    
    it('should execute the goal reached callbacks', () => {
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


    it('should execute the not encountered callbacks', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      var pfsnotEncCallback = function() {
        config.messages.not_enc_msgs['test_message'] = "NOT ENCOUNTERED callback executed.";
      };
      config.callbacks.not_encountered.push(pfsnotEncCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.not_enc_msgs['test_message']).to.equal("NOT ENCOUNTERED callback executed.");
    });
    
    
    it('should execute the node open callbacks', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();

			var pfsNodeOpenCallback = function() {
				config.messages.node_open_msgs['test_message'] = "NODE OPEN callback executed.";
			};
			config.callbacks.node_open.push(pfsNodeOpenCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.node_open_msgs['test_message']).to.equal("NODE OPEN callback executed.");
    });
    
    
    it('should execute the node closed callbacks', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();

			var pfsNodeClosedCallback = function() {
				config.messages.node_closed_msgs['test_message'] = "NODE CLOSED callback executed.";
			};
			config.callbacks.node_closed.push(pfsNodeClosedCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.node_closed_msgs['test_message']).to.equal("NODE CLOSED callback executed.");
    });
    

    it('should execute the better path (found) callbacks', () => {
      var root = graph.getNodeById('A'),
					config = $PFS.preparePFSStandardConfig();

			var pfsBetterPathFoundCallback = function() {
				config.messages.better_path_msgs['test_message'] = "BETTER PATH FOUND callback executed.";
			};
			config.callbacks.better_path.push(pfsBetterPathFoundCallback);
			var result = $PFS.PFS(graph, root, config);
			expect(config.messages.better_path_msgs['test_message']).to.equal("BETTER PATH FOUND callback executed.");
    });


    it('should only accept UN/DIRECTED or MIXED Mode as traversal modes', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();
      config.dir_mode = -77;
      expect($PFS.PFS.bind($PFS.PFS, graph, root, config)).to.throw('Unsupported traversal mode. Please use directed, undirected, or mixed');
    });
    
  });
  
  
  describe('Best-first search Scenarios in Search Graph PFS - ', () => {
    
    describe('DIRECTED mode search', () => {

      var config = $PFS.preparePFSStandardConfig();
      config.dir_mode = $G.GraphMode.DIRECTED;

      it('Should correctly compute best paths from Node A', () => {
        var root = graph.getNodeById('A'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(graph.getNodeById('A'));
        expect(result['A'].distance).to.equal(0);
        expect(result['B'].parent).to.equal(graph.getNodeById('A'));
        expect(result['B'].distance).to.equal(3);
        expect(result['C'].parent).to.equal(graph.getNodeById('A'));
        expect(result['C'].distance).to.equal(4);
        expect(result['D'].parent).to.equal(graph.getNodeById('A'));
        expect(result['D'].distance).to.equal(1);
        expect(result['E'].parent).to.equal(graph.getNodeById('C'));
        expect(result['E'].distance).to.equal(5);
        expect(result['F'].parent).to.equal(graph.getNodeById('B'));
        expect(result['F'].distance).to.equal(4);
      });

      
      it('Should correctly compute best paths from Node B', () => {
        var root = graph.getNodeById('B'),
            result = $PFS.PFS(graph, root, config);
        
        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(graph.getNodeById('C'));
        expect(result['A'].distance).to.equal(3);
        expect(result['B'].parent).to.equal(graph.getNodeById('B'));
        expect(result['B'].distance).to.equal(0);
        expect(result['C'].parent).to.equal(graph.getNodeById('B'));
        expect(result['C'].distance).to.equal(2);
        expect(result['D'].parent).to.equal(graph.getNodeById('A'));
        expect(result['D'].distance).to.equal(4);
        expect(result['E'].parent).to.equal(graph.getNodeById('C'));
        expect(result['E'].distance).to.equal(3);
        expect(result['F'].parent).to.equal(graph.getNodeById('B'));
        expect(result['F'].distance).to.equal(1);
      });


      it('Should correctly compute best paths from Node D', () => {
        var root = graph.getNodeById('D'),
            result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(graph.getNodeById('C'));
        expect(result['A'].distance).to.equal(7);
        expect(result['B'].parent).to.equal(graph.getNodeById('A'));
        expect(result['B'].distance).to.equal(10);
        expect(result['C'].parent).to.equal(graph.getNodeById('D'));
        expect(result['C'].distance).to.equal(6);
        expect(result['D'].parent).to.equal(graph.getNodeById('D'));
        expect(result['D'].distance).to.equal(0);
        expect(result['E'].parent).to.equal(graph.getNodeById('C'));
        expect(result['E'].distance).to.equal(7);
        expect(result['F'].parent).to.equal(graph.getNodeById('B'));
        expect(result['F'].distance).to.equal(11);
      });


      it('Should correctly compute best paths from Node F', () => {
        var root = graph.getNodeById('F'),
            result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(graph.getNodeById('C'));
        expect(result['A'].distance).to.equal(4);
        expect(result['B'].parent).to.equal(graph.getNodeById('A'));
        expect(result['B'].distance).to.equal(7);
        expect(result['C'].parent).to.equal(graph.getNodeById('F'));
        expect(result['C'].distance).to.equal(3);
        expect(result['D'].parent).to.equal(graph.getNodeById('A'));
        expect(result['D'].distance).to.equal(5);
        expect(result['E'].parent).to.equal(graph.getNodeById('C'));
        expect(result['E'].distance).to.equal(4);
        expect(result['F'].parent).to.equal(graph.getNodeById('F'));
        expect(result['F'].distance).to.equal(0);
      });
      
    });


    describe('UNDIRECTED mode search', () => {

      var config = $PFS.preparePFSStandardConfig();
      config.dir_mode = $G.GraphMode.UNDIRECTED;

      it('Should correctly compute best paths from Node B', () => {
        var root = graph.getNodeById('B'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(null);
        expect(result['A'].distance).to.equal(Number.POSITIVE_INFINITY);
        expect(result['B'].parent).to.equal(graph.getNodeById('B'));
        expect(result['B'].distance).to.equal(0);
        expect(result['C'].parent).to.equal(null);
        expect(result['C'].distance).to.equal(Number.POSITIVE_INFINITY);
        expect(result['D'].parent).to.equal(graph.getNodeById('E'));
        expect(result['D'].distance).to.equal(5);
        expect(result['E'].parent).to.equal(graph.getNodeById('B'));
        expect(result['E'].distance).to.equal(5);
        expect(result['F'].parent).to.equal(null);
        expect(result['F'].distance).to.equal(Number.POSITIVE_INFINITY);
      });


      it('Should correctly compute best paths from Node E', () => {
        var root = graph.getNodeById('E'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(null);
        expect(result['A'].distance).to.equal(Number.POSITIVE_INFINITY);
        expect(result['B'].parent).to.equal(graph.getNodeById('E'));
        expect(result['B'].distance).to.equal(5);
        expect(result['C'].parent).to.equal(null);
        expect(result['C'].distance).to.equal(Number.POSITIVE_INFINITY);
        expect(result['D'].parent).to.equal(graph.getNodeById('E'));
        expect(result['D'].distance).to.equal(0);
        expect(result['E'].parent).to.equal(graph.getNodeById('E'));
        expect(result['E'].distance).to.equal(0);
        expect(result['F'].parent).to.equal(null);
        expect(result['F'].distance).to.equal(Number.POSITIVE_INFINITY);
      });


      it('Should correctly compute best paths from Node D', () => {
        var root = graph.getNodeById('D'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(null);
        expect(result['A'].distance).to.equal(Number.POSITIVE_INFINITY);
        expect(result['B'].parent).to.equal(graph.getNodeById('E'));
        expect(result['B'].distance).to.equal(5);
        expect(result['C'].parent).to.equal(null);
        expect(result['C'].distance).to.equal(Number.POSITIVE_INFINITY);
        expect(result['D'].parent).to.equal(graph.getNodeById('D'));
        expect(result['D'].distance).to.equal(0);
        expect(result['E'].parent).to.equal(graph.getNodeById('D'));
        expect(result['E'].distance).to.equal(0);
        expect(result['F'].parent).to.equal(null);
        expect(result['F'].distance).to.equal(Number.POSITIVE_INFINITY);
      });

    });


    describe('MIXED mode search', () => {

      it('Should correctly compute best paths from Node A', () => {
        var root = graph.getNodeById('A'),
          result = $PFS.PFS(graph, root);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(graph.getNodeById('A'));
        expect(result['A'].distance).to.equal(0);
        expect(result['B'].parent).to.equal(graph.getNodeById('A'));
        expect(result['B'].distance).to.equal(3);
        expect(result['C'].parent).to.equal(graph.getNodeById('A'));
        expect(result['C'].distance).to.equal(4);
        expect(result['D'].parent).to.equal(graph.getNodeById('A'));
        expect(result['D'].distance).to.equal(1);
        expect(result['E'].parent).to.equal(graph.getNodeById('D'));
        expect(result['E'].distance).to.equal(1);
        expect(result['F'].parent).to.equal(graph.getNodeById('B'));
        expect(result['F'].distance).to.equal(4);
      });


      it('Should correctly compute best paths from Node B', () => {
        var root = graph.getNodeById('B'),
          result = $PFS.PFS(graph, root);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(graph.getNodeById('C'));
        expect(result['A'].distance).to.equal(3);
        expect(result['B'].parent).to.equal(graph.getNodeById('B'));
        expect(result['B'].distance).to.equal(0);
        expect(result['C'].parent).to.equal(graph.getNodeById('B'));
        expect(result['C'].distance).to.equal(2);
        expect(result['D'].parent).to.equal(graph.getNodeById('E'));
        expect(result['D'].distance).to.equal(3);
        expect(result['E'].parent).to.equal(graph.getNodeById('C'));
        expect(result['E'].distance).to.equal(3);
        expect(result['F'].parent).to.equal(graph.getNodeById('B'));
        expect(result['F'].distance).to.equal(1);
      });


      it('Should correctly compute best paths from Node D', () => {
        var root = graph.getNodeById('D'),
          result = $PFS.PFS(graph, root);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(graph.getNodeById('C'));
        expect(result['A'].distance).to.equal(7);
        expect(result['B'].parent).to.equal(graph.getNodeById('E'));
        expect(result['B'].distance).to.equal(5);
        expect(result['C'].parent).to.equal(graph.getNodeById('D'));
        expect(result['C'].distance).to.equal(6);
        expect(result['D'].parent).to.equal(graph.getNodeById('D'));
        expect(result['D'].distance).to.equal(0);
        expect(result['E'].parent).to.equal(graph.getNodeById('D'));
        expect(result['E'].distance).to.equal(0);
        expect(result['F'].parent).to.equal(graph.getNodeById('B'));
        expect(result['F'].distance).to.equal(6);
      });


      it('Should correctly compute best paths from Node E', () => {
        var root = graph.getNodeById('E'),
          result = $PFS.PFS(graph, root);

        expect(Object.keys(result).length).to.equal(6);

        expect(result['A'].parent).to.equal(graph.getNodeById('C'));
        expect(result['A'].distance).to.equal(7);
        expect(result['B'].parent).to.equal(graph.getNodeById('E'));
        expect(result['B'].distance).to.equal(5);
        expect(result['C'].parent).to.equal(graph.getNodeById('D'));
        expect(result['C'].distance).to.equal(6);
        expect(result['D'].parent).to.equal(graph.getNodeById('E'));
        expect(result['D'].distance).to.equal(0);
        expect(result['E'].parent).to.equal(graph.getNodeById('E'));
        expect(result['E'].distance).to.equal(0);
        expect(result['F'].parent).to.equal(graph.getNodeById('B'));
        expect(result['F'].distance).to.equal(6);
      });

    });
    
  });
  
});


describe('PFS TESTS on REAL sized graph - ', () => {
  
  var real_graph = "./test/test_data/real_graph.json",
      graph = json.readFromJSONFile(real_graph),
      NR_NODES = 6204,
      NR_UND_EDGES = 18550;
      

  beforeEach(() => {
    expect(graph).not.to.be.undefined;
    expect(graph.nrNodes()).to.equal(NR_NODES);
    expect(graph.nrUndEdges()).to.equal(NR_UND_EDGES);
  });
      
  
  it('should perform standard PFS without config initialization on real graph', () => {
    var root = graph.getRandomNode(),
        result = $PFS.PFS(graph, root);
        
    expect(Object.keys(result).length).to.equal(NR_NODES);
  });

});