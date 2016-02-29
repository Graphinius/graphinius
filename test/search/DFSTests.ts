/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/JSONInput';
import * as $DFS from '../../src/search/DFS';

chai.use(sinonChai);

var expect 	= chai.expect;
var Node 	  = $N.BaseNode;
var Edge 	  = $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var JSON_IN	= $I.JSONInput;
var search_graph = "./test/input/test_data/search_graph.json";


describe('Basic GRAPH SEARCH Tests - Depth first search -', () => {
	
	var jsonReader 					: $I.IJSONInput = new JSON_IN(),
	    graph					: $G.IGraph = jsonReader.readFromJSONFile(search_graph),
			stats					: $G.GraphStats = graph.getStats(),
			callbacks			: $DFS.DFS_Callbacks;
	
  
  describe('testing config preparation functions - ', () => {
    
    var prepForDFSVisitSpy,
        prepForDFSSpy,
        original = {
          prepareDFSStandardConfig: null,
          prepareDFSVisitStandardConfig: null
        };
    
    before(() => {
      prepForDFSSpy = sinon.spy($DFS.prepareDFSStandardConfig);
      prepForDFSVisitSpy = sinon.spy($DFS.prepareDFSVisitStandardConfig);
      original.prepareDFSStandardConfig = $DFS.prepareDFSStandardConfig;
      original.prepareDFSVisitStandardConfig = $DFS.prepareDFSVisitStandardConfig;
      $DFS.prepareDFSStandardConfig = prepForDFSSpy;
      $DFS.prepareDFSVisitStandardConfig = prepForDFSVisitSpy;
    });
        
    after(() => {
      $DFS.prepareDFSStandardConfig = original.prepareDFSStandardConfig;      
      $DFS.prepareDFSVisitStandardConfig = original.prepareDFSVisitStandardConfig;
    });
    
    
    it('preprareDFSVisitStandardConfig should correctly instantiate a DFSConfig object', () => {
      var config = $DFS.prepareDFSVisitStandardConfig();
      
      expect(prepForDFSVisitSpy).to.have.been.calledOnce;
      
      expect(config.dir_mode).not.to.be.undefined;
      expect(config.dir_mode).to.equal($G.GraphMode.MIXED);
      
      expect(config.visit_result).not.to.be.undefined;
      expect(config.visit_result).to.deep.equal({});
      
      expect(config.callbacks).not.to.be.undefined;
      var idv = config.callbacks.init_dfs_visit;
      expect(idv).not.to.be.undefined;      
      expect(idv).to.be.an("Array");
      for (var cb in idv) {
        expect(idv[cb]).to.be.a("Function");
      }
      var nu = config.callbacks.node_unmarked;
      expect(nu).not.to.be.undefined;      
      expect(nu).to.be.an("Array");
      for (var cb in nu) {
        expect(nu[cb]).to.be.a("Function");
      }
    });    
    
    
    it('calling preprareDFSStandardConfig should also call prepareDFSVisitStandardConfig', () => {
      var config = $DFS.prepareDFSStandardConfig();
      expect(prepForDFSSpy).to.have.been.calledOnce;
      expect(prepForDFSVisitSpy).to.have.been.calledOnce;
    });    
    
    
    it('preprareDFSStandardConfig should correctly instantiate a DFSConfig object', () => {
      var config = $DFS.prepareDFSStandardConfig();
      expect(config.dir_mode).not.to.be.undefined;
      expect(config.dir_mode).to.equal($G.GraphMode.MIXED);
      
      expect(config.visit_result).not.to.be.undefined;
      expect(config.visit_result).to.deep.equal({});
      
      expect(config.callbacks).not.to.be.undefined;
      var idf = config.callbacks.init_dfs;
      expect(idf).not.to.be.undefined;      
      expect(idf).to.be.an("Array");
      for (var cb in idf) {
        expect(idf[cb]).to.be.a("Function");
      }
    });
    
  });
  
	
	describe('testing callback execution', () => {
		
		it('should correctly instantiate the search graph', () => {
			expect(stats.nr_nodes).to.equal(7);
			expect(stats.nr_dir_edges).to.equal(7);
			expect(stats.nr_und_edges).to.equal(2);
		});
    
		/**
		 * HUGE TODO:
		 * Make sure the callbacks are not only executed, but
		 * executed at the right stage of the code
		 * Don't know how yet...
		 */
		describe('should properly execute the different callback stages', () => {
			
			/**
			 * TODO: outSource execCallbacks function to utility module
			 */
			it('should execute an array of callback functions', () => {
				var scope = {
					msg_a: "",
					msg_b: ""
				}
				var funcArray = [];
				funcArray.push( function( context ) {
					context["msg_a"] = "Hello from func A.";
				});
				funcArray.push( function( context ) {
					context["msg_b"] = "Hello from func B.";
				});
				$DFS.execCallbacks(funcArray, scope);
				expect(scope.msg_a).to.equal("Hello from func A.");
				expect(scope.msg_b).to.equal("Hello from func B.");				
			});
			
			
			it('should execute the DFS VISIT INIT callbacks', () => {
				var root = graph.getNodeById('A'),
						config : $DFS.DFS_Config = {
              visit_result: {},
              dfs_visit_marked: {},
              messages: {},
              callbacks: {
                init_dfs_visit : []
              },
              dir_mode: $G.GraphMode.MIXED
            };
				
				var dfsVisitInitTestCallback = function() {
					config.messages['test_message'] = "DFS VISIT INIT callback executed.";
				};
				config.callbacks.init_dfs_visit.push(dfsVisitInitTestCallback);
				var result = $DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).to.equal("DFS VISIT INIT callback executed.");
			});
			
			
			it('should execute the DFS VISIT NODE POPPED callbacks', () => {
				var root = graph.getNodeById('A'),
						config : $DFS.DFS_Config = {
              visit_result: {},
              dfs_visit_marked: {},
              messages: {},
              callbacks: {
                node_popped : []
              },
              dir_mode: $G.GraphMode.MIXED
            };
        
				var dfsVisitNodePoppedTestCallback = function() {
					config.messages['test_message'] = "DFS VISIT NODE POPPED callback executed.";
				};
				config.callbacks.node_popped.push(dfsVisitNodePoppedTestCallback);
				var result = $DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).to.equal("DFS VISIT NODE POPPED callback executed.");
			});
			
			
			it('should execute the DFS VISIT NODE MARKED callbacks', () => {
				var root = graph.getNodeById('A'),
						config : $DFS.DFS_Config = {
              visit_result: {},
              dfs_visit_marked: {},
              messages: {},
              callbacks: {
                node_marked : []
              },
              dir_mode: $G.GraphMode.MIXED
            };
        
				var dfsVisitNodeMarkedTestCallback = function() {
					config.messages['test_message'] = "DFS VISIT NODE MARKED callback executed.";
				};
				config.callbacks.node_marked.push(dfsVisitNodeMarkedTestCallback);
				var result = $DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).to.equal("DFS VISIT NODE MARKED callback executed.");
			});
			
			
			it('should execute the DFS VISIT NODE UNMARKED callbacks', () => {
				var root = graph.getNodeById('A'),
						config : $DFS.DFS_Config = {
              visit_result: {},
              dfs_visit_marked: {},
              messages: {},
              callbacks: {
                node_unmarked : []
              },
              dir_mode: $G.GraphMode.MIXED
            };
            
				var dfsVisitNodeUnMarkedTestCallback = function() {
					config.messages['test_message'] = "DFS VISIT NODE UNMARKED callback executed.";
				};
				config.callbacks.node_unmarked.push(dfsVisitNodeUnMarkedTestCallback);
				var result = $DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).to.equal("DFS VISIT NODE UNMARKED callback executed.");
			});
			
			
			it('should execute the DFS VISIT ADJ NODES PUSHED callbacks', () => {
				var root = graph.getNodeById('A'),
						config : $DFS.DFS_Config = {
              visit_result: {},
              dfs_visit_marked: {},
              messages: {},
              callbacks: {
                adj_nodes_pushed : []
              },
              dir_mode: $G.GraphMode.MIXED
            };
				
				var dfsVisitAdjNodesPushedTestCallback = function() {
					config.messages['test_message'] = "DFS VISIT ADJ NODES PUSHED callback executed.";
				};
				config.callbacks.adj_nodes_pushed.push(dfsVisitAdjNodesPushedTestCallback);
				var result = $DFS.DFSVisit(graph, root, config);
				expect(config.messages['test_message']).to.equal("DFS VISIT ADJ NODES PUSHED callback executed.");
			});
			
			
			it('should execute the DFS INIT callbacks', () => {
        var root = graph.getNodeById('A'),
						config : $DFS.DFS_Config = {
              visit_result: {},
              dfs_visit_marked: {},
              messages: {},
              callbacks: {
                init_dfs : []
              },
              dir_mode: $G.GraphMode.MIXED
            };
            
				var dfsInitTestCallback = function() {
					config.messages['test_message'] = "DFS INIT callback executed.";
				};
				config.callbacks.init_dfs.push(dfsInitTestCallback);
        
				var result = $DFS.DFS(graph, root, config);
				expect(config.messages['test_message']).to.equal("DFS INIT callback executed.");
			});
			
		});
		
	});
  
	
	describe('testing DFS visit - empty graph and invalid dir_mode - ', () => {
		
		it('DFSVisit should throw an error upon trying to traverse an empty graph (INIT)', () => {
			var root = graph.getNodeById('A'),
          empty_graph = new $G.BaseGraph("iamemptygraph");
          		
			expect($DFS.DFSVisit.bind($DFS.DFSVisit, empty_graph, root)).to.throw('Cowardly refusing to traverse graph without edges.');
		});
    
    
    it('DFSVisit should throw an error upon trying to traverse a graph with dir_mode set to INIT', () => {
			var root = graph.getNodeById('A'),
          config : $DFS.DFS_Config = {
            visit_result: {},
            dfs_visit_marked: {},
            callbacks: {},
            dir_mode: $G.GraphMode.INIT
          }
          		
			expect($DFS.DFSVisit.bind($DFS.DFSVisit, graph, root, config)).to.throw('Cannot traverse a graph with dir_mode set to INIT.');
		});
    
    
    it('DFS should throw an error upon trying to traverse a blank graph (INIT)', () => {
      var root = graph.getNodeById('A'),
          empty_graph = new $G.BaseGraph("iamemptygraph");
          
			expect($DFS.DFS.bind($DFS.DFS, empty_graph)).to.throw('Cowardly refusing to traverse graph without edges.');
		});
    
    
    it('DFS should throw an error upon trying to traverse a graph with dir_mode set to INIT', () => {
			var root = graph.getNodeById('A'),
          config : $DFS.DFS_Config = {
            visit_result: {},
            dfs_visit_marked: {},
            callbacks: {},
            dir_mode: $G.GraphMode.INIT
          }
          		
			expect($DFS.DFS.bind($DFS.DFS, graph, root, config)).to.throw('Cannot traverse a graph with dir_mode set to INIT.');
		});    
		
	});
	
	
	describe('testing DFS visit on small search graph, DIRECTED MODE', () => {
		
		it('should correctly compute lookup distance from node A', () => {
			var root = graph.getNodeById('A'),
          config = $DFS.prepareDFSVisitStandardConfig();          
      config.dir_mode = $G.GraphMode.DIRECTED;
			var result = $DFS.DFSVisit(graph, root, config);
						
			expect(Object.keys(result).length).to.equal(4);
			
			expect(result['D']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['G']).to.be.undefined;
			
			expect(result['A'].counter).to.equal(0);
			expect(result['B'].counter).to.equal(3);
			expect(result['C'].counter).to.equal(2);
			expect(result['F'].counter).to.equal(1);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['B'].parent).to.equal(root);
			expect(result['C'].parent).to.equal(root);
			expect(result['F'].parent).to.equal(root);
		});
		
		
		it('should correctly compute lookup distance from node D', () => {
			var root = graph.getNodeById('D'),
          config = $DFS.prepareDFSVisitStandardConfig();          
      config.dir_mode = $G.GraphMode.DIRECTED;
			var result = $DFS.DFSVisit(graph, root, config);
						
			expect(Object.keys(result).length).to.equal(3);
			
			expect(result['A']).to.be.undefined;
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['G']).to.be.undefined;
			
			expect(result['D'].counter).to.equal(0);
			expect(result['E'].counter).to.equal(1);
			expect(result['F'].counter).to.equal(2);
			
			expect(result['D'].parent).to.equal(root);
			expect(result['E'].parent).to.equal(root);
			expect(result['F'].parent).to.equal(graph.getNodeById('E'));
		});
		
		
		it('should correctly compute lookup distance from node G', () => {
			var root = graph.getNodeById('G'),
          config = $DFS.prepareDFSVisitStandardConfig();          
      config.dir_mode = $G.GraphMode.DIRECTED;
			var result = $DFS.DFSVisit(graph, root, config);
						
			expect(Object.keys(result).length).to.equal(1);
			
			expect(result['A']).to.be.undefined;
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['D']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['F']).to.be.undefined;
			
			expect(result['G'].counter).to.equal(0);			
			expect(result['G'].parent).to.equal(root);
		});
		
	});
	
	
	describe('testing DFS visit on small search graph, UNDIRECTED MODE', () => {
				
		it('should correctly compute lookup distance from node A', () => {
			var root = graph.getNodeById('A'),
          config = $DFS.prepareDFSVisitStandardConfig();          
      config.dir_mode = $G.GraphMode.UNDIRECTED;
			var result = $DFS.DFSVisit(graph, root, config);
						
			expect(Object.keys(result).length).to.equal(2);
			
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['F']).to.be.undefined;
			expect(result['G']).to.be.undefined;
			
			expect(result['A'].counter).to.equal(0);
			expect(result['D'].counter).to.equal(1);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['D'].parent).to.equal(root);
		});
		
		
		it('should correctly compute lookup distance from node D', () => {
			var root = graph.getNodeById('D'),
          config = $DFS.prepareDFSVisitStandardConfig();          
      config.dir_mode = $G.GraphMode.UNDIRECTED;
			var result = $DFS.DFSVisit(graph, root, config);
						
			expect(Object.keys(result).length).to.equal(2);
			
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['F']).to.be.undefined;
			expect(result['G']).to.be.undefined;
			
			expect(result['A'].counter).to.equal(1);
			expect(result['D'].counter).to.equal(0);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['D'].parent).to.equal(root);
		});
		
		/**
     * Because of our graph, this currently yields the same
     * result as our test case in DIRECTED mode...
     */
		it('should correctly compute lookup distance from node G', () => {
			var root = graph.getNodeById('G'),
          config = $DFS.prepareDFSVisitStandardConfig();          
      config.dir_mode = $G.GraphMode.UNDIRECTED;
			var result = $DFS.DFSVisit(graph, root, config);
						
			expect(Object.keys(result).length).to.equal(1);
			
			expect(result['A']).to.be.undefined;
			expect(result['B']).to.be.undefined;
			expect(result['C']).to.be.undefined;
			expect(result['D']).to.be.undefined;
			expect(result['E']).to.be.undefined;
			expect(result['F']).to.be.undefined;
			
			expect(result['G'].counter).to.equal(0);
			
			expect(result['G'].parent).to.equal(root);
		});
  });
	
	
	describe('testing DFS visit on small search graph, MIXED MODE', () => {
				
		it('should correctly compute lookup distance from node A', () => {
			var root = graph.getNodeById('A'),
			    result = $DFS.DFSVisit(graph, root);
						
			expect(Object.keys(result).length).to.equal(6);
			
			// undirected before directed...
			// shall we sort those nodes by id first??
			expect(result['A'].counter).to.equal(0);
			expect(result['B'].counter).to.equal(5);
			expect(result['C'].counter).to.equal(4);
			expect(result['D'].counter).to.equal(1);
			expect(result['E'].counter).to.equal(2);
			expect(result['F'].counter).to.equal(3);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['B'].parent).to.equal(root);
			expect(result['C'].parent).to.equal(root);
			expect(result['D'].parent).to.equal(root);
			expect(result['E'].parent).to.equal(graph.getNodeById('D'));
			expect(result['F'].parent).to.equal(graph.getNodeById('E'));
		});
		
		
		it('should correctly compute lookup distance from node D', () => {
			var root = graph.getNodeById('D'),
			    result = $DFS.DFSVisit(graph, root);						
						
			expect(Object.keys(result).length).to.equal(6);
			
			expect(result['A'].counter).to.equal(1);
			expect(result['B'].counter).to.equal(4);
			expect(result['C'].counter).to.equal(3);
			expect(result['D'].counter).to.equal(0);
			expect(result['E'].counter).to.equal(5);
			expect(result['F'].counter).to.equal(2);
			
			expect(result['A'].parent).to.equal(root);
			expect(result['B'].parent).to.equal(graph.getNodeById('A'));
			expect(result['C'].parent).to.equal(graph.getNodeById('A'));
			expect(result['D'].parent).to.equal(root);
			expect(result['E'].parent).to.equal(root);
			expect(result['F'].parent).to.equal(graph.getNodeById('A'));
		});
		
		
		it('should correctly compute lookup distance from node E', () => {
			var root = graph.getNodeById('E'),
			    result = $DFS.DFSVisit(graph, root);	
						
			expect(Object.keys(result).length).to.equal(2);			
			expect(result['E'].counter).to.equal(0);
			expect(result['F'].counter).to.equal(1);
			
			expect(result['E'].parent).to.equal(root);
			expect(result['F'].parent).to.equal(root);
		});
		
		
		it('should correctly compute lookup distance from node G', () => {
			var root = graph.getNodeById('G'),
          config = $DFS.prepareDFSVisitStandardConfig(),
			    result = $DFS.DFSVisit(graph, root, config);	
			
			expect(Object.keys(result).length).to.equal(1);			
			expect(result['G'].counter).to.equal(0);			
			expect(result['G'].parent).to.equal(root);
		});
    
  });
  
	
	describe('testing DFS on small search graph (including unconnected component)', () => {		
		
		/**
		 * $G.GraphMode enum holds 0-init (no edges), 
     * 1-directed, 2-undirected, 3-mixed
     * 
     * TODO - WRITE TESTS FOR SPECIFIC VERTICES AND THEN
     * CHECK RESULTS ACCORDINGLY...
		 */		
		[1, 2, 3].forEach((i) => {
			
			it('should not leave any nodes with a counter of -1 (unvisited)', () => {	
				var root = graph.getNodeById('A'),
            config = $DFS.prepareDFSStandardConfig();
          
        config.dir_mode = i;
        var dfs_result = $DFS.DFS(graph, root, config);
        
        var nr_nodes_visited = 0;
        for (var seg_idx in dfs_result) {
          nr_nodes_visited += Object.keys(dfs_result[seg_idx]).length;
        }				
				expect(nr_nodes_visited).to.equal(7);
			});
			
			
			it('should not leave any nodes without a parent (even if self)', () => {
				var root = graph.getNodeById('A'),
            config = $DFS.prepareDFSStandardConfig();
          
        config.dir_mode = i;
        var dfs_result = $DFS.DFS(graph, root, config);
        
        for (var seg_idx in dfs_result) {
          for (var node_key in dfs_result[seg_idx]) {
            var node = dfs_result[seg_idx][node_key];
            expect(node.parent).not.to.be.null;
          }
        }
			});
      
    });    
    
    describe('lookup DFS distance calculations - DIRECTED Mode - ', () => {
          
      it('should correctly compute lookup distance from node A', () => {
        var root = graph.getNodeById('A'),
            config = $DFS.prepareDFSStandardConfig();
            
        config.dir_mode = $G.GraphMode.DIRECTED;
        var dfs_result = $DFS.DFS(graph, root, config);		
        
        expect(dfs_result.length).to.equal(3);				
        
        var seg_0 = dfs_result[0];
        expect(Object.keys(seg_0).length).to.equal(4);        
        expect(seg_0['A'].counter).to.equal(0);
        expect(seg_0['F'].counter).to.equal(1);
        expect(seg_0['C'].counter).to.equal(2);
        expect(seg_0['B'].counter).to.equal(3);
        expect(seg_0['A'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_0['F'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_0['C'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_0['B'].parent).to.equal(graph.getNodeById('A'));
        
        var seg_1 = dfs_result[1];
        expect(Object.keys(seg_1).length).to.equal(2);        
        expect(seg_1['D'].counter).to.equal(4);
        expect(seg_1['E'].counter).to.equal(5);
        expect(seg_1['D'].parent).to.equal(graph.getNodeById('D'));
        expect(seg_1['E'].parent).to.equal(graph.getNodeById('D'));
        
        var seg_2 = dfs_result[2];
        expect(Object.keys(seg_2).length).to.equal(1);        
        expect(seg_2['G'].counter).to.equal(6);
        expect(seg_2['G'].parent).to.equal(graph.getNodeById('G'));
        
      });
          
    
      it('should correctly compute lookup distance from node D', () => {
        var root = graph.getNodeById('D'),
            config = $DFS.prepareDFSStandardConfig();
            
        config.dir_mode = $G.GraphMode.DIRECTED;
        var dfs_result = $DFS.DFS(graph, root, config);
        
        expect(dfs_result.length).to.equal(3);	
        
        var seg_0 = dfs_result[0];
        expect(Object.keys(seg_0).length).to.equal(3);        
        expect(seg_0['D'].counter).to.equal(0);
        expect(seg_0['E'].counter).to.equal(1);
        expect(seg_0['F'].counter).to.equal(2);
        expect(seg_0['D'].parent).to.equal(graph.getNodeById('D'));
        expect(seg_0['E'].parent).to.equal(graph.getNodeById('D'));
        expect(seg_0['F'].parent).to.equal(graph.getNodeById('E'));
        
        var seg_1 = dfs_result[1];
        expect(Object.keys(seg_1).length).to.equal(3);        
        expect(seg_1['A'].counter).to.equal(3);      
        expect(seg_1['C'].counter).to.equal(4);
        expect(seg_1['B'].counter).to.equal(5);
        expect(seg_1['A'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_1['C'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_1['B'].parent).to.equal(graph.getNodeById('A'));
        
        var seg_2 = dfs_result[2];
        expect(Object.keys(seg_2).length).to.equal(1);        
        expect(seg_2['G'].counter).to.equal(6);
        expect(seg_2['G'].parent).to.equal(graph.getNodeById('G'));
        
      });
    
    });
    
    
    describe('lookup DFS distance calculations - UNDIRECTED Mode - ', () => {
          
      it('should correctly compute lookup distance from node A', () => {
        var root = graph.getNodeById('A'),
            config = $DFS.prepareDFSStandardConfig();
            
        config.dir_mode = $G.GraphMode.UNDIRECTED;
        var dfs_result = $DFS.DFS(graph, root, config);
        
        expect(dfs_result.length).to.equal(6);					
        
        var seg_0 = dfs_result[0];
        expect(Object.keys(seg_0).length).to.equal(2);        
        expect(seg_0['A'].counter).to.equal(0);
        expect(seg_0['D'].counter).to.equal(1);
        expect(seg_0['A'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_0['D'].parent).to.equal(graph.getNodeById('A'));
        
        var seg_1 = dfs_result[1];
        expect(Object.keys(seg_1).length).to.equal(1);        
        expect(seg_1['B'].counter).to.equal(2);
        expect(seg_1['B'].parent).to.equal(graph.getNodeById('B'));
        
        var seg_2 = dfs_result[2];
        expect(Object.keys(seg_2).length).to.equal(1);        
        expect(seg_2['C'].counter).to.equal(3);
        expect(seg_2['C'].parent).to.equal(graph.getNodeById('C'));
        
        var seg_3 = dfs_result[3];
        expect(Object.keys(seg_3).length).to.equal(1);        
        expect(seg_3['F'].counter).to.equal(4);
        expect(seg_3['F'].parent).to.equal(graph.getNodeById('F'));
        
        var seg_4 = dfs_result[4];
        expect(Object.keys(seg_4).length).to.equal(1);        
        expect(seg_4['E'].counter).to.equal(5);
        expect(seg_4['E'].parent).to.equal(graph.getNodeById('E'));
        
        var seg_5 = dfs_result[5];
        expect(Object.keys(seg_5).length).to.equal(1);        
        expect(seg_5['G'].counter).to.equal(6);
        expect(seg_5['G'].parent).to.equal(graph.getNodeById('G'));
        
      });
    
    });
    
    
    describe('lookup DFS distance calculations - MIXED Mode - ', () => {
          
      it('should correctly compute lookup distance from node D', () => {
        var root = graph.getNodeById('D'),
            dfs_result = $DFS.DFS(graph, root);
        
        expect(dfs_result.length).to.equal(2);
        
        var seg_0 = dfs_result[0];
        expect(Object.keys(seg_0).length).to.equal(6);        
        expect(seg_0['D'].counter).to.equal(0);
        expect(seg_0['A'].counter).to.equal(1);     
        expect(seg_0['F'].counter).to.equal(2);
        expect(seg_0['C'].counter).to.equal(3);     
        expect(seg_0['B'].counter).to.equal(4);  
        expect(seg_0['E'].counter).to.equal(5);
        expect(seg_0['D'].parent).to.equal(graph.getNodeById('D'));
        expect(seg_0['A'].parent).to.equal(graph.getNodeById('D'));
        expect(seg_0['F'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_0['C'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_0['B'].parent).to.equal(graph.getNodeById('A'));
        expect(seg_0['E'].parent).to.equal(graph.getNodeById('D'));
        
        var seg_1 = dfs_result[1];
        expect(Object.keys(seg_1).length).to.equal(1);        
        expect(seg_1['G'].counter).to.equal(6);
        expect(seg_1['G'].parent).to.equal(graph.getNodeById('G'));       
        
      });
    
    });    
    
	});
  
  
  describe('lookup DFS distance calculations - WEIGHTED EDGES - Mixed Mode - ', () => {
          
    it('should correctly compute lookup distance from node D', () => {      
      jsonReader._weighted_mode = true;
      var graph = jsonReader.readFromJSONFile(search_graph),
          root = graph.getNodeById('D'),
          config = $DFS.prepareDFSStandardConfig();
          
      console.dir(graph.getUndEdges());
      console.dir(graph.getDirEdges());
      
      var dfs_result = $DFS.DFS(graph, root);
      
      expect(dfs_result.length).to.equal(2);
      
      var seg_0 = dfs_result[0];
      expect(Object.keys(seg_0).length).to.equal(6);        
      expect(seg_0['D'].counter).to.equal(0);
      expect(seg_0['A'].counter).to.equal(1);     
      expect(seg_0['F'].counter).to.equal(2);
      expect(seg_0['C'].counter).to.equal(3);     
      expect(seg_0['B'].counter).to.equal(4);  
      expect(seg_0['E'].counter).to.equal(5);
      expect(seg_0['D'].parent).to.equal(graph.getNodeById('D'));
      expect(seg_0['A'].parent).to.equal(graph.getNodeById('D'));
      expect(seg_0['F'].parent).to.equal(graph.getNodeById('A'));
      expect(seg_0['C'].parent).to.equal(graph.getNodeById('A'));
      expect(seg_0['B'].parent).to.equal(graph.getNodeById('A'));
      expect(seg_0['E'].parent).to.equal(graph.getNodeById('D'));
      
      var seg_1 = dfs_result[1];
      expect(Object.keys(seg_1).length).to.equal(1);        
      expect(seg_1['G'].counter).to.equal(6);
      expect(seg_1['G'].parent).to.equal(graph.getNodeById('G'));       
      
    });
  
  });    
  
});
		
