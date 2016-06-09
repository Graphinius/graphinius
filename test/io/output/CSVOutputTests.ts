
/// <reference path="../../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../../src/core/Nodes';
import * as $E from '../../../src/core/Edges';
import * as $G from '../../../src/core/Graph';
import * as $O from '../../../src/io/output/CSVOutput';
// import * as $C from '../../../test/io/input/common';

var expect = chai.expect,
		CSVOutput = $O.CSVOutput;


describe('GRAPH CSV OUTPUT TESTS - ', () => {

	var csv: $O.ICSVOutput,
      output_file: string,
      out_graph: string,
      graph: $G.IGraph,
      DEFAULT_SEP: string = ',';

	describe('Basic instantiation tests', () => {

		it('should instantiate a default version of CSVOutput', () => {
			csv = new CSVOutput();
			expect(csv).to.be.an.instanceof(CSVOutput);
			expect(csv._separator).to.equal(DEFAULT_SEP);
      expect(csv._explicit_direction).to.be.true;
      expect(csv._direction_mode).to.be.false;
		});

	});
  
  
  describe('Adjacency list output tests - ', () => {
    
    var graph : $G.IGraph;
    var n_a, n_b, n_c, n_d : $N.IBaseNode;
    var e_1, e_2, e_3, e_4, e_5, e_6, e_7 : $E.IBaseEdge;
    
    beforeEach(() => {
      csv = new CSVOutput();
      graph = new $G.BaseGraph("Test graph for CSV output");
      n_a = graph.addNode('A');
			n_b = graph.addNode('B');
			n_c = graph.addNode('C');
			n_d = graph.addNode('D');
			e_1 = graph.addEdge('1', n_a, n_b);
			e_2 = graph.addEdge('2', n_a, n_c);
			e_3 = graph.addEdge('3', n_a, n_a, {directed: true});
			e_4 = graph.addEdge('4', n_a, n_b, {directed: true});
			e_5 = graph.addEdge('5', n_a, n_d, {directed: true});
			e_6 = graph.addEdge('6', n_c, n_a, {directed: true});
			e_7 = graph.addEdge('7', n_d, n_a, {directed: true});
    });
    
    
    it('should output test graph as undirected graph', () => {
      csv._explicit_direction = false;
      var expected_graph = "";
      expected_graph += "A A B D C \n" // directed before undirected
      expected_graph += "B A \n"
      expected_graph += "C A \n"
      expected_graph += "D A \n";
                                  
      out_graph = csv.writeToAdjacencyList(graph);      
      expect(out_graph).to.equal(expected_graph);
    });
    
    
    it.skip('should output test graph as CSV file', () => {
      
    });
    
  });
  
});