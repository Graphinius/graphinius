import {GraphMode} from '../../../src/core/interfaces';
import * as $G from '../../../src/core/base/BaseGraph';
import {DegreeDistribution, DegreeCentrality} from '../../../src/centralities/Degree';
const degCent = new DegreeCentrality();
import { labelKeys } from '../../../src/io/interfaces';

		
function checkSmallGraphStats(graph : $G.IGraph) {
	let stats = graph.getStats();
	expect(stats.nr_nodes).toBe(4);
	expect(stats.nr_dir_edges).toBe(5);
	expect(stats.nr_und_edges).toBe(2);
	expect(stats.mode).toBe(GraphMode.MIXED);
	
	let deg_dist : DegreeDistribution = degCent.degreeDistribution(graph);
	expect(deg_dist.und).toEqual(new Uint32Array([1, 2, 1, 0, 0, 0, 0, 0, 0]));
	expect(deg_dist.in).toEqual(new Uint32Array([1, 2, 0, 1, 0, 0, 0, 0, 0]));
	expect(deg_dist.out).toEqual(new Uint32Array([1, 2, 0, 1, 0, 0, 0, 0, 0]));
	expect(deg_dist.dir).toEqual(new Uint32Array([0, 2, 1, 0, 0, 0, 1, 0, 0]));
	expect(deg_dist.all).toEqual(new Uint32Array([0, 0, 3, 0, 0, 0, 0, 0, 1]));
	
	let nodes = graph.getNodes();
	let n_a = nodes["A"],
			n_b = nodes["B"],
			n_c = nodes["C"],
			n_d = nodes["D"];
			
	expect(n_a).not.toBeUndefined();
	expect(n_a.getLabel()).toBe('A');
	expect(n_a.inDegree()).toBe(3);
	expect(n_a.outDegree()).toBe(3);
	expect(n_a.degree()).toBe(2);
	
	expect(n_b).not.toBeUndefined();
	expect(n_b.getLabel()).toBe('B');
	expect(n_b.inDegree()).toBe(1);
	expect(n_b.outDegree()).toBe(0);
	expect(n_b.degree()).toBe(1);
	
	expect(n_c).not.toBeUndefined();
	expect(n_c.getLabel()).toBe('C');
	expect(n_c.inDegree()).toBe(0);
	expect(n_c.outDegree()).toBe(1);
	expect(n_c.degree()).toBe(1);
	
	expect(n_d).not.toBeUndefined();
	expect(n_d.getLabel()).toBe('D');
	expect(n_d.inDegree()).toBe(1);
	expect(n_d.outDegree()).toBe(1);
	expect(n_d.degree()).toBe(0);
	
	let und_edges = graph.getUndEdges();
  for (let edge in und_edges) {
    expect(graph.getEdgeById(edge).isWeighted()).toBe(false);
    expect(graph.getEdgeById(edge).getWeight()).toBeUndefined();
  }	
	let e_abu = und_edges["A_B_u"],
			e_acu = und_edges["A_C_u"];					
			
	expect(e_abu).not.toBeUndefined();
	expect(e_abu.getLabel()).toBe("A_B_u");
	expect(e_abu.isDirected()).toBe(false);
	expect(e_abu.getNodes().a).toBe(n_a);
	expect(e_abu.getNodes().b).toBe(n_b);			
	
	expect(e_acu).not.toBeUndefined();
	expect(e_acu.getLabel()).toBe("A_C_u");
	expect(e_acu.isDirected()).toBe(false);
	expect(e_acu.getNodes().a).toBe(n_a);
	expect(e_acu.getNodes().b).toBe(n_c);		
	
	let dir_edges = graph.getDirEdges();
  for (let edge in dir_edges) {
    expect(graph.getEdgeById(edge).isWeighted()).toBe(false);
    expect(graph.getEdgeById(edge).getWeight()).toBeUndefined();
  }	
	let e_aad = dir_edges["A_A_d"],
			e_abd = dir_edges["A_B_d"],
			e_add = dir_edges["A_D_d"],
			e_cad = dir_edges["C_A_d"],
			e_dad = dir_edges["D_A_d"];
			
	expect(e_aad).not.toBeUndefined();
	expect(e_aad.getLabel()).toBe("A_A_d");
	expect(e_aad.isDirected()).toBe(true);
	expect(e_aad.getNodes().a).toBe(n_a);
	expect(e_aad.getNodes().b).toBe(n_a);
	
	expect(e_abd).not.toBeUndefined();
	expect(e_abd.getLabel()).toBe("A_B_d");
	expect(e_abd.isDirected()).toBe(true);
	expect(e_abd.getNodes().a).toBe(n_a);
	expect(e_abd.getNodes().b).toBe(n_b);
	
	expect(e_add).not.toBeUndefined();
	expect(e_add.getLabel()).toBe("A_D_d");
	expect(e_add.isDirected()).toBe(true);
	expect(e_add.getNodes().a).toBe(n_a);
	expect(e_add.getNodes().b).toBe(n_d);
	
	expect(e_cad).not.toBeUndefined();
	expect(e_cad.getLabel()).toBe("C_A_d");
	expect(e_cad.isDirected()).toBe(true);
	expect(e_cad.getNodes().a).toBe(n_c);
	expect(e_cad.getNodes().b).toBe(n_a);
	
	expect(e_dad).not.toBeUndefined();
	expect(e_dad.getLabel()).toBe("D_A_d");
	expect(e_dad.isDirected()).toBe(true);
	expect(e_dad.getNodes().a).toBe(n_d);
	expect(e_dad.getNodes().b).toBe(n_a);
}


function checkSmallGraphCoords(graph: $G.IGraph) {
	let a_coords = graph.getNodeById("A").getFeature(labelKeys.coords);
	expect(typeof a_coords.x).toBe('number');
	expect(a_coords.x).toBe(15);
	expect(typeof a_coords.y).toBe('number');
	expect(a_coords.y).toBe(2);
	expect(typeof a_coords.z).toBe('number');
	expect(a_coords.z).toBe(57);
	
	let b_coords = graph.getNodeById("B").getFeature(labelKeys.coords);
	expect(typeof b_coords.x).toBe('number');
	expect(b_coords.x).toBe(55);
	expect(typeof b_coords.y).toBe('number');
	expect(b_coords.y).toBe(25);
	expect(typeof b_coords.z).toBe('number');
	expect(b_coords.z).toBe(7);
	
	let c_coords = graph.getNodeById("C").getFeature(labelKeys.coords);
	expect(typeof c_coords.x).toBe('number');
	expect(c_coords.x).toBe(1);
	expect(typeof c_coords.y).toBe('number');
	expect(c_coords.y).toBe(-12);
	expect(typeof c_coords.z).toBe('number');
	expect(c_coords.z).toBe(33);
	
	let d_coords = graph.getNodeById("D").getFeature(labelKeys.coords);
	expect(typeof d_coords.x).toBe('number');
	expect(d_coords.x).toBe(17);
	expect(typeof d_coords.y).toBe('number');
	expect(d_coords.y).toBe(-4);
	expect(typeof d_coords.z).toBe('number');
	expect(d_coords.z).toBe(-13);
}


function checkSmallGraphFeatures(graph: $G.IGraph) {
	['A', 'B', 'C', 'D'].forEach((id, idx) => {
		let feats = graph.getNodeById(id).getFeatures();
		expect(feats['foo']).not.toBeUndefined();
		expect(feats['foo']).toBe('bar');	
		expect(feats['true']).not.toBeUndefined();
		expect(feats['true']).toBe(true);
	});
}


function checkSmallGraphEdgeWeights(graph: $G.IGraph) {
  expect(graph.getEdgeById("A_B_u").isWeighted()).toBe(true);
  expect(graph.getEdgeById("A_B_u").getWeight()).toBe(3);
  expect(graph.getEdgeById("A_C_u").isWeighted()).toBe(true);
  expect(graph.getEdgeById("A_C_u").getWeight()).toBe(0);
  expect(graph.getEdgeById("A_A_d").isWeighted()).toBe(true);
  expect(graph.getEdgeById("A_A_d").getWeight()).toBe(7);
  expect(graph.getEdgeById("A_B_d").isWeighted()).toBe(true);
  expect(graph.getEdgeById("A_B_d").getWeight()).toBe(1);
  expect(graph.getEdgeById("A_D_d").isWeighted()).toBe(true);
  expect(graph.getEdgeById("A_D_d").getWeight()).toBe(-33);
  expect(graph.getEdgeById("C_A_d").isWeighted()).toBe(true);
  expect(graph.getEdgeById("C_A_d").getWeight()).toBe(11);
  expect(graph.getEdgeById("D_A_d").isWeighted()).toBe(true);
  expect(graph.getEdgeById("D_A_d").getWeight()).toBe(6);
}


export { checkSmallGraphStats, 
         checkSmallGraphCoords, 
         checkSmallGraphFeatures,
         checkSmallGraphEdgeWeights }