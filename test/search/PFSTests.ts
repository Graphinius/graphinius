import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/io/input/JSONInput';
import * as $PFS from '../../src/search/PFS';
import * as $BH from '../../src/datastructs/binaryHeap';


var expect = chai.expect,
  json: $I.IJSONInput = new $I.JSONInput(true, false, true),
  search_graph = "./test/test_data/search_graph_pfs_extended.json",
  equal_dists = "./test/test_data/equal_path_graph.json",
  graph: $G.IGraph,
  graph_equal_dist: $G.IGraph;


describe('PFS TESTS - ', () => {

  beforeEach(() => {
    graph = json.readFromJSONFile(search_graph);
    expect(graph).toBeDefined();
    expect(graph.nrNodes()).toBe(6);
    expect(graph.nrUndEdges()).toBe(2);
    expect(graph.nrDirEdges()).toBe(12);
  });


  describe('Basic Instantiation tests - ', () => {

    test('should refuse to traverse a graph without edges', () => {
      var empty_graph = new $G.BaseGraph('mesebeenempty'),
        start = new $N.BaseNode("IAmNotInGraph");

      expect($PFS.PFS.bind($PFS.PFS, empty_graph, start)).toThrowError('Cowardly refusing to traverse graph without edges.');
    });


    /**
     * This use case is dependent on the existence of a valid config object..
     * Is there any way to specify this in mocha and skip it in case the
     * prerequisites are not met ??
     */
    test('should refuse to traverse a graph with DIR mode set to init', () => {
      var root = graph.getNodeById('A'),
        config: $PFS.PFS_Config = {
          result: {},
          callbacks: {},
          dir_mode: $G.GraphMode.INIT,
          goal_node: null,
          evalPriority: function (ne: $N.NeighborEntry) { return ne.best; },
          evalObjID: function (ne: $N.NeighborEntry) { return ne.node.getID(); }
        };

      expect($PFS.PFS.bind($PFS.PFS, graph, root, config)).toThrowError('Cannot traverse a graph with dir_mode set to INIT.');
    });

  });


  describe('Config object instantiation tests - ', () => {

    test(
      'should instantiate a default config object with correct result structure',
      () => {
        var config = $PFS.preparePFSStandardConfig();
        expect(config).toBeDefined();
        expect(config.result).toBeDefined();
      }
    );


    test(
      'should instantiate a default config object with correct DIR mode',
      () => {
        var config = $PFS.preparePFSStandardConfig();
        expect(config).toBeDefined();
        expect(config.dir_mode).toBeDefined();
        expect(config.dir_mode).toBe($G.GraphMode.MIXED);
      }
    );


    test('should instantiate a default config object with callback object', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config).toBeDefined();
      expect(config.callbacks).toBeDefined();
      expect(config.callbacks).toBeInstanceOf(Object);
    });


    test(
      'should instantiate a default config object with correctly structured callback object',
      () => {
        var config = $PFS.preparePFSStandardConfig();
        expect(config).toBeDefined();
        expect(config.callbacks).toBeDefined();
        expect(config.callbacks.init_pfs).toBeDefined();
        expect(Array.isArray(config.callbacks.init_pfs)).toBe(true);
        expect(config.callbacks.new_current).toBeDefined();
        expect(Array.isArray(config.callbacks.new_current)).toBe(true);
        expect(config.callbacks.node_open).toBeDefined();
        expect(Array.isArray(config.callbacks.node_open)).toBe(true);
        expect(config.callbacks.node_closed).toBeDefined();
        expect(Array.isArray(config.callbacks.node_closed)).toBe(true);
        expect(config.callbacks.better_path).toBeDefined();
        expect(Array.isArray(config.callbacks.better_path)).toBe(true);
        expect(config.callbacks.equal_path).toBeDefined();
        expect(Array.isArray(config.callbacks.equal_path)).toBe(true);
        expect(config.callbacks.goal_reached).toBeDefined();
        expect(Array.isArray(config.callbacks.goal_reached)).toBe(true);
      }
    );


    test('should instantiate a default config object with messages object', () => {
      var config = $PFS.preparePFSStandardConfig();
      expect(config.messages).toBeDefined();
      expect(config.messages).toBeInstanceOf(Object);
    });


    test(
      'should instantiate a default config object with correctly structured messages object',
      () => {
        var config = $PFS.preparePFSStandardConfig();
        expect(config).toBeDefined();
        expect(config.messages).toBeDefined();
        expect(config.messages.init_pfs_msgs).toBeDefined();
        expect(Array.isArray(config.messages.init_pfs_msgs)).toBe(true);
        expect(config.messages.new_current_msgs).toBeDefined();
        expect(Array.isArray(config.messages.new_current_msgs)).toBe(true);
        expect(config.messages.node_open_msgs).toBeDefined();
        expect(Array.isArray(config.messages.node_open_msgs)).toBe(true);
        expect(config.messages.node_closed_msgs).toBeDefined();
        expect(Array.isArray(config.messages.node_closed_msgs)).toBe(true);
        expect(config.messages.better_path_msgs).toBeDefined();
        expect(Array.isArray(config.messages.better_path_msgs)).toBe(true);
        expect(config.messages.equal_path_msgs).toBeDefined();
        expect(Array.isArray(config.messages.equal_path_msgs)).toBe(true);
        expect(config.messages.goal_reached_msgs).toBeDefined();
        expect(Array.isArray(config.messages.goal_reached_msgs)).toBe(true);
      }
    );


    test(
      'should instantiate a default config object with goal node set to null',
      () => {
        var config = $PFS.preparePFSStandardConfig();
        expect(config).toBeDefined();
        expect(config.goal_node).toBeNull();
      }
    );


    test(
      'should instantiate a default config object with an existing init_pfs callback',
      () => {
        var config = $PFS.preparePFSStandardConfig();
        expect(config.callbacks).toBeDefined();
        expect(config.callbacks.init_pfs).toBeDefined();
        expect(config.callbacks.init_pfs).toHaveLength(0);
        expect(config.callbacks.init_pfs[0]).toBeDefined();
        expect(config.callbacks.init_pfs[0]).toBeInstanceOf(Function);
      }
    );

  });


  describe('Callback execution tests in different stages - ', () => {

    test('should execute the initPFS callbacks', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      var pfsInitTestCallback = function () {
        config.messages.init_pfs_msgs['test_message'] = "PFS INIT callback executed.";
      };
      config.callbacks.init_pfs.push(pfsInitTestCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.init_pfs_msgs['test_message']).toBe("PFS INIT callback executed.");
    });


    test('should execute the new_current callbacks', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      var pfsNewCurrentTestCallback = function (scope: $PFS.PFS_Scope) {
        
        config.messages.new_current_msgs['test_message'] = "PFS NEW CURRENT callback executed.";
      };
      config.callbacks.new_current.push(pfsNewCurrentTestCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.new_current_msgs['test_message']).toBe("PFS NEW CURRENT callback executed.");

    });


    test('should execute the goal reached callbacks', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      config.goal_node = root;

      var pfsGoalReachedCallback = function () {
        config.messages.goal_reached_msgs['test_message'] = "GOAL REACHED callback executed.";
      };
      config.callbacks.goal_reached.push(pfsGoalReachedCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.goal_reached_msgs['test_message']).toBe("GOAL REACHED callback executed.");
    });


    test('should execute the not encountered callbacks', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      var pfsnotEncCallback = function () {
        config.messages.not_enc_msgs['test_message'] = "NOT ENCOUNTERED callback executed.";
      };
      config.callbacks.not_encountered.push(pfsnotEncCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.not_enc_msgs['test_message']).toBe("NOT ENCOUNTERED callback executed.");
    });


    test('should execute the node open callbacks', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      var pfsNodeOpenCallback = function () {
        config.messages.node_open_msgs['test_message'] = "NODE OPEN callback executed.";
      };
      config.callbacks.node_open.push(pfsNodeOpenCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.node_open_msgs['test_message']).toBe("NODE OPEN callback executed.");
    });


    test('should execute the node closed callbacks', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      var pfsNodeClosedCallback = function () {
        config.messages.node_closed_msgs['test_message'] = "NODE CLOSED callback executed.";
      };
      config.callbacks.node_closed.push(pfsNodeClosedCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.node_closed_msgs['test_message']).toBe("NODE CLOSED callback executed.");
    });


    test('should execute the better path (found) callbacks', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      var pfsBetterPathFoundCallback = function () {
        config.messages.better_path_msgs['test_message'] = "BETTER PATH FOUND callback executed.";
      };
      config.callbacks.better_path.push(pfsBetterPathFoundCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.better_path_msgs['test_message']).toBe("BETTER PATH FOUND callback executed.");
    });


    test('should execute the equal path (found) callbacks', () => {
      graph = json.readFromJSONFile(equal_dists);

      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();

      var pfsEqualPathFoundCallback = function () {
        config.messages.equal_path_msgs['equal_test_message'] = "EQUAL PATH FOUND callback executed.";
      };
      config.callbacks.equal_path.push(pfsEqualPathFoundCallback);
      var result = $PFS.PFS(graph, root, config);
      expect(config.messages.equal_path_msgs['equal_test_message']).toBe("EQUAL PATH FOUND callback executed.");
    });


    test('should only accept UN/DIRECTED or MIXED Mode as traversal modes', () => {
      var root = graph.getNodeById('A'),
        config = $PFS.preparePFSStandardConfig();
      config.dir_mode = -77;
      expect($PFS.PFS.bind($PFS.PFS, graph, root, config)).toThrowError('Unsupported traversal mode. Please use directed, undirected, or mixed');
    });

  });


  describe('PFS search Scenarios in Search Graph PFS - ', () => {

    describe('DIRECTED mode search', () => {

      var config = $PFS.preparePFSStandardConfig();
      config.dir_mode = $G.GraphMode.DIRECTED;

      test('Should correctly compute best paths from Node A', () => {
        var root = graph.getNodeById('A'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(graph.getNodeById('A'));
        expect(result['A'].distance).toBe(0);
        expect(result['B'].parent).toBe(graph.getNodeById('A'));
        expect(result['B'].distance).toBe(3);
        expect(result['C'].parent).toBe(graph.getNodeById('A'));
        expect(result['C'].distance).toBe(4);
        expect(result['D'].parent).toBe(graph.getNodeById('A'));
        expect(result['D'].distance).toBe(1);
        expect(result['E'].parent).toBe(graph.getNodeById('C'));
        expect(result['E'].distance).toBe(5);
        expect(result['F'].parent).toBe(graph.getNodeById('B'));
        expect(result['F'].distance).toBe(4);
      });


      test('Should correctly compute best paths from Node B', () => {
        var root = graph.getNodeById('B'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(graph.getNodeById('C'));
        expect(result['A'].distance).toBe(3);
        expect(result['B'].parent).toBe(graph.getNodeById('B'));
        expect(result['B'].distance).toBe(0);
        expect(result['C'].parent).toBe(graph.getNodeById('B'));
        expect(result['C'].distance).toBe(2);
        expect(result['D'].parent).toBe(graph.getNodeById('A'));
        expect(result['D'].distance).toBe(4);
        expect(result['E'].parent).toBe(graph.getNodeById('C'));
        expect(result['E'].distance).toBe(3);
        expect(result['F'].parent).toBe(graph.getNodeById('B'));
        expect(result['F'].distance).toBe(1);
      });


      test('Should correctly compute best paths from Node D', () => {
        var root = graph.getNodeById('D'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(graph.getNodeById('C'));
        expect(result['A'].distance).toBe(7);
        expect(result['B'].parent).toBe(graph.getNodeById('A'));
        expect(result['B'].distance).toBe(10);
        expect(result['C'].parent).toBe(graph.getNodeById('D'));
        expect(result['C'].distance).toBe(6);
        expect(result['D'].parent).toBe(graph.getNodeById('D'));
        expect(result['D'].distance).toBe(0);
        expect(result['E'].parent).toBe(graph.getNodeById('C'));
        expect(result['E'].distance).toBe(7);
        expect(result['F'].parent).toBe(graph.getNodeById('B'));
        expect(result['F'].distance).toBe(11);
      });


      test('Should correctly compute best paths from Node F', () => {
        var root = graph.getNodeById('F'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(graph.getNodeById('C'));
        expect(result['A'].distance).toBe(4);
        expect(result['B'].parent).toBe(graph.getNodeById('A'));
        expect(result['B'].distance).toBe(7);
        expect(result['C'].parent).toBe(graph.getNodeById('F'));
        expect(result['C'].distance).toBe(3);
        expect(result['D'].parent).toBe(graph.getNodeById('A'));
        expect(result['D'].distance).toBe(5);
        expect(result['E'].parent).toBe(graph.getNodeById('C'));
        expect(result['E'].distance).toBe(4);
        expect(result['F'].parent).toBe(graph.getNodeById('F'));
        expect(result['F'].distance).toBe(0);
      });

    });


    describe('UNDIRECTED mode search', () => {

      var config = $PFS.preparePFSStandardConfig();
      config.dir_mode = $G.GraphMode.UNDIRECTED;

      test('Should correctly compute best paths from Node B', () => {
        var root = graph.getNodeById('B'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(null);
        expect(result['A'].distance).toBe(Number.POSITIVE_INFINITY);
        expect(result['B'].parent).toBe(graph.getNodeById('B'));
        expect(result['B'].distance).toBe(0);
        expect(result['C'].parent).toBe(null);
        expect(result['C'].distance).toBe(Number.POSITIVE_INFINITY);
        expect(result['D'].parent).toBe(graph.getNodeById('E'));
        expect(result['D'].distance).toBe(5);
        expect(result['E'].parent).toBe(graph.getNodeById('B'));
        expect(result['E'].distance).toBe(5);
        expect(result['F'].parent).toBe(null);
        expect(result['F'].distance).toBe(Number.POSITIVE_INFINITY);
      });


      test('Should correctly compute best paths from Node E', () => {
        var root = graph.getNodeById('E'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(null);
        expect(result['A'].distance).toBe(Number.POSITIVE_INFINITY);
        expect(result['B'].parent).toBe(graph.getNodeById('E'));
        expect(result['B'].distance).toBe(5);
        expect(result['C'].parent).toBe(null);
        expect(result['C'].distance).toBe(Number.POSITIVE_INFINITY);
        expect(result['D'].parent).toBe(graph.getNodeById('E'));
        expect(result['D'].distance).toBe(0);
        expect(result['E'].parent).toBe(graph.getNodeById('E'));
        expect(result['E'].distance).toBe(0);
        expect(result['F'].parent).toBe(null);
        expect(result['F'].distance).toBe(Number.POSITIVE_INFINITY);
      });


      test('Should correctly compute best paths from Node D', () => {
        var root = graph.getNodeById('D'),
          result = $PFS.PFS(graph, root, config);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(null);
        expect(result['A'].distance).toBe(Number.POSITIVE_INFINITY);
        expect(result['B'].parent).toBe(graph.getNodeById('E'));
        expect(result['B'].distance).toBe(5);
        expect(result['C'].parent).toBe(null);
        expect(result['C'].distance).toBe(Number.POSITIVE_INFINITY);
        expect(result['D'].parent).toBe(graph.getNodeById('D'));
        expect(result['D'].distance).toBe(0);
        expect(result['E'].parent).toBe(graph.getNodeById('D'));
        expect(result['E'].distance).toBe(0);
        expect(result['F'].parent).toBe(null);
        expect(result['F'].distance).toBe(Number.POSITIVE_INFINITY);
      });

    });


    describe('MIXED mode search', () => {

      test('Should correctly compute best paths from Node A', () => {
        var root = graph.getNodeById('A'),
          result = $PFS.PFS(graph, root);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(graph.getNodeById('A'));
        expect(result['A'].distance).toBe(0);
        expect(result['B'].parent).toBe(graph.getNodeById('A'));
        expect(result['B'].distance).toBe(3);
        expect(result['C'].parent).toBe(graph.getNodeById('A'));
        expect(result['C'].distance).toBe(4);
        expect(result['D'].parent).toBe(graph.getNodeById('A'));
        expect(result['D'].distance).toBe(1);
        expect(result['E'].parent).toBe(graph.getNodeById('D'));
        expect(result['E'].distance).toBe(1);
        expect(result['F'].parent).toBe(graph.getNodeById('B'));
        expect(result['F'].distance).toBe(4);
      });


      test('Should correctly compute best paths from Node B', () => {
        var root = graph.getNodeById('B'),
          result = $PFS.PFS(graph, root);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(graph.getNodeById('C'));
        expect(result['A'].distance).toBe(3);
        expect(result['B'].parent).toBe(graph.getNodeById('B'));
        expect(result['B'].distance).toBe(0);
        expect(result['C'].parent).toBe(graph.getNodeById('B'));
        expect(result['C'].distance).toBe(2);
        expect(result['D'].parent).toBe(graph.getNodeById('E'));
        expect(result['D'].distance).toBe(3);
        expect(result['E'].parent).toBe(graph.getNodeById('C'));
        expect(result['E'].distance).toBe(3);
        expect(result['F'].parent).toBe(graph.getNodeById('B'));
        expect(result['F'].distance).toBe(1);
      });


      test('Should correctly compute best paths from Node D', () => {
        var root = graph.getNodeById('D'),
          result = $PFS.PFS(graph, root);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(graph.getNodeById('C'));
        expect(result['A'].distance).toBe(7);
        expect(result['B'].parent).toBe(graph.getNodeById('E'));
        expect(result['B'].distance).toBe(5);
        expect(result['C'].parent).toBe(graph.getNodeById('D'));
        expect(result['C'].distance).toBe(6);
        expect(result['D'].parent).toBe(graph.getNodeById('D'));
        expect(result['D'].distance).toBe(0);
        expect(result['E'].parent).toBe(graph.getNodeById('D'));
        expect(result['E'].distance).toBe(0);
        expect(result['F'].parent).toBe(graph.getNodeById('B'));
        expect(result['F'].distance).toBe(6);
      });


      test('Should correctly compute best paths from Node E', () => {
        var root = graph.getNodeById('E'),
          result = $PFS.PFS(graph, root);

        expect(Object.keys(result).length).toBe(6);

        expect(result['A'].parent).toBe(graph.getNodeById('C'));
        expect(result['A'].distance).toBe(7);
        expect(result['B'].parent).toBe(graph.getNodeById('E'));
        expect(result['B'].distance).toBe(5);
        expect(result['C'].parent).toBe(graph.getNodeById('D'));
        expect(result['C'].distance).toBe(6);
        expect(result['D'].parent).toBe(graph.getNodeById('E'));
        expect(result['D'].distance).toBe(0);
        expect(result['E'].parent).toBe(graph.getNodeById('E'));
        expect(result['E'].distance).toBe(0);
        expect(result['F'].parent).toBe(graph.getNodeById('B'));
        expect(result['F'].distance).toBe(6);
      });

    });

  });


  describe('PFS search on search graph in UNWEIGHTED, mixed mode', () => {

    var config = $PFS.preparePFSStandardConfig();
    config.dir_mode = $G.GraphMode.MIXED;

    beforeEach(() => {
      json = new $I.JSONInput(true, false, false);
      graph = json.readFromJSONFile(search_graph);
      expect(graph).toBeDefined();
      expect(graph.nrNodes()).toBe(6);
      expect(graph.nrUndEdges()).toBe(2);
      expect(graph.nrDirEdges()).toBe(12);
    });


    test('Should correctly compute best paths from Node A', () => {
      var root = graph.getNodeById('A'),
        result = $PFS.PFS(graph, root, config);

      expect(Object.keys(result).length).toBe(6);
      expect(result['A'].parent).toBe(graph.getNodeById('A'));
      expect(result['A'].distance).toBe(0);
      expect(result['B'].parent).toBe(graph.getNodeById('A'));
      expect(result['B'].distance).toBe(1);
      expect(result['C'].parent).toBe(graph.getNodeById('A'));
      expect(result['C'].distance).toBe(1);
      expect(result['D'].parent).toBe(graph.getNodeById('A'));
      expect(result['D'].distance).toBe(1);
      expect(result['E'].parent).toBe(graph.getNodeById('B'));
      expect(result['E'].distance).toBe(2);
      expect(result['F'].parent).toBe(graph.getNodeById('B'));
      expect(result['F'].distance).toBe(2);
    });


    test('Should correctly compute best paths from Node B', () => {
      var root = graph.getNodeById('B'),
        result = $PFS.PFS(graph, root, config);

      expect(Object.keys(result).length).toBe(6);
      expect(result['A'].parent).toBe(graph.getNodeById('B'));
      expect(result['A'].distance).toBe(1);
      expect(result['B'].parent).toBe(graph.getNodeById('B'));
      expect(result['B'].distance).toBe(0);
      expect(result['C'].parent).toBe(graph.getNodeById('B'));
      expect(result['C'].distance).toBe(1);
      expect(result['D'].parent).toBe(graph.getNodeById('E'));
      expect(result['D'].distance).toBe(2);
      expect(result['E'].parent).toBe(graph.getNodeById('B'));
      expect(result['E'].distance).toBe(1);
      expect(result['F'].parent).toBe(graph.getNodeById('B'));
      expect(result['F'].distance).toBe(1);
    });


    test('Should correctly compute best paths from Node C', () => {
      var root = graph.getNodeById('C'),
        result = $PFS.PFS(graph, root, config);

      expect(Object.keys(result).length).toBe(6);
      expect(result['A'].parent).toBe(graph.getNodeById('C'));
      expect(result['A'].distance).toBe(1);
      expect(result['B'].parent).toBe(graph.getNodeById('E'));
      expect(result['B'].distance).toBe(2);
      expect(result['C'].parent).toBe(graph.getNodeById('C'));
      expect(result['C'].distance).toBe(0);
      expect(result['D'].parent).toBe(graph.getNodeById('E'));
      expect(result['D'].distance).toBe(2);
      expect(result['E'].parent).toBe(graph.getNodeById('C'));
      expect(result['E'].distance).toBe(1);
      expect(result['F'].parent).toBe(graph.getNodeById('B'));
      expect(result['F'].distance).toBe(3);
    });


    test('Should correctly compute best paths from Node D', () => {
      var root = graph.getNodeById('D'),
        result = $PFS.PFS(graph, root, config);

      expect(Object.keys(result).length).toBe(6);
      expect(result['A'].parent).toBe(graph.getNodeById('C'));
      expect(result['A'].distance).toBe(2);
      expect(result['B'].parent).toBe(graph.getNodeById('E'));
      expect(result['B'].distance).toBe(2);
      expect(result['C'].parent).toBe(graph.getNodeById('D'));
      expect(result['C'].distance).toBe(1);
      expect(result['D'].parent).toBe(graph.getNodeById('D'));
      expect(result['D'].distance).toBe(0);
      expect(result['E'].parent).toBe(graph.getNodeById('D'));
      expect(result['E'].distance).toBe(1);
      expect(result['F'].parent).toBe(graph.getNodeById('B'));
      expect(result['F'].distance).toBe(3);
    });


    test('Should correctly compute best paths from Node E', () => {
      var root = graph.getNodeById('E'),
        result = $PFS.PFS(graph, root, config);

      expect(Object.keys(result).length).toBe(6);
      expect(result['A'].parent).toBe(graph.getNodeById('B'));
      expect(result['A'].distance).toBe(2);
      expect(result['B'].parent).toBe(graph.getNodeById('E'));
      expect(result['B'].distance).toBe(1);
      expect(result['C'].parent).toBe(graph.getNodeById('B'));
      expect(result['C'].distance).toBe(2);
      expect(result['D'].parent).toBe(graph.getNodeById('E'));
      expect(result['D'].distance).toBe(1);
      expect(result['E'].parent).toBe(graph.getNodeById('E'));
      expect(result['E'].distance).toBe(0);
      expect(result['F'].parent).toBe(graph.getNodeById('B'));
      expect(result['F'].distance).toBe(2);
    });


    test('Should correctly compute best paths from Node F', () => {
      var root = graph.getNodeById('F'),
        result = $PFS.PFS(graph, root, config);

      expect(Object.keys(result).length).toBe(6);
      expect(result['A'].parent).toBe(graph.getNodeById('C'));
      expect(result['A'].distance).toBe(2);
      expect(result['B'].parent).toBe(graph.getNodeById('E'));
      expect(result['B'].distance).toBe(2);
      expect(result['C'].parent).toBe(graph.getNodeById('F'));
      expect(result['C'].distance).toBe(1);
      expect(result['D'].parent).toBe(graph.getNodeById('E'));
      expect(result['D'].distance).toBe(2);
      expect(result['E'].parent).toBe(graph.getNodeById('F'));
      expect(result['E'].distance).toBe(1);
      expect(result['F'].parent).toBe(graph.getNodeById('F'));
      expect(result['F'].distance).toBe(0);
    });

  });

});


describe('PFS TESTS on REAL sized graph - ', () => {

  var real_graph = "./test/test_data/real_graph.json",
    graph = json.readFromJSONFile(real_graph),
    NR_NODES = 6204,
    NR_UND_EDGES = 18550;


  beforeEach(() => {
    expect(graph).toBeDefined();
    expect(graph.nrNodes()).toBe(NR_NODES);
    expect(graph.nrUndEdges()).toBe(NR_UND_EDGES);
  });


  test(
    'should perform standard PFS without config initialization on real graph',
    () => {
      var root = graph.getRandomNode(),
        result = $PFS.PFS(graph, root);

      expect(Object.keys(result).length).toBe(NR_NODES);
    }
  );

});