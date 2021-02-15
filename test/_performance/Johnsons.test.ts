import * as $FW from "@/traversal/FloydWarshall";
import * as $JO from "@/traversal/Johnsons";
import { Logger } from "@/utils/Logger";
import { CSVInput, ICSVInConfig } from "@/io/input/CSVInput";
import { IJSONInConfig, JSONInput } from "@/io/input/JSONInput";
import * as $G from "@/core/base/BaseGraph";

import { CSV_SN_PATH, JSON_DATA_PATH } from "_/config/test_paths";

const logger = new Logger();

const csv_config: ICSVInConfig = {
  separator: " ",
  explicit_direction: false,
  direction_mode: false,
  weighted: false,
};
const csv = new CSVInput(csv_config);

const json_in_config: IJSONInConfig = {
  explicit_direction: true,
  directed: false,
  weighted: true,
};
const json = new JSONInput(json_in_config);

const graph_bernd: $G.IGraph = json.readFromJSONFile(`${JSON_DATA_PATH}/bernd_ares_pos.json`),
  graph_intermediate = json.readFromJSONFile(`${JSON_DATA_PATH}/bernd_ares_intermediate_pos.json`),
  graph_social = csv.readFromEdgeListFile(`${CSV_SN_PATH}/social_network_edges_1K.csv`);

describe("Johnsons performance tests - ", () => {
  test("on midsize graphs, runtime of Johnsons should be faster than Floyd-Warshall", () => {
    let startF = +new Date();
    $FW.FloydWarshallAPSP(graph_intermediate);
    let endF = +new Date();
    let runtimeF = endF - startF;

    let startJ = +new Date();
    $JO.Johnsons(graph_intermediate);
    let endJ = +new Date();
    let runtimeJ = endJ - startJ;

    expect(runtimeF).toBeGreaterThan(runtimeJ);
    logger.log(
      "On the midsize graph, Johnsons was " +
        runtimeF / runtimeJ +
        " times faster than FW." +
        "runtime Johnsons: " +
        runtimeJ +
        " ms, runtime FW: " +
        runtimeF +
        " ms."
    );
  });

  /**
   * @todo extremely slow !!!
   */
  test.skip("on large all-positive graphs, runtime of Johnsons should be faster than Floyd-Warshall", () => {
    let startF = +new Date();
    $FW.FloydWarshallAPSP(graph_social);
    let endF = +new Date();
    //runtimes are always in ms
    let runtimeF = endF - startF;

    let startJ = +new Date();
    $JO.Johnsons(graph_social);
    let endJ = +new Date();
    let runtimeJ = endJ - startJ;

    expect(runtimeF).toBeGreaterThan(runtimeJ);
    logger.log(
      "On the social graph, Johnsons was " +
        runtimeF / runtimeJ +
        " times faster than FW." +
        "runtime Johnsons: " +
        runtimeJ +
        " ms, \nruntime FW: " +
        runtimeF +
        " ms."
    );
  });
});
