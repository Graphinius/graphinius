import {JSON_DATA_PATH, JSON_REC_PATH} from "../config/test_paths";
import {JSONInput} from "../../src/io/input/JSONInput";
import {ComputeGraph} from "../../src/core/compute/ComputeGraph";

import {Logger} from "../../src/utils/Logger";

const logger = new Logger();

const tf = require('@tensorflow/tfjs-node');
console.log(tf.getBackend());

const json = new JSONInput({
	explicit_direction: false,
	directed: true,
	weighted: false
});

const beer_graph_file = `${JSON_REC_PATH}/beerGraph.json`;
const jobs_graph_file = `${JSON_REC_PATH}/jobs.json`;
const meetup_graph_file = `${JSON_REC_PATH}/meetupGraph.json`;


describe('transitivity - clustering coefficient performance tests - ', () => {

	const jobsGraph = json.readFromJSONFile(jobs_graph_file);
	const beerGraph = json.readFromJSONFile(beer_graph_file);
	// const meetupGraph = json.readFromJSONFile(meetup_graph_file);
	let cg;
	let tic, toc;


	beforeAll(() => {
		// console.log(jobsGraph.stats);
		// console.log(beerGraph.stats);
	});


	/**
	 * @TODO figure out why the beer graph seems to have transitivity / CCs of ALL ZERO... !?
	 */
	[jobsGraph, beerGraph].forEach(graph => { // meetupGraph -> explodes the heap ;-)

		it('computes the transitivity of a recommender graph', (done) => {
			cg = new ComputeGraph(graph, tf);
			tic = Date.now();
			cg.globalCC(true).then(res => {
				toc = Date.now();
				// console.log(res);
				logger.log(`Computing transitivity (TF) on ${graph.label} took ${toc - tic} ms.`);
				done();
			});
		});


		it('computes the local clustering coefficients of a recommender graph', (done) => {
			cg = new ComputeGraph(graph, tf);
			tic = Date.now();
			cg.localCC(true).then(res => {
				toc = Date.now();
				// console.log(res);
				logger.log(`Computing CC (TF) on ${graph.label} took ${toc - tic} ms.`);
				done();
			});
		});

	});

});
