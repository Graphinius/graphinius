import {BaseGraph, IGraph} from '../../../src/core/base/BaseGraph';
import {TypedGraph} from '../../../src/core/typed/TypedGraph';
import {ComputeGraph, IComputeGraph} from '../../../src/core/compute/ComputeGraph';
import {JSONInput} from "../../../src/io/input/JSONInput";
import {JSON_DATA_PATH} from "../../config/test_paths";

import {Logger} from "../../../src/utils/Logger";
const logger = new Logger();


const tf = require('@tensorflow/tfjs-node');
// console.log(tf);
console.log(tf.getBackend());

// import * as tfc from '@tensorflow/tfjs-core';
// console.log(tfc);



describe('Clustering coefficient tests - ', () => {

	const small_graph_file = JSON_DATA_PATH + '/small_graph.json';
	const triangle_graph_file = `${JSON_DATA_PATH}/triangle_graph.json`;
	const triangle_directed = `${JSON_DATA_PATH}/triangle_directed.json`;


	let
		g: IGraph = null,
		cg: IComputeGraph = null;


	beforeEach(() => {
		expect(tf).toBeDefined;
	});


	describe('small & triangle graph - ', () => {

		it('triangle Counting should throw an error if not handed a TF handle', () => {
			cg = new ComputeGraph(g);
			expect(cg.triangleCount()).rejects.toEqual(new Error("Tensorflow & TF matMul function must be present in order to compute transitivity."));
		});


		it('transitivity should throw an error if not handed a TF handle', () => {
			cg = new ComputeGraph(g);
			expect(cg.globalCC()).rejects.toEqual(new Error("Tensorflow & TF matMul function must be present in order to compute transitivity."));
		});


		it('CC should throw an error if not handed a TF handle', () => {
			cg = new ComputeGraph(g);
			expect(cg.localCC()).rejects.toEqual(new Error("Tensorflow & TF matMul function must be present in order to compute clustering coef."));
		});
		

		/**
		 * @description friends of your friends are likely to be(come) friends as well...
		 */
		describe('transitivity UN-directed', () => {

			beforeEach(() => {
				g = new BaseGraph('triangulus');
				cg = new ComputeGraph(g, tf);
			});


			/**
			 * @todo consider the self-loops
			 */
			it('should compute triad counts on small graph ', () => {
				g = new JSONInput({explicit_direction: false, directed: false}).readFromJSONFile(small_graph_file, g);
				// logger.log(g.stats);
				// logger.log(g.getUndEdges());
				const res = cg.triadCount();
				expect(res).toBe(3);
			});


			it('should compute triangle counts on small graph ', (done) => {
				g = new JSONInput({explicit_direction: false, directed: false}).readFromJSONFile(small_graph_file, g);
				cg.triangleCount().then(res => {
					expect(res).toBe(0);
					done();
				});
			});


			it('should compute UNdirected transitivity on small graph ', (done) => {
				g = new JSONInput().readFromJSONFile(small_graph_file, g);
				cg.globalCC().then(res => {
					// console.log(res);
					expect(res).toBe(0);
					done();
				});
			});


			it('should compute triad counts on triangle graph ', () => {
				g = new JSONInput().readFromJSONFile(triangle_graph_file, g);
				const res = cg.triadCount();
				expect(res).toBe(19);
			});


			/**
			 * @todo should we take the direction explicitly or not?
			 *       -> computing on UNdirected adj_list AND directed one?
			 */
			it('should compute triangle counts on triangle graph ', (done) => {
				g = new JSONInput().readFromJSONFile(triangle_graph_file, g);
				cg.triangleCount().then(res => {
					expect(res).toBe(4);
					done();
				});
			});


			it('should compute UNdirected transitivity on triangle graph ', (done) => {
				g = new JSONInput().readFromJSONFile(triangle_graph_file, g);
				cg.globalCC().then(res => {
					// console.log(res);
					expect(res).toBe(0.631578947368421);
					done();
				});
			});

		});


		/**
		 * @description “Your followers are likely to follow common targets"
		 * @description frequency of loops of length two in a directed network: `reciprocity`
		 */
		describe('transitivity DIRECTED - ', () => {

			beforeAll(() => {
				g = new JSONInput({explicit_direction: false, directed: true}).readFromJSONFile(triangle_directed);
				cg = new ComputeGraph(g, tf);
			});


			it('should compute triad counts on triangle graph ', () => {
				const res = cg.triadCount(true);
				expect(res).toBe(10);
			});


			it('should compute triangle counts on triangle graph ', (done) => {
				cg.triangleCount(true).then(res => {
					expect(res).toBe(2);
					done();
				});
			});


			/**
			 * @todo networkx says 0.4...
			 */
			it('should compute DIRECTED transitivity on triangle graph ', (done) => {
				cg.globalCC(true).then(res => {
					// console.log(res);
					expect(res).toBe(0.6);
					done();
				});
			});

		});


		/**
		 * Self loops are ignored.
		 */
		describe('clustering coefficient (UN)directed - ', () => {

			beforeEach(() => {
				g = null;
				cg = null;
			});


			it('should compute local clustering coefficients per node', (done) => {
				g = new JSONInput().readFromJSONFile(triangle_graph_file);
				cg = new ComputeGraph(g, tf);
				const clust_exp = {0: 1.0, 1: 1.0, 2: 0.3, 3: 1.0, 4: 0, 5: 0};
				cg.localCC().then(clust => {
					// console.log(clust);
					expect(clust).toEqual(clust_exp);
					done();
				});
			});


			/**
			 * @todo in order to match networkx results, we have to multiply the directed results by 2...
			 * 			 -> shouldn't this be the other way around?
			 * 			 -> seems we're already over-compensating for th
			 */
			it('should compute DIRECTED local clustering coefficients per node', (done) => {
				g = new JSONInput({explicit_direction: false, directed: true}).readFromJSONFile(triangle_directed);
				cg = new ComputeGraph(g, tf);
				const clust_exp = {0: 1.0, 1: 0.6666666666666666, 2: 0.2, 3: 1.0, 4: 0, 5: 0};
				cg.localCC(true).then(clust => {
					console.log(clust);
					expect(clust).toEqual(clust_exp);
					done();
				});
			});

		});

	});

});
