/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';

var expect 	= chai.expect;
var Node 		= $N.BaseNode;
var Edge 		= $E.BaseEdge;
var Graph 	= $G.BaseGraph;
		
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
	var e_abu = und_edges["A_B_u"],
			e_acu = und_edges["A_C_u"];					
			
	expect(e_abu).not.to.be.undefined;
	expect(e_abu.getLabel()).to.equal("A_B_u");
	expect(e_abu.isDirected()).to.be.false;
	expect(e_abu.getNodes().a).to.equal(n_a);
	expect(e_abu.getNodes().b).to.equal(n_b);			
	
	expect(e_acu).not.to.be.undefined;
	expect(e_acu.getLabel()).to.equal("A_C_u");
	expect(e_acu.isDirected()).to.be.false;
	expect(e_acu.getNodes().a).to.equal(n_a);
	expect(e_acu.getNodes().b).to.equal(n_c);		
	
	var dir_edges = graph.getDirEdges();
	var e_aad = dir_edges["A_A_d"],
			e_abd = dir_edges["A_B_d"],
			e_add = dir_edges["A_D_d"],
			e_cad = dir_edges["C_A_d"],
			e_dad = dir_edges["D_A_d"];
			
	expect(e_aad).not.to.be.undefined;
	expect(e_aad.getLabel()).to.equal("A_A_d");
	expect(e_aad.isDirected()).to.be.true;
	expect(e_aad.getNodes().a).to.equal(n_a);
	expect(e_aad.getNodes().b).to.equal(n_a);
	
	expect(e_abd).not.to.be.undefined;
	expect(e_abd.getLabel()).to.equal("A_B_d");
	expect(e_abd.isDirected()).to.be.true;
	expect(e_abd.getNodes().a).to.equal(n_a);
	expect(e_abd.getNodes().b).to.equal(n_b);
	
	expect(e_add).not.to.be.undefined;
	expect(e_add.getLabel()).to.equal("A_D_d");
	expect(e_add.isDirected()).to.be.true;
	expect(e_add.getNodes().a).to.equal(n_a);
	expect(e_add.getNodes().b).to.equal(n_d);
	
	expect(e_cad).not.to.be.undefined;
	expect(e_cad.getLabel()).to.equal("C_A_d");
	expect(e_cad.isDirected()).to.be.true;
	expect(e_cad.getNodes().a).to.equal(n_c);
	expect(e_cad.getNodes().b).to.equal(n_a);
	
	expect(e_dad).not.to.be.undefined;
	expect(e_dad.getLabel()).to.equal("D_A_d");
	expect(e_dad.isDirected()).to.be.true;
	expect(e_dad.getNodes().a).to.equal(n_d);
	expect(e_dad.getNodes().b).to.equal(n_a);
}

export {checkSmallGraphStats}