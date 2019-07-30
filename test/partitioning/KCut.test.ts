import * as $G from '../../src/core/BaseGraph';
import { CSVInput, ICSVInConfig } from '../../src/io/input/CSVInput';
import { GraphPartitioning } from '../../src/partitioning/Interfaces';
import { KCut } from '../../src/partitioning/KCut';
import { CSV_DATA_PATH, CSV_SN_PATH } from '../config/config';

import { Logger } from '../../src/utils/Logger';
const logger = new Logger();


const csv : CSVInput = new CSVInput({
			separator: " ", 
			explicit_direction: false, 
			direction_mode: false,
			weighted: false
		}),
		n6_und_graph_file = `${CSV_DATA_PATH}/undirected_unweighted_6nodes.csv`,
    n333_und_graph_file = `${CSV_SN_PATH}/social_network_edges_300.csv`,
    n1034_und_graph_file = `${CSV_SN_PATH}/social_network_edges_1K.csv`;


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

	beforeAll( () => {
		n333_und_graph = csv.readFromEdgeListFile(n333_und_graph_file),
		n1034_und_graph = csv.readFromEdgeListFile(n1034_und_graph_file);
	});

	beforeEach( () => {
		n6_und_graph = csv.readFromEdgeListFile(n6_und_graph_file);
	});


	it('should partition a 6-node graph into two node-sets of size 3, no shuffle', () => {
		partitioning = new KCut(n6_und_graph).cut(2);

		logPartitions( partitioning.partitions );

		expect(partitioning.partitions.size).toBe(2);
		for ( let [part_nr, partition] of partitioning.partitions ) {
			expect(partition.nodes.size).toBe(3);
		}
	});


	it('should partition a 7-node graph into two node-sets of size 4 & 3, no shuffle', () => {
		n6_und_graph.addNodeByID("extra!!!");
		partitioning = new KCut(n6_und_graph).cut(2);

		logPartitions( partitioning.partitions );

		expect(partitioning.partitions.size).toBe(2);
		expect(partitioning.partitions.get(1).nodes.size).toBe(4);
		expect(partitioning.partitions.get(2).nodes.size).toBe(3);
	});


	it('should partition the 6-node graph into two node-sets of size 3, with shuffle', () => {
		partitioning = new KCut(n6_und_graph).cut(2, true);

		logPartitions( partitioning.partitions );

		expect(partitioning.partitions.size).toBe(2);
		for ( let [part_nr, partition] of partitioning.partitions ) {
			expect(partition.nodes.size).toBe(3);
		}
	});


	it('shuffle should make a difference', () => {
		partitioning = new KCut(n333_und_graph).cut(111);
		let partitioning_shuffle = new KCut(n333_und_graph).cut(111, true);
		expect(partitioning.partitions.size).toBe(111);
		for ( let [part_nr, partition] of partitioning.partitions ) {
			expect(partition.nodes.size).toBe(3);
		}
		expect(partitioning).not.toEqual(partitioning_shuffle);
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


let logPartitions =  partitions => {
	for ( let [part_nr, partition] of partitions ) {
		process.stdout.write('[');
		partition.nodes.forEach( (id, node) => process.stdout.write(node + ', ') )
		process.stdout.write(']\n');
	}
}