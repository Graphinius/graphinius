/**
 * @jest-environment jsdom
 */
import * as $CI from '../../../src/io/input/CSVInput';
import * as $JI from '../../../src/io/input/JSONInput';
import * as $R from '../../../src/utils/remoteUtils';


const REMOTE_HOST = "raw.githubusercontent.com";
const REMOTE_PATH = "/cassinius/graphinius-demo/master/test_data/json/";
const JSON_EXTENSION = ".json";

let CSV_IN = $CI.CSVInput;
let JSON_IN = $JI.JSONInput;
let config : $R.RequestConfig;


describe('NO Browser environment supported - should use native fetch instead - ', () => {
  beforeEach(() => {
    config = {
      remote_host: REMOTE_HOST,
      remote_path: REMOTE_PATH,
      file_name: "small_graph" + JSON_EXTENSION
    };
  });


  test('Should throw an error if in Browser environment', () => {
    expect($R.checkNodeEnvironment.bind($R.checkNodeEnvironment)).toThrow('When in Browser, do as the Browsers do! (use fetch and call readFromJSON() directly...)');
  })


  /**
   * Actually, the test above should cover the following test cases as well.
   * Just left them here to make sure our CSV/JSON loaders don't do anything fishy...
   */
  test('should throw an error when trying to load a CSV adjacency list', () => {
    let csv = new CSV_IN();
    expect( csv.readFromAdjacencyListURL.bind(csv, config, () => {}) ).toThrow();
  });


  test('should throw an error when trying to load a CSV edge list', () => {
    let csv = new CSV_IN();
    expect( csv.readFromEdgeListURL.bind(csv, config, () => {}) ).toThrow();
  });


  test('should throw an error when trying to load a JSON graph in Browser environment (should use fetch instead)', () => {
    let json = new JSON_IN();
    expect( json.readFromJSONURL.bind(json, config, () => {}) ).toThrow();
  });

})

