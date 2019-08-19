import {JSON_REC_PATH} from "../config/config";
import {JSONInput} from "../../src/io/input/JSONInput";
import {TypedGraph} from "../../src/core/typed/TypedGraph";
import {Logger} from "../../src/utils/Logger";
import {IGraph} from "../../src/core/base/BaseGraph";

const logger = new Logger();

describe('typed graph performance - ', () => {

	let graph: IGraph;

	it('PERFORMANCE: should read meetupGraph from neo4j example in reasonable time', () => {
		const graphFile = JSON_REC_PATH + '/meetupGraph.json';

		const tic = +new Date;
		graph = new JSONInput({dupeCheck: false}).readFromJSONFile(graphFile, graph) as TypedGraph;
		const toc = +new Date;

		logger.log(`Reading in TypedGraph from Neo4j meetup example took: ${toc - tic} ms.`);
		logger.log(graph.stats);
	});

});
