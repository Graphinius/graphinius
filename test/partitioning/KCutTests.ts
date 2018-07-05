/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $G from '../../src/core/Graph';
import * as $CSV from '../../src/io/input/CSVInput';
import { GraphPartitioning } from '../../src/partitioning/Interfaces';
import KCut from '../../src/partitioning/KCut';
import { Logger } from '../../src/utils/logger';
const logger = new Logger();


const expect = chai.expect,
    csv : $CSV.ICSVInput = new $CSV.CSVInput(" ", false, false),
		n6_und_graph_file = "./test/test_data/undirected_unweighted_6nodes.csv",
    n333_und_graph_file = "./test/test_data/social_network_edges_300.csv",
    n1034_und_graph_file = "./test/test_data/social_network_edges_1K.csv";


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

	let n6_und_graph : $G.IGraph,
			n333_und_graph : $G.IGraph,
			n1034_und_graph : $G.IGraph,
			k_cut: KCut,
			partitioning : GraphPartitioning;


	beforeEach( () => {
		n6_und_graph = csv.readFromEdgeListFile(n6_und_graph_file),
		n333_und_graph = csv.readFromEdgeListFile(n333_und_graph_file),
		n1034_und_graph = csv.readFromEdgeListFile(n1034_und_graph_file);
	});


	it('should partition a 6-node graph into two node-sets of size 3, no shuffle', () => {
		partitioning = new KCut(n6_und_graph).cut(2);

		Object.keys(partitioning.partitions).forEach( part_nr => {
			logger.log(Object.keys(partitioning.partitions[part_nr].nodes));
		});

		expect(Object.keys(partitioning.partitions).length).to.equal(2);
		Object.keys(partitioning.partitions).forEach( part_nr => {
			expect(Object.keys(partitioning.partitions[part_nr].nodes).length).to.equal(3);
		});
	});


	it('should partition a 7-node graph into two node-sets of size 4 & 3, no shuffle', () => {
		n6_und_graph.addNodeByID("extra!!!");
		partitioning = new KCut(n6_und_graph).cut(2);

		Object.keys(partitioning.partitions).forEach( part_nr => {
			logger.log(Object.keys(partitioning.partitions[part_nr].nodes));
		});

		expect(Object.keys(partitioning.partitions).length).to.equal(2);
		expect(Object.keys(partitioning.partitions[0].nodes).length).to.equal(4);
		expect(Object.keys(partitioning.partitions[1].nodes).length).to.equal(3);
	});


	it('should partition the 6-node graph into two node-sets of size 3, with shuffle', () => {
		partitioning = new KCut(n6_und_graph).cut(2, true);

		Object.keys(partitioning.partitions).forEach( part_nr => {
			logger.log(Object.keys(partitioning.partitions[part_nr].nodes));
		});

		expect(Object.keys(partitioning.partitions).length).to.equal(2);
		Object.keys(partitioning.partitions).forEach( part_nr => {
			expect(Object.keys(partitioning.partitions[part_nr].nodes).length).to.equal(3);
		});
	});


	it('shuffle should make a difference', () => {
		partitioning = new KCut(n333_und_graph).cut(111);
		let partitioning_shuffle = new KCut(n333_und_graph).cut(111, true);
		expect(Object.keys(partitioning.partitions).length).to.equal(111);
		Object.keys(partitioning.partitions).forEach( part_nr => {
			expect(Object.keys(partitioning.partitions[part_nr].nodes).length).to.equal(3);
		});
		expect(partitioning).not.to.deep.equal(partitioning_shuffle);
	});


	/**
	 * 
	 * @todo abstract out into performance suite, once available
	 * @todo take a fucking bigger one !!!
	 */
	it('performance measure on a 1034 node graph', () => {
		let tic = +new Date;
		partitioning = new KCut(n1034_und_graph).cut(16, true);
		let toc = +new Date;
		logger.log(`C-cut partitioning of a 1034 graph with shuffle took: ${toc-tic} ms.`);
	});
});

