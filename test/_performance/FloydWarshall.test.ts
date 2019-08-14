import {FloydWarshallAPSP, FloydWarshallArray} from "../../src/search/FloydWarshall";
import * as $G from "../../src/core/base/BaseGraph";
import { CSV_SN_PATH, JSON_DATA_PATH } from '../config/config';
import {CSVInput, ICSVInConfig} from "../../src/io/input/CSVInput";
import {JSONInput, IJSONInConfig} from "../../src/io/input/JSONInput";

import {Logger} from '../../src/utils/Logger';
const logger = new Logger();

const csv_config: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false,
	weighted: false
};
const csv = new CSVInput(csv_config);

const json_in_config: IJSONInConfig = {
	explicit_direction: true,
	directed: false,
	weighted: true
};
const json = new JSONInput(json_in_config);

const
	graph_bernd: $G.IGraph = json.readFromJSONFile(`${JSON_DATA_PATH}/bernd_ares_pos.json`),
	graph_intermediate = json.readFromJSONFile(`${JSON_DATA_PATH}/bernd_ares_intermediate_pos.json`),
	graph_social = csv.readFromEdgeListFile(`${CSV_SN_PATH}/social_network_edges_1K.csv`);


describe('FW on several (slightly) larger graphs - ', () => {
	let FW_res;

	test('performance test of Floyd Warshal on a ~75 node / ~200 edge graph',() => {
			let d = +new Date();
			FW_res = FloydWarshallArray(graph_bernd);
			FW_res = FloydWarshallAPSP(graph_bernd);
			let e = +new Date();
			logger.log("Floyd on Bernd (75 nodes) took " + (e - d) + "ms to finish");
		}
	);


	test('performance test of FW implementation on 246 nodes)', () => {
		let d = +new Date();
		FW_res = FloydWarshallAPSP(graph_intermediate);
		let e = +new Date();
		logger.log("Floyd on intermediate graph (246 nodes) with SPs took " + (e - d) + "ms to finish");
		d = +new Date();
		FW_res = FloydWarshallArray(graph_intermediate);
		e = +new Date();
		logger.log("Floyd on intermediate graph without SPs (246 nodes, ARRAY version) took " + (e - d) + "ms to finish");
	});


	test('performance test of ~1k nodes and ~50k edges', () => {
		let d = +new Date();
		FW_res = FloydWarshallArray(graph_social);
		let e = +new Date();
		logger.log("Floyd on social network ~1k (Array version) took " + (e - d) + "ms to finish");
	});
});