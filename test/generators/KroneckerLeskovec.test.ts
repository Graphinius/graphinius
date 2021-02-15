import * as $N from "@/core/base/BaseNode";
import * as $E from "@/core/base/BaseEdge";
import * as $G from "@/core/base/BaseGraph";
import * as $KRON from "@/generators/KroneckerLeskovec";

/**
 *
 */
describe("Base Tests", () => {
  test("should generate a standard config", () => {
    let gen = new $KRON.KROL();
    let cfg = gen.prepareKROLStandardConfig();
    expect(cfg).toEqual({
      genMat: [
        [0.9, 0.5],
        [0.5, 0.1],
      ],
      cycles: 5,
    });
  });

  /**
   * @todo what can we test besides the number of nodes?
   */
  test("should generate a graph from standard config", () => {
    let gen = new $KRON.KROL();
    let synGraph = gen.generate().graph;
    expect(synGraph.nrNodes()).toBe(64);
  });

  test("should generate a graph with 256 nodes", () => {
    let cfg = {
      genMat: [
        [0.9, 0.5],
        [0.5, 0.1],
      ],
      cycles: 4,
    };
    let gen = new $KRON.KROL(cfg);
    let synGraph = gen.generate().graph;
    expect(synGraph.nrNodes()).toBe(32);
  });
});
