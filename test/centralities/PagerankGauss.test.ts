import * as $G from '../../src/core/base/BaseGraph';
import { PagerankGauss } from '../../src/centralities/PagerankGauss';
import { ICSVInConfig, CSVInput } from '../../src/io/input/CSVInput';
import { JSONInput, IJSONInConfig } from '../../src/io/input/JSONInput';
import { Logger } from '../../src/utils/Logger';
import { CSV_DATA_PATH, CSV_CENT_PATH, CSV_SN_PATH, JSON_DATA_PATH } from '../config/test_paths';


const logger = new Logger();
const EPSILON = 1e-12;


const std_csv_in_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};

const std_json_in_config: IJSONInConfig = {
	explicit_direction: true,
	directed: true,
	weighted: false
};


let csv = new CSVInput(std_csv_in_config),
	json = new JSONInput(std_json_in_config),
	deg_cent_graph 	= `search_graph_pfs_extended.json`,
	graph_uw_ud			= `network_undirected_unweighted.csv`,
	graph: $G.IGraph = json.readFromJSONFile(JSON_DATA_PATH + '/' + deg_cent_graph),
	graph_und_unw = csv.readFromEdgeListFile(CSV_DATA_PATH + '/' + graph_uw_ud),
	PrGauss = new PagerankGauss();


describe("PageRank Gauss Tests", () => {

	test('should return correct betweenness map (directed: true)', () => {
		const controlResult = [
			0.1332312404287902,
			0.18376722817764174,
			0.17457886676875956,
			0.2787136294027564,
			0.18376722817764166,
			0.045941807044410435
		];
		let prd = PrGauss.getCentralityMap(graph);
		logger.log('PR Gauss result: ');

		const prdArr = Object.values(prd);
		for ( let i = 0; i < prdArr.length; i++ ) {
			expect(prdArr[i]).toBeGreaterThan(controlResult[i] - EPSILON);
			expect(prdArr[i]).toBeLessThan(controlResult[i] + EPSILON);
		}
	});


	/**
	 * What is this supposed to be doing !? Check Gauss against pre-calculated results !?
	 * same === correct !?
	 */
	test('should return the correct centrality score for each node. Tested on graphs with 2, 3 and 6 nodes respectively.', () => {
		let graph_2 = csv.readFromEdgeListFile(`${CSV_CENT_PATH}/centralities_equal_score_2.csv`);
		let graph_3 = csv.readFromEdgeListFile(`${CSV_CENT_PATH}/centralities_equal_score_3.csv`);
		let graph_6 = csv.readFromEdgeListFile(`${CSV_CENT_PATH}/centralities_equal_score_6.csv`);
		checkRankPrecision(graph_2, PrGauss.getCentralityMap(graph_2));
		checkRankPrecision(graph_3, PrGauss.getCentralityMap(graph_3));
		checkRankPrecision(graph_6, PrGauss.getCentralityMap(graph_6));
	});

});


/**
 *
 * @param graph
 * @param gauss
 *
 * @todo what does this do !?
 */
function checkRankPrecision(graph, gauss) {
	let last = gauss[0];
	let ctr = 0;
	for (let key in graph.getNodes()) {
		expect(gauss[ctr]).toBeGreaterThan(1 / graph.nrNodes() - EPSILON);
		expect(gauss[ctr]).toBeLessThan(1 / graph.nrNodes() + EPSILON);
		expect(gauss[ctr]).toBeGreaterThan(last - EPSILON);
		expect(gauss[ctr]).toBeLessThan(last + EPSILON);
		last = gauss[ctr++];
	}
}
