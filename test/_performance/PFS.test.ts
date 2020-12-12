import { CSVInput } from "../../lib/io/input/CSVInput";
import { CSV_SN_PATH } from "../config/test_paths";
import * as $PFS from "../../lib/traversal/PFS";
import { Logger } from "../../lib/utils/Logger";

const logger = new Logger();

describe('PFS PERFORMANCE TESTS on social network graphs - ', () => {

	const csv = new CSVInput({ separator: ' ', explicit_direction: false });

	const
		sn_300_file = `${CSV_SN_PATH}/social_network_edges_300.csv`,
		sn_1K_file = `${CSV_SN_PATH}/social_network_edges_1K.csv`,
		sn_20K_file = `${CSV_SN_PATH}/social_network_edges_20K.csv`;

	const sn_300_graph = csv.readFromEdgeListFile(sn_300_file),
		sn_1K_graph = csv.readFromEdgeListFile(sn_1K_file),
		sn_20K_graph = csv.readFromEdgeListFile(sn_20K_file);


	beforeEach(() => {
		expect(sn_300_graph).toBeDefined();
		expect(sn_1K_graph).toBeDefined();
		expect(sn_20K_graph).toBeDefined();
	});


	[sn_300_graph, sn_1K_graph, sn_20K_graph].forEach(graph => {
		test('PFS performance test on real graph', () => {
			const root = graph.getRandomNode();
			const tic = +new Date;
			const result = $PFS.PFS(graph, root);
			const toc = +new Date;

			logger.log(`PFS on |V|=${graph.nrNodes()}, |E|=${graph.nrUndEdges() + graph.nrDirEdges()} took ${toc - tic} ms.`);
			expect(Object.keys(result).length).toBe(graph.nrNodes());
		});

	});

});
