/**
 * For graphs larger than ~375k nodes and ~1.5M edges,
 * extend the NodeJS heap size manually by invoking
 * --max_old_space_size=4096 (size in megabytes)
 * (NodeJS standard heap size is limited to 1.7 GB)
 */
import * as fs from 'fs';
import { CSVInput, ICSVInConfig } from '../../lib/io/input/CSVInput';
import { CSV_PERF_PATH, OUTPUT_PATH } from '../config/test_paths';
import { Logger } from "../../lib/utils/Logger";
import { IGraph } from "../../lib/core/base/BaseGraph";
import { DegreeCentrality, DegreeDistribution } from '../../lib/centralities/Degree';
import { BFS } from "../../lib/traversal/BFS";
import { DFS } from "../../lib/traversal/DFS";
import { PFS } from "../../lib/traversal/PFS";
import { Pagerank, PagerankRWConfig } from "../../lib/centralities/Pagerank";
import { SimplePerturber } from "../../lib/perturbation/SimplePerturbations";


const logger = new Logger();
const dc = new DegreeCentrality();

const csvInConfig: ICSVInConfig = {
	separator: ' ',
	explicit_direction: false,
	direction_mode: false
};


/**
 * For sake of runtime efficiency, the following tests are NOT ISOLATED
 */
describe('SCC Tests - ', () => {
	const SCCFiles = fs.readdirSync(CSV_PERF_PATH);

	let
		SCCGraphs: Map<string, IGraph> = new Map(),
		csvIn = new CSVInput(csvInConfig);


	beforeAll(() => {
		SCCFiles.forEach(scc_file => {
			const tic = +new Date;
			const graph = csvIn.readFromEdgeListFile(CSV_PERF_PATH + '/' + scc_file);
			SCCGraphs.set(scc_file, graph);
			const toc = +new Date;
			logger.log(`Reading in graph ${scc_file} with |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic} ms.`);
		});
		expect(SCCGraphs.size).toBe(3);
	});


	it(`Load time (input) for graphs`, () => {
		SCCFiles.forEach(scc_file => {
			const tic = +new Date;
			let graph = csvIn.readFromEdgeListFile(CSV_PERF_PATH + '/' + scc_file);
			const toc = +new Date;
			logger.log(`Reading in graph ${scc_file} with |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic} ms.`);
		});
	});


	it(`Degree distributions`, () => {
		SCCGraphs.forEach(graph => {
			const tic = +new Date;
			dc.degreeDistribution(graph);
			const toc = +new Date;
			logger.log(`Degree distribution for graph with |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic} ms.`);
		});
	});


	[BFS, DFS, PFS].forEach(traversal => {
		it(`${traversal.name}`, () => {
			SCCGraphs.forEach(graph => {
				const tic = +new Date;
				traversal(graph, graph.getRandomNode());
				const toc = +new Date;
				logger.log(`${traversal.name} for graph with |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic} ms.`);
			});
		});
	});


	it(`Pagerank (unweighted)`, () => {
		SCCGraphs.forEach(graph => {
			const tic = +new Date;
			const PR = new Pagerank(graph, { epsilon: 1e-4, normalize: true });
			const result = PR.computePR();
			const toc = +new Date;
			// fs.writeFileSync(`${OUTPUT_PATH}/pagerank_result_${graph.label}.json`, JSON.stringify(result));
			logger.log(`Pagerank (UNweighted) on graph with |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic} ms.`);
		});
	});


	it('Perturbation - Adding nodes with edges', () => {
		const nrAddNodes = Math.floor(Math.random() * 300);
		const probEdge = Math.random() * 0.003;
		SCCGraphs.forEach(graph => {
			const PT = new SimplePerturber(graph);
			const tic = +new Date;
			PT.addNodesAmount(nrAddNodes, { probability_und: probEdge });
			const toc = +new Date;
			logger.log(`Adding ${nrAddNodes} nodes & introducing new edges with p=${probEdge} on graph with |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic} ms.`);
		});
	});


	it('Perturbation - Deleting nodes & edges', () => {
		SCCGraphs.forEach(graph => {
			const PT = new SimplePerturber(graph);
			const tic = +new Date;
			PT.deleteUndEdgesAmount(graph.nrNodes() / 2);
			const toc = +new Date;
			logger.log(`Cutting nodes in half on graph with |V|=${graph.nrNodes()} and |E|=${graph.nrUndEdges()} took ${toc - tic} ms.`);
		});
	});

});
