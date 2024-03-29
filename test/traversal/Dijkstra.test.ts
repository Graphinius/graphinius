import * as $G from "@/core/base/BaseGraph";
import { JSONInput } from "@/io/input/JSONInput";
import * as $Dijkstra from "@/traversal/Dijkstra";
import * as $PFS from "@/traversal/PFS";

import { JSON_DATA_PATH } from "_/config/test_paths";

const json = new JSONInput({ explicit_direction: true, directed: false, weighted: true }),
  search_graph = `${JSON_DATA_PATH}/search_graph_pfs_extended.json`,
  graph: $G.IGraph = json.readFromJSONFile(search_graph);

let PFSSpy, PFSPrepareConfigSpy;

/**
 * come up with more tests
 */
describe("Dijkstra TESTS - ", () => {
  beforeAll(() => {
    expect(graph).not.toBeUndefined();
    expect(graph.nrNodes()).toBe(6);
    expect(graph.nrUndEdges()).toBe(2);
    expect(graph.nrDirEdges()).toBe(12);
  });

  beforeEach(() => {
    PFSSpy = jest.spyOn($PFS, "PFS");
    PFSPrepareConfigSpy = jest.spyOn($PFS, "preparePFSStandardConfig");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should call PFS in the background - ", () => {
    $Dijkstra.Dijkstra(graph, graph.getRandomNode());
    expect(PFSSpy).toHaveBeenCalledTimes(1);
    expect(PFSPrepareConfigSpy).toHaveBeenCalledTimes(1);
  });

  it("should accept a target node", () => {
    $Dijkstra.Dijkstra(graph, graph.getRandomNode(), graph.getRandomNode());
  });

  it.todo("should stop when reaching the target node");

  it.todo("should get the right distance to target node");
});
