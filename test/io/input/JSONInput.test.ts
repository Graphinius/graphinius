import { JSON_DATA_PATH } from "_/config/test_paths";

import * as $C from "./common";
import { GraphMode, GraphStats } from "@/core/interfaces";
import { BaseGraph, IGraph } from "@/core/base/BaseGraph";
import { JSONInput, IJSONInConfig } from "@/io/input/JSONInput";
import { JSONOutput } from "@/io/output/JSONOutput";
import { labelKeys } from "@/io/interfaces";
import { TypedNode } from "@/core/typed/TypedNode";
import { TypedGraph } from "@/core/typed/TypedGraph";
import { ITypedEdge, TypedEdge } from "@/core/typed/TypedEdge";

import { Logger } from "@/utils/Logger";
const logger = new Logger();

let REAL_GRAPH_NR_NODES = 6204,
  REAL_GRAPH_NR_EDGES = 18550,
  small_graph = `${JSON_DATA_PATH}/small_graph.json`,
  small_graph_2N_flawed = `${JSON_DATA_PATH}/small_graph_2N_flawed.json`,
  small_graph_no_features = `${JSON_DATA_PATH}/small_graph_no_features.json`,
  small_graph_weights_crap = `${JSON_DATA_PATH}/small_graph_weights_crap.json`,
  real_graph = `${JSON_DATA_PATH}/real_graph.json`,
  extreme_weights_graph = `${JSON_DATA_PATH}/extreme_weights_graph.json`;

const DEFAULT_WEIGHT: number = 1;

/**
 *
 */
describe("GRAPH JSON INPUT TESTS", () => {
  let json: JSONInput, graph: IGraph, stats: GraphStats;

  describe("Basic instantiation tests - ", () => {
    it("should correctly instantiate a default version of JSONInput", () => {
      json = new JSONInput();
      expect(json).toBeInstanceOf(JSONInput);
      expect(json._config.explicit_direction).toBe(true);
      expect(json._config.directed).toBe(false);
      expect(json._config.weighted).toBe(false);
      expect(json._config.dupeCheck).toBe(true);
    });

    it("should take a custom configuration", () => {
      json = new JSONInput({ explicit_direction: false, directed: true, weighted: true, dupeCheck: false });
      expect(json).toBeInstanceOf(JSONInput);
      expect(json._config.explicit_direction).toBe(false);
      expect(json._config.directed).toBe(true);
      expect(json._config.weighted).toBe(true);
      expect(json._config.dupeCheck).toBe(false);
    });

    it("should throw an error in case of non-existing referenced node", function () {
      graph = new BaseGraph("emptinius");
      json = new JSONInput();
      expect(() => json.getTargetNode(graph, { [labelKeys.e_to]: "meNonExists" })).toThrow(
        "Node referenced by edge does not exist"
      );
    });

    it("should omit duplicate edges by default", () => {
      graph = new JSONInput().readFromJSONFile(small_graph);
      logger.log(graph.stats);
      expect(graph.nrUndEdges()).toBe(2);
    });

    it("should be able to switch off dupe checking", () => {
      graph = new JSONInput({ dupeCheck: false }).readFromJSONFile(small_graph);
      logger.log(graph.stats);
      expect(graph.nrUndEdges()).toBe(4);
    });
  });

  describe("Small test graph", () => {
    test("should correctly generate our small example graph out of a JSON file with explicitly encoded edge directions", () => {
      json = new JSONInput();
      graph = json.readFromJSONFile(small_graph);
      $C.checkSmallGraphStats(graph);
    });

    test("should correctly generate our small example graph out of a JSON file with direction _mode set to undirected", () => {
      json = new JSONInput();
      json._config.explicit_direction = false;
      json._config.directed = false;
      graph = json.readFromJSONFile(small_graph);
      expect(graph.nrNodes()).toBe(4);
      expect(graph.nrDirEdges()).toBe(0);
      expect(graph.nrUndEdges()).toBe(4);
    });

    test("should correctly generate our small example graph out of a JSON file with direction _mode set to directed", () => {
      json = new JSONInput();
      json._config.explicit_direction = false;
      json._config.directed = true;
      graph = json.readFromJSONFile(small_graph);
      expect(graph.nrNodes()).toBe(4);
      expect(graph.nrDirEdges()).toBe(7);
      expect(graph.nrUndEdges()).toBe(0);
    });
  });

  /**
   * Test for coordinates - take the 'small_graph.json'
   * which contains x, y, z coords and check for their
   * exact values upon instantiation (cloning?)
   */
  describe("Node coordinates - ", () => {
    test("should correctly read the node coordinates contained in a json file", () => {
      json = new JSONInput();
      json._config.explicit_direction = false;
      json._config.directed = false;
      graph = json.readFromJSONFile(small_graph);
      $C.checkSmallGraphCoords(graph);
    });

    test("should not assign the coords feature if no coordinates are contained in a json file", () => {
      json = new JSONInput();
      json._config.explicit_direction = false;
      json._config.directed = false;
      graph = json.readFromJSONFile(small_graph_no_features);
      let nodes = graph.getNodes();
      for (let node_idx in nodes) {
        expect(nodes[node_idx].getFeature(labelKeys.coords)).toBeUndefined();
      }
    });
  });

  /**
   * Test for features - take the 'small_graph.json'
   * which contains some feature vectors and check for their
   * exact values upon instantiation (cloning?)
   */
  describe("Node features - ", () => {
    test("should correctly read the node features contained in a json file", () => {
      json = new JSONInput();
      json._config.explicit_direction = false;
      json._config.directed = false;
      graph = json.readFromJSONFile(small_graph);
      $C.checkSmallGraphFeatures(graph);
    });

    test("should not assign any features if no `features` entry is contained in a json file", () => {
      json = new JSONInput();
      json._config.explicit_direction = false;
      json._config.directed = false;
      graph = json.readFromJSONFile(small_graph_no_features);
      let nodes = graph.getNodes();
      for (let node_idx in nodes) {
        expect(Object.keys(nodes[node_idx].getFeatures()).length).toBe(0);
      }
    });
  });

  /**
   * @todo think about how to handle DEFAULT_WEIGHT in this scenario...
   */
  describe("Edge labels & types (TYPED graph) - ", () => {
    const graphFile = `./data/output/edgeLabelTypeGraph.json`;
    /**
     * This is the ID that will be automatically assigned by JSONInput
     *
     * @todo make consistent!
     */
    const nodeType = `PERSON`;
    const edgeID = `A_B_u`;
    const secondID = `B_A_u`;
    const edgeLabel = `food friends`;
    const edgeType = `FRIENDS_WITH`;
    const jsonOut = new JSONOutput();
    const jsonIn = new JSONInput();
    let n_a, n_b;

    beforeEach(() => {
      graph = new TypedGraph("Edgus Labellius");
      n_a = graph.addNodeByID("A", { type: nodeType });
      n_b = graph.addNodeByID("B", { type: nodeType });
    });

    it("should retrieve correct node type", function () {
      jsonOut.writeToJSONFile(graphFile, graph);
      const inGraph = jsonIn.readFromJSONFile(graphFile, new TypedGraph("in"));
      const inNode = inGraph.getNodeById("A") as TypedNode;
      expect(inNode.type).toBe(nodeType);
    });

    it("should retrieve edge ID as label", () => {
      graph.addEdgeByID(edgeID, n_b, n_a);
      jsonOut.writeToJSONFile(graphFile, graph);
      const inGraph = jsonIn.readFromJSONFile(graphFile, new TypedGraph("in"));
      const inEdge = inGraph.getEdgeById(edgeID) as TypedEdge;
      expect(inEdge.label).toBe(edgeID);
    });

    it("should retrieve correct edge label", () => {
      graph.addEdgeByID(edgeID, n_b, n_a, { label: edgeLabel });
      jsonOut.writeToJSONFile(graphFile, graph);
      const inGraph = jsonIn.readFromJSONFile(graphFile, new TypedGraph("in"));
      const inEdge = inGraph.getEdgeById(edgeID) as TypedEdge;
      expect(inEdge.label).toBe(edgeLabel);
    });

    it("should retrieve correct edge type", () => {
      graph.addEdgeByID(edgeID, n_b, n_a, { type: edgeType });
      jsonOut.writeToJSONFile(graphFile, graph);
      const inGraph = jsonIn.readFromJSONFile(graphFile, new TypedGraph("in"));
      const inEdge = inGraph.getEdgeById(edgeID) as TypedEdge;
      expect(inEdge.type).toBe(edgeType);
    });
  });

  /**
   * Test for weights - take the 'small_graph_weights.json'
   * which contains weights for each edge and check for their
   * exact (number) values upon instantiation
   */
  describe("Edge weights - ", () => {
    beforeEach(() => {
      json = new JSONInput();
      json._config.explicit_direction = true;
    });

    test("should correctly read the edge weights contained in a json file", () => {
      // set all to weighted: true (weight will be set to 0)
      json._config.weighted = true;
      graph = json.readFromJSONFile(small_graph);
      $C.checkSmallGraphEdgeWeights(graph);
    });

    test("should correctly set edge weights to undefined if in unweighted _mode", () => {
      json._config.weighted = false;
      graph = json.readFromJSONFile(small_graph);
      let und_edges = graph.getUndEdges();
      for (let edge in und_edges) {
        expect(graph.getEdgeById(edge).isWeighted()).toBe(false);
        expect(graph.getEdgeById(edge).getWeight()).toBeUndefined();
      }
      let dir_edges = graph.getDirEdges();
      for (let edge in dir_edges) {
        expect(graph.getEdgeById(edge).isWeighted()).toBe(false);
        expect(graph.getEdgeById(edge).getWeight()).toBeUndefined();
      }
    });

    test("should correctly set edge weights to default of 1 if info contained in json file is crappy", () => {
      json._config.weighted = true;
      graph = json.readFromJSONFile(small_graph_weights_crap);
      let und_edges = graph.getUndEdges();
      for (let edge in und_edges) {
        expect(graph.getEdgeById(edge).isWeighted()).toBe(true);
        expect(graph.getEdgeById(edge).getWeight()).toBe(1);
      }
      let dir_edges = graph.getDirEdges();
      for (let edge in dir_edges) {
        expect(graph.getEdgeById(edge).isWeighted()).toBe(true);
        expect(graph.getEdgeById(edge).getWeight()).toBe(1);
      }
    });

    describe("should be able to handle extreme edge weight cases", () => {
      beforeEach(() => {
        json._config.weighted = true;
        graph = json.readFromJSONFile(extreme_weights_graph);
      });

      test('should correctly set edge weight of "undefined" to DEFAULT_WEIGHT of 1', () => {
        expect(graph.getEdgeById("A_A_d").getWeight()).toBe(DEFAULT_WEIGHT);
      });

      test('should correctly set edge weight of "Infinity" to Number.POSITIVE_INFINITY', () => {
        expect(graph.getEdgeById("A_B_d").getWeight()).toBe(Number.POSITIVE_INFINITY);
      });

      test('should correctly set edge weight of "-Infinity" to Number.NEGATIVE_INFINITY', () => {
        expect(graph.getEdgeById("A_C_d").getWeight()).toBe(Number.NEGATIVE_INFINITY);
      });

      test('should correctly set edge weight of "MAX" to Number.MAX_VALUE', () => {
        expect(graph.getEdgeById("A_D_d").getWeight()).toBe(Number.MAX_VALUE);
      });

      test('should correctly set edge weight of "MIN" to Number.MIN_VALUE', () => {
        expect(graph.getEdgeById("A_E_d").getWeight()).toBe(Number.MIN_VALUE);
      });
    });
  });
});
