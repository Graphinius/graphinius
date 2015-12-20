/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $I from '../../src/input/CSVInput';

var expect 	= chai.expect;
var Node 		= $N.BaseNode;
var Edge 		= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
var CSV 		= $I.CSVInput;


describe('GRAPH CSV INPUT TESTS', () => {
	
	var csv 					: $I.ICSVInput,
			sep 					: string,
			input_file		: string,
			graph					: $G.IGraph,
			stats					: $G.GraphStats,
			DEFAULT_SEP		: string = ',';
	
	describe('Basic instantiation tests', () => {
		
		it('should instantiabe a default version of CSVInput', () => {
			csv = new CSV();
			expect(csv).to.be.an.instanceof(CSV);
			expect(csv._separator).to.equal(DEFAULT_SEP);
		});
		
	});
	
	describe('Basic input tests', () => {
		
		beforeEach('instantiate the CSV input class', () => {
			csv = new CSV();
		});
		
		/**
		 * We are going to use the 'slightly more complex scenario'
		 * from our Graph tests (4 nodes, 7 edges)
		 * The CSV will be encoded as an adjacency list
		 */ 
		it('should construct a very small graph from an adjacency list and produce the right stats', () => {
			var file = "./test_data/small_graph_adj_list_def_sep.csv";
			var graph = csv.readFromAdjacenyList(file);
			// checkSmallGraphStats(graph);
		});
		
		
		/**
		 * We are going to use the 'slightly more complex scenario'
		 * from our Graph tests (4 nodes, 7 edges)
		 * The CSV will be encoded as an edge list
		 */ 
		it('should construct a very small graph from an edge list and produce the right stats', () => {
			
			
			
		});
		
		
		it('should be able to use a specified separator', () => {
			
			
			
		});
		
		
		function checkSmallGraphStats(graph : $G.IGraph) {
			var stats = graph.getStats();
			expect(stats.nr_nodes).to.equal(4);
			expect(stats.nr_dir_edges).to.equal(5);
			expect(stats.nr_und_edges).to.equal(2);
			expect(stats.mode).to.equal($G.GraphMode.MIXED);
			
			var deg_dist : $G.DegreeDistribution = graph.degreeDistribution();
			expect(deg_dist.und).to.deep.equal(new Uint16Array([1, 2, 1, 0, 0, 0, 0, 0, 0]));
			expect(deg_dist.in).to.deep.equal( new Uint16Array([1, 2, 0, 1, 0, 0, 0, 0, 0]));
			expect(deg_dist.out).to.deep.equal(new Uint16Array([1, 2, 0, 1, 0, 0, 0, 0, 0]));
			expect(deg_dist.dir).to.deep.equal(new Uint16Array([0, 2, 1, 0, 0, 0, 1, 0, 0]));
			expect(deg_dist.all).to.deep.equal(new Uint16Array([0, 0, 3, 0, 0, 0, 0, 0, 1]));
			
			var nodes = graph.getNodes();
			var n_a = nodes["A"],
					n_b = nodes["B"],
					n_c = nodes["C"],
					n_d = nodes["D"];
					
			expect(n_a).not.to.be.undefined;
			expect(n_a.getLabel()).to.equal('A');
			expect(n_a.inDegree()).to.equal(3);
			expect(n_a.outDegree()).to.equal(3);
			expect(n_a.degree()).to.equal(2);
			
			expect(n_b).not.to.be.undefined;
			expect(n_b.getLabel()).to.equal('B');
			expect(n_b.inDegree()).to.equal(1);
			expect(n_b.outDegree()).to.equal(0);
			expect(n_b.degree()).to.equal(1);
			
			expect(n_c).not.to.be.undefined;
			expect(n_c.getLabel()).to.equal('C');
			expect(n_c.inDegree()).to.equal(0);
			expect(n_c.outDegree()).to.equal(1);
			expect(n_c.degree()).to.equal(1);
			
			expect(n_d).not.to.be.undefined;
			expect(n_d.getLabel()).to.equal('D');
			expect(n_d.inDegree()).to.equal(1);
			expect(n_d.outDegree()).to.equal(1);
			expect(n_d.degree()).to.equal(0);
			
			var und_edges = graph.getUndEdges();
			var e_abu = und_edges["ABu"],
					e_acu = und_edges["ACu"];
					
			expect(e_abu).not.to.be.undefined;
			expect(e_abu.getLabel()).to.equal("1");
			expect(e_abu.isDirected()).to.be.false;
			expect(e_abu.getNodes().a).to.equal(n_a);
			expect(e_abu.getNodes().b).to.equal(n_b);			
			
			expect(e_acu).not.to.be.undefined;
			expect(e_acu.getLabel()).to.equal("2");
			expect(e_acu.isDirected()).to.be.false;
			expect(e_acu.getNodes().a).to.equal(n_a);
			expect(e_acu.getNodes().b).to.equal(n_c);		
			
			var dir_edges = graph.getDirEdges();
			var e_aad = dir_edges["AAd"],
					e_abd = dir_edges["ABd"],
					e_add = dir_edges["ADd"],
					e_cad = dir_edges["CAd"],
					e_dad = dir_edges["DAd"];
					
			expect(e_aad).not.to.be.undefined;
			expect(e_aad.getLabel()).to.equal("3");
			expect(e_aad.isDirected()).to.be.true;
			expect(e_aad.getNodes().a).to.equal(n_a);
			expect(e_aad.getNodes().b).to.equal(n_a);
			
			expect(e_abd).not.to.be.undefined;
			expect(e_abd.getLabel()).to.equal("4");
			expect(e_abd.isDirected()).to.be.true;
			expect(e_abd.getNodes().a).to.equal(n_a);
			expect(e_abd.getNodes().b).to.equal(n_b);
			
			expect(e_add).not.to.be.undefined;
			expect(e_add.getLabel()).to.equal("5");
			expect(e_add.isDirected()).to.be.true;
			expect(e_add.getNodes().a).to.equal(n_a);
			expect(e_add.getNodes().b).to.equal(n_d);
			
			expect(e_cad).not.to.be.undefined;
			expect(e_cad.getLabel()).to.equal("6");
			expect(e_cad.isDirected()).to.be.true;
			expect(e_cad.getNodes().a).to.equal(n_c);
			expect(e_cad.getNodes().b).to.equal(n_a);
			
			expect(e_dad).not.to.be.undefined;
			expect(e_dad.getLabel()).to.equal("5");
			expect(e_dad.isDirected()).to.be.true;
			expect(e_dad.getNodes().a).to.equal(n_d);
			expect(e_dad.getNodes().b).to.equal(n_a);
		}
		
		
	});	
	
});