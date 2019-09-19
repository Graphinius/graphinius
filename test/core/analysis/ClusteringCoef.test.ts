import {BaseGraph, IGraph} from '../../../src/core/base/BaseGraph';
import {TypedGraph} from '../../../src/core/typed/TypedGraph';
import {ComputeGraph, IComputeGraph} from '../../../src/core/compute/ComputeGraph';
import {JSONInput} from "../../../src/io/input/JSONInput";
import {JSON_DATA_PATH} from "../../config/test_paths";

const tf = require('@tensorflow/tfjs-node');
// console.log(tf);
console.log(tf.getBackend());

// import * as tfc from '@tensorflow/tfjs-core';
// console.log(tfc);


describe.skip('Clustering coefficient tests - ', () => {

	const small_graph_file = JSON_DATA_PATH + '/small_graph.json';

	let
		g: IGraph = null,
		cg: IComputeGraph = null;


	beforeEach(() => {
		expect(tf).toBeDefined;
	});


	describe('small graph - ', () => {

		beforeAll(() => {
			g = new JSONInput().readFromJSONFile(small_graph_file);
			cg = new ComputeGraph(g, tf);
		});


		it('should compute global clustering coefficient using TF', () => {
			// console.log(cg.clustCoef(tf));
		});

	});

});
