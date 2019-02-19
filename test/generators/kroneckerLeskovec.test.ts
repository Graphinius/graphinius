import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $KRON from '../../src/generators/kroneckerLeskovec';
import { Logger } from '../../src/utils/logger';

const logger = new Logger();


describe("Base Tests", () => {
    test('should generate a standard config', () => {
        var gen = new $KRON.KROL();
        var cfg = gen.prepareKROLStandardConfig();
        expect(cfg).toEqual({
            genMat: [[0.9, 0.5], [0.5, 0.1]],
            cycles: 5
        });
    });

    test('should generate a graph from standard config', () => {
        var gen = new $KRON.KROL();
        var synGraph = gen.generate().graph;
        expect(synGraph.nrNodes() ).toBe(64);
        // TODO: what can we test besides the number of nodes?
    });

    test('should generate a graph with 256 nodes', () => {
        var cfg = {
            genMat: [[0.9, 0.5], [0.5, 0.1]],
            cycles: 7
        };
        var gen = new $KRON.KROL(cfg);
        var synGraph = gen.generate().graph;
        expect(synGraph.nrNodes() ).toBe(256);
    });
    

    test.skip('Performance Test - should generate a graph with 2^13 nodes', () => {
        var cfg = {
            genMat: [[0.7, 0.5], [0.5, 0.7]],
            cycles: 12
        };
        var gen = new $KRON.KROL(cfg);
        var synGraph = gen.generate().graph;
        logger.log(`Graph has ${synGraph.nrUndEdges()} edges.`)
        expect(synGraph.nrNodes()).toBe(1024*8);
    });
});
