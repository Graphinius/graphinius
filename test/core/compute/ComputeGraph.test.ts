import { CSV_SN_PATH, JSON_DATA_PATH } from "_/config/test_paths";

import * as $G from "@/core/base/BaseGraph";
import { MinAdjacencyListArray, MinAdjacencyListDict, NextArray } from "@/core/interfaces";
import { JSONInput } from "@/io/input/JSONInput";
import { CSVInput, ICSVInConfig } from "@/io/input/CSVInput";
import { ComputeGraph } from "@/core/compute/ComputeGraph";
import { BaseGraph } from "@/core/base/BaseGraph";

let sn_config: ICSVInConfig = {
  separator: " ",
  explicit_direction: false,
  direction_mode: false,
};

const small_graph_file = `${JSON_DATA_PATH}/small_graph.json`;
const triangle_graph_file = `${JSON_DATA_PATH}/triangle_graph.json`;
const triangle_directed = `${JSON_DATA_PATH}/triangle_directed.json`;

/**
 *
 */
describe("Adjacency List / Hash Tests - ", () => {
  let g: $G.IGraph,
    cg: ComputeGraph,
    adj_list: MinAdjacencyListDict,
    expected_result: MinAdjacencyListDict,
    jsonReader = new JSONInput({ explicit_direction: true, directed: false, weighted: true });

  beforeEach(() => {
    g = new $G.BaseGraph("testus");
    // g = jsonReader.readFromJSONFile(small_graph_file);
    cg = new ComputeGraph(g);
  });

  describe("Minimum Adjacency List generation Tests, DICT version - ", () => {
    test("should output an empty adjacency list for an empty graph", () => {
      g = new $G.BaseGraph("testus");
      cg = new ComputeGraph(g);
      expect(cg.adjListW()).toEqual({});
    });

    test("should produce a non-empty adj.list for the small example graph", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjListW();
      expect(adj_list).not.toBeUndefined();
      expect(adj_list).not.toEqual({});
    });

    test("should produce the correct adj.list without incoming edges", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjListW(false);
      expected_result = {
        A: { A: 7, B: 1, C: 0, D: -33 },
        B: { A: 3 },
        C: { A: 0 },
        D: { A: 6 },
      };
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce the correct adj.list including incoming edges", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjListW(true);
      expected_result = {
        A: { A: 7, B: 1, C: 0, D: -33 },
        B: { A: 1 },
        C: { A: 0 },
        D: { A: -33 },
      };
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce the correct adj.list including incoming edges & implicit self connection", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjListW(true, true);
      expected_result = {
        A: { A: 7, B: 1, C: 0, D: -33 },
        B: { A: 1, B: 0 },
        C: { A: 0, C: 0 },
        D: { A: -33, D: 0 },
      };
      expect(adj_list).toEqual(expected_result);
    });

    /**
     * In a state machine, the distance of a node to itself could
     * be set to 1 because the state would have to transition to itself...
     */
    test("should produce the correct adj.list with specific self-dist", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjListW(true, true, 1);
      expected_result = {
        A: { A: 1, B: 1, C: 0, D: -33 },
        B: { A: 1, B: 1 },
        C: { A: 0, C: 1 },
        D: { A: -33, D: 1 },
      };
      expect(adj_list).toEqual(expected_result);
    });

    /**
     * @todo what's the default for 'include_self'?
     */
    test("should produce the correct adj.list considering default weights", () => {
      jsonReader = new JSONInput({ explicit_direction: true, directed: false, weighted: false });
      g = jsonReader.readFromJSONFile(small_graph_file);
      cg = new ComputeGraph(g);
      adj_list = cg.adjListW(true);
      expected_result = {
        A: { A: 1, B: 1, C: 1, D: 1 },
        B: { A: 1 },
        C: { A: 1 },
        D: { A: 1 },
      };
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce the correct adj.list considering default weights", () => {
      jsonReader = new JSONInput({ explicit_direction: true, directed: false, weighted: false });
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjListW(true, true);

      expected_result = {
        A: { A: 1, B: 1, C: 1, D: 1 },
        B: { A: 1, B: 0 },
        C: { A: 1, C: 0 },
        D: { A: 1, D: 0 },
      };
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce a correct UNweighted adj.list for the triangle example graph", () => {
      g = jsonReader.readFromJSONFile(triangle_graph_file, g);
      adj_list = cg.adjListW();
      expected_result = {
        A: { B: 1, C: 1, D: 1 },
        B: { A: 1, C: 1, D: 1 },
        C: { A: 1, B: 1, D: 1, E: 1, F: 1 },
        D: { A: 1, B: 1, C: 1 },
        E: { C: 1 },
        F: { C: 1 },
      };
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce a correct UNweighted adj.list for the triangle DIRECTED graph", () => {
      g = new JSONInput({ explicit_direction: false, directed: true }).readFromJSONFile(triangle_directed, g);
      adj_list = cg.adjListW();
      expected_result = {
        A: { C: 1 },
        B: { A: 1, D: 1 },
        C: { B: 1, E: 1, F: 1 },
        D: { C: 1 },
        E: {},
        F: {},
      };
      expect(adj_list).toEqual(expected_result);
    });
  });

  /**
   * @todo how to deal with negative loops?
   */
  describe("Minimum Adjacency List generation Tests, ARRAY version", () => {
    let sn_300_graph_file = `${CSV_SN_PATH}/social_network_edges_300.csv`,
      graph: $G.IGraph,
      adj_list: MinAdjacencyListArray,
      sn_300_graph: $G.IGraph,
      expected_result: MinAdjacencyListArray,
      jsonReader = new JSONInput({ explicit_direction: true, directed: false, weighted: true }),
      csvReader = new CSVInput(sn_config),
      inf = Number.POSITIVE_INFINITY;

    test("should output an empty adjacency list for an empty graph", () => {
      expected_result = [];
      g = new BaseGraph("emptinius");
      cg = new ComputeGraph(g);
      expect(cg.adjMatrixW()).toEqual(expected_result);
    });

    test("should produce a non-empty adj.list for the small example graph", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjMatrixW();
      expect(adj_list).toBeDefined();
      expect(adj_list).not.toEqual([]);
    });

    test("should produce a correct UNweighted adj.list for the small example graph", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjMatrix();
      expected_result = [
        [0, 1, 1, 1],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
      ];
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce a correct UNweighted adj.list for the triangle example graph", () => {
      g = jsonReader.readFromJSONFile(triangle_graph_file, g);
      adj_list = cg.adjMatrix();
      expected_result = [
        [0, 1, 1, 1, 0, 0],
        [1, 0, 1, 1, 0, 0],
        [1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 1, 0, 0, 0],
      ];
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce a correct UNweighted adj.list for the triangle DIRECTED graph", () => {
      g = new JSONInput({ explicit_direction: false, directed: true }).readFromJSONFile(triangle_directed, g);
      adj_list = cg.adjMatrix();
      expected_result = [
        [0, 0, 1, 0, 0, 0],
        [1, 0, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 1],
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce the correct adj.list without incoming edges", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjMatrixW();
      expected_result = [
        [0, 1, 0, -33],
        [3, 0, inf, inf],
        [0, inf, 0, inf],
        [6, inf, inf, 0],
      ];
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce the correct adj.list including incoming edges", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjMatrixW(true);
      expected_result = [
        [0, 1, 0, -33],
        [1, 0, inf, inf],
        [0, inf, 0, inf],
        [-33, inf, inf, 0],
      ];
      expect(adj_list).toEqual(expected_result);
    });

    test("should produce the correct adj.list considering default weights", () => {
      jsonReader = new JSONInput({ explicit_direction: true, directed: false, weighted: false });
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      adj_list = cg.adjMatrixW(true);

      expected_result = [
        [0, 1, 1, 1],
        [1, 0, inf, inf],
        [1, inf, 0, inf],
        [1, inf, inf, 0],
      ];
      expect(adj_list).toEqual(expected_result);
    });
  });

  describe("Next array generation for FW etc.", () => {
    let search_graph_file = `${JSON_DATA_PATH}/search_graph_multiple_SPs_positive.json`,
      sn_300_graph_file = `${CSV_SN_PATH}/social_network_edges_300.csv`,
      sn_300_graph: $G.IGraph,
      // TODO invent better name for next/adj_list
      next: NextArray,
      expected_result: MinAdjacencyListArray,
      csvReader = new CSVInput(sn_config),
      jsonReader = new JSONInput({ explicit_direction: true, directed: false, weighted: true }),
      inf = Number.POSITIVE_INFINITY;

    test("should output an empty next array for an empty graph", () => {
      expected_result = [];
      expect(cg.adjMatrixW()).toEqual(expected_result);
    });

    test("should produce a non-empty next array for the small example graph", () => {
      g = jsonReader.readFromJSONFile(small_graph_file, g);
      next = cg.nextArray();
      expect(next).toBeDefined();
      expect(next).not.toEqual([]);
    });

    test("should produce the correct next array without incoming edges", () => {
      g = jsonReader.readFromJSONFile(search_graph_file, g);
      next = cg.nextArray();
      let expected_result = [
        [[0], [1], [2], [3], [null], [null]],
        [[0], [1], [2], [null], [4], [5]],
        [[0], [null], [2], [null], [4], [null]],
        [[null], [null], [2], [3], [4], [null]],
        [[null], [1], [null], [3], [4], [null]],
        [[null], [null], [2], [null], [4], [5]],
      ];

      expect(next).toEqual(expected_result);
    });

    test("should produce the correct next array including incoming edges", () => {
      g = jsonReader.readFromJSONFile(search_graph_file, g);
      next = cg.nextArray(true);
      let expected_result = [
        [[0], [1], [2], [3], [null], [null]],
        [[0], [1], [2], [null], [4], [5]],
        [[0], [1], [2], [3], [4], [5]],
        [[0], [null], [2], [3], [4], [null]],
        [[null], [1], [2], [3], [4], [5]],
        [[null], [1], [2], [null], [4], [5]],
      ];

      expect(next).toEqual(expected_result);
    });
  });
});
