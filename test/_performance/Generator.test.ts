import * as $KRON from "@/generators/KroneckerLeskovec";
import {Logger} from "@/utils/Logger";
const logger = new Logger();


test('Performance Test - should generate a slighly larger graph', () => {
	const cycles = 9;
	let cfg = {
		genMat: [[0.7, 0.5], [0.5, 0.7]],
		cycles
	};
	let gen = new $KRON.KROL(cfg);
	let synGraph = gen.generate().graph;
	logger.log(`Generated graph with |V|=${synGraph.nrNodes()} and |E|=${synGraph.nrUndEdges()} edges.`);
	expect(synGraph.nrNodes()).toBe(2**(cycles+1));
});
