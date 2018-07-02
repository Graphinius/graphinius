/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';


const expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
		n6_und_graph_file = "./test/test_data/undirected_unweighted_6nodes.csv",
    n333_und_graph_file = "./test/test_data/social_network_edges_300.csv",
    n1034_und_graph_file = "./test/test_data/social_network_edges.csv";


/**
 * PRIMITIVE (FAKE) K-PARTITIONING -
 * 
 * Simply cut the graph into k pieces + rest, so that
 * each partition holds Math.floor(n/k) nodes, except
 * the first n%k partitions, which hold 1 node more
 * 
 * Testing for sequential as well as shuffle partitioning
 */
describe("K-cut partitioning tests - ", () => {

	before( () => {
		let n6_und_graph : $G.IGraph = csv.readFromEdgeListFile(n6_und_graph_file),
				n333_und_graph : $G.IGraph = csv.readFromEdgeListFile(n333_und_graph_file),
				n1034_und_graph : $G.IGraph = csv.readFromEdgeListFile(n1034_und_graph_file);
	});

});

