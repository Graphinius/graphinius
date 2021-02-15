import { scoreSimFuncs } from "@/similarities/ScoreSimilarities";
import { setSimFuncs } from "@/similarities/SetSimilarities";

const
	a = [3, 8, 7, 5, 2, 9],
	b = [10, 8, 6, 6, 4, 5],
	s_a = new Set(a),
	s_b = new Set(b),
	SUPER_SIZE = 1e6;

let i = 0;


describe('similarities performance tests - ', () => {

	it('should compute a great amount of COSINES between two short vectors', () => {
		const tic = +new Date;
		for (let i = 0; i < SUPER_SIZE; i++) scoreSimFuncs.cosine(a, b);
		const toc = +new Date;
		console.log(`1e5 iterations of cosine on 5-dim vectors took ${toc - tic} ms.`);
	});

	it('should compute a great amount of EUCLIDEANs between two short vectors', () => {
		const tic = +new Date;
		for (let i = 0; i < SUPER_SIZE; i++) scoreSimFuncs.euclidean(a, b);
		const toc = +new Date;
		console.log(`1e5 iterations of euclidean on 5-dim vectors took ${toc - tic} ms.`);
	});

	it('should compute a great amount of PEARSONs between two short vectors', () => {
		const tic = +new Date;
		for (let i = 0; i < SUPER_SIZE; i++) scoreSimFuncs.pearson(a, b);
		const toc = +new Date;
		console.log(`1e5 iterations of pearson on 5-dim vectors took ${toc - tic} ms.`);
	});

	it('should compute a great amount of OVERLAPs between two short vectors', () => {
		const tic = +new Date;
		for (let i = 0; i < SUPER_SIZE; i++) setSimFuncs.overlap(s_a, s_b);
		const toc = +new Date;
		console.log(`1e5 iterations of overlap on 5-dim vectors took ${toc - tic} ms.`);
	});

	it('should compute a great amount of JACCARDSs between two short vectors', () => {
		const tic = +new Date;
		for (let i = 0; i < SUPER_SIZE; i++) setSimFuncs.jaccard(s_a, s_b);
		const toc = +new Date;
		console.log(`1e5 iterations of jaccard on 5-dim vectors took ${toc - tic} ms.`);
	});

});