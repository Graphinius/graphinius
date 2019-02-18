import * as chai from 'chai';
import * as $N from '../../../src/core/Nodes';
import * as $E from '../../../src/core/Edges';
import * as $G from '../../../src/core/Graph';
import * as $O from '../../../src/io/output/CSVOutput';
import * as $I from '../../../src/io/input/CSVInput';
import * as $J from '../../../src/io/input/JSONInput';

var expect = chai.expect,
		CSVOutput = $O.CSVOutput,
    CSVInput = $I.CSVInput,
    JSONInput = $J.JSONInput;


describe('GRAPH CSV OUTPUT TESTS - ', () => {

	var csvOut: $O.ICSVOutput,
      csvIn: $I.ICSVInput,
      jsonIn: $J.IJSONInput,
      output_file: string,
      out_graph: string,
      graph: $G.IGraph,
      DEFAULT_SEP: string = ',',
      OUT_DIR = "./test/test_data/output/", // from src file...
      real_graph_file = "./test/test_data/real_graph.json";
      
  const REAL_GRAPH_NR_NODES = 6204,
        REAL_GRAPH_NR_EDGES = 18550;

	describe('Basic instantiation tests', () => {

		test('should instantiate a default version of CSVOutput', () => {
			csvOut = new CSVOutput();
			expect(csvOut).toBeInstanceOf(CSVOutput);
			expect(csvOut._separator).toBe(DEFAULT_SEP);
      expect(csvOut._explicit_direction).toBe(true);
      expect(csvOut._direction_mode).toBe(false);
		});

	});
  
  
  describe('Adjacency list output tests - ', () => {
    
    var graph : $G.IGraph;
    var n_a, n_b, n_c, n_d : $N.IBaseNode;
    var e_1, e_2, e_3, e_4, e_5, e_6, e_7 : $E.IBaseEdge;
    
    beforeEach(() => {
      csvOut = new CSVOutput(',', false, false);
      csvIn = new CSVInput(',', false, false);
      graph = new $G.BaseGraph("Test graph for CSV output");
      n_a = graph.addNodeByID('A');
			n_b = graph.addNodeByID('B');
			n_c = graph.addNodeByID('C');
			n_d = graph.addNodeByID('D');
			e_1 = graph.addEdgeByID('1', n_a, n_b);
			e_2 = graph.addEdgeByID('2', n_a, n_c);
			e_3 = graph.addEdgeByID('3', n_a, n_a, {directed: true});
			e_4 = graph.addEdgeByID('4', n_a, n_b, {directed: true});
			e_5 = graph.addEdgeByID('5', n_a, n_d, {directed: true});
			e_6 = graph.addEdgeByID('6', n_c, n_a, {directed: true});
			e_7 = graph.addEdgeByID('7', n_d, n_a, {directed: true});
    });
    
    
    test('should output test graph as undirected graph', () => {
      var expected_graph = "";
      expected_graph += "A,A,B,D,C\n" // directed before undirected
      expected_graph += "B,A\n"
      expected_graph += "C,A\n"
      expected_graph += "D,A\n";
                                  
      out_graph = csvOut.writeToAdjacencyList(graph);      
      expect(out_graph).toBe(expected_graph);
    });
    
    
    test('should output test graph as undirected graph, space separator', () => {
      var expected_graph = "";
      csvOut._separator = " ";
      expected_graph += "A A B D C\n" // directed before undirected
      expected_graph += "B A\n"
      expected_graph += "C A\n"
      expected_graph += "D A\n";
                                  
      out_graph = csvOut.writeToAdjacencyList(graph);      
      expect(out_graph).toBe(expected_graph);
    });
    
    
    test('should output test graph as CSV file', () => {
      var outfile = OUT_DIR + "adj_list_test_graph.csv";
      csvOut.writeToAdjacencyListFile(outfile, graph);
      
      var inGraph = csvIn.readFromAdjacencyListFile(outfile);
      expect(inGraph.nrNodes()).toBe(4);
      expect(inGraph.nrDirEdges()).toBe(0);
      expect(inGraph.nrUndEdges()).toBe(4);      
    });
  
  
    describe("Tests with real graph sizes", () => {
      
      test('should output a real graph as CSV file', () => {
        jsonIn = new $J.JSONInput(false, false, false);
        var realGraph = jsonIn.readFromJSONFile(real_graph_file);
        
        expect(realGraph.nrNodes()).toBe(REAL_GRAPH_NR_NODES);
        expect(realGraph.nrUndEdges()).toBe(REAL_GRAPH_NR_EDGES);
        
        var outfile = OUT_DIR + "adj_list_real_graph.csv";        
        csvOut.writeToAdjacencyListFile(outfile, realGraph);
        
        var inGraph = csvIn.readFromAdjacencyListFile(outfile);
        expect(inGraph.nrNodes()).toBe(REAL_GRAPH_NR_NODES);
        expect(inGraph.nrDirEdges()).toBe(0);
        expect(inGraph.nrUndEdges()).toBe(REAL_GRAPH_NR_EDGES);
      });
      
    });  
  
  });
  
});