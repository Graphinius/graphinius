import {CSVInput, ICSVInConfig} from '../../src/io/input/CSVInput';
import {ClosenessCentrality} from "../../src/centralities/Closeness";

import {Logger} from "../../src/utils/Logger";
import {CSV_SN_PATH} from "../config/test_paths";

const logger = new Logger();

const csv_in_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};
const csv = new CSVInput(csv_in_config);
const ccs = new ClosenessCentrality();

const
	sn_graph_300 = csv.readFromEdgeListFile(`${CSV_SN_PATH}/social_network_edges_300.csv`),
	sn_graph_1K = csv.readFromEdgeListFile(`${CSV_SN_PATH}/social_network_edges_1K.csv`);


describe('Performance tests - ', () => {
	[sn_graph_300].forEach(sn_graph => {
		test('should run the closeness centrality on social networks, should be same as FW', () => {

			/* Floyd Warshall version -> returns ARRAY */
			let tic = +new Date();
			const ccfw = ccs.getCentralityMapFW(sn_graph);
			let toc = +new Date();
			logger.log(`Closeness on graph of |V|=${sn_graph.nrNodes()} and |E|=${sn_graph.nrUndEdges()} using FW took ${toc - tic} ms to finish`);

			/* PFS version -> returns DICT */
			tic = +new Date();
			const ccpfs = ccs.getCentralityMap(sn_graph);
			toc = +new Date();
			logger.log(`Closeness on graph of |V|=${sn_graph.nrNodes()} and |E|=${sn_graph.nrUndEdges()} using PFS took ${toc - tic} ms to finish`);

			let ctr = 0;
			for (let key in ccpfs) {
				// console.log(`[${key}]: ${ccpfs[key]} - ${ccfw[ctr]}`);
				expect(ccpfs[key]).toBe(ccfw[ctr]);
				ctr++;
			}
		});
	});


	test('should run the closeness centrality on a ~1k social networks, just FW', () => {
		let tic = +new Date();
		const ccfw = ccs.getCentralityMapFW(sn_graph_1K);
		let toc = +new Date();
		logger.log(`Closeness on graph of |V|=${sn_graph_1K.nrNodes()} and |E|=${sn_graph_1K.nrUndEdges()} using FW took ${toc - tic} ms to finish`);
	});
		
});