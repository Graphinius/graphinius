import * as $RU from '../../../src/utils/RemoteUtils';


const REMOTE_HOST = "raw.githubusercontent.com";
const REMOTE_PATH = "/cassinius/graphinius-demo/master/test_data/json/";
const SMALL_GRAPH_NAME = "small_graph";
const JSON_EXTENSION = ".json";


describe('Retrieve remote file tests - ', () => {

	let config: $RU.RequestConfig = {
		remote_host: REMOTE_HOST,
		remote_path: REMOTE_PATH,
		file_name: SMALL_GRAPH_NAME + JSON_EXTENSION
	};
	

	test('should throw an error if the handed callback is not a function',
		(done) => {
			let cb = undefined;
			expect($RU.retrieveRemoteFile.bind($RU, config, cb)).toThrowError('Provided callback is not a function.');
			done();
		}
	);


	test('should successfully retrieve a small graph from a remote origin',
		(done) => {
			let cb = function (graphString) {
				let graph = JSON.parse(graphString);
				expect(graph.name).toBe("Small graph test scenario");
				expect(graph.nodes).toBe(4);
				expect(graph.e).toBe(7);
				done();
			};
			$RU.retrieveRemoteFile(config, cb);
		}
	);

});