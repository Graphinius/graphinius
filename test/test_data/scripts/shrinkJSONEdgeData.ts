/**
 * Transforms old-style .json property keys (spelled-out words) to 1-digit keys
 * Also replaces earlier boolean value for edge->directed? with 0/1
 *
 * HANDLE WITH CARE !!! This script has only manually been tested at 5 a.m. ;-)
 */

import * as fs from 'fs';
import * as path from 'path';

enum JSONSubdirs {
	CENTRALITIES 	= 'centralities',
	GENERAL 			= 'general',
	PARTITIONING	= 'partitioning',
	RECOMMENDER		= 'recommender'
}

const config = {
	jsonSubdir	: JSONSubdirs.CENTRALITIES,
	inplace			: true
};

const transformDir = path.join(__dirname, `../json/${config.jsonSubdir}/`);
const fileList = fs.readdirSync(transformDir);


fileList.forEach(file => {
	console.log(`Shrinking edge entries of file ${file}`);
	const graphJSON = JSON.parse(fs.readFileSync(transformDir + file).toString());

	Object.values(graphJSON['data']).forEach(node => {
		const edges = node['e'];
		if ( !edges ) {
			return;
		}
		compressEdgePropertyNames(edges);
		replaceDirBooleanWithNum(edges);
	});

	outputJSONGraph(file, graphJSON, config.inplace);
});


function outputJSONGraph(file, json, inplace = false) {
	let outFile = file;
	if ( !inplace ) {
		outFile = file.split('.')[0] + ".new.json";
	}
	fs.writeFileSync(transformDir + outFile, JSON.stringify(json));
}


/**
 * This deletes data in files that were already transformed
 *
 * @todo figure out WHY
 */
function compressEdgePropertyNames(edges: []) {
	edges.forEach(edge => {
		if ( edge['to'] ) {
			delete Object.assign(edge, {'t': edge['to']})['to'];
		}
		if ( edge['directed' ] ) {
			delete Object.assign(edge, {'d': edge['directed']})['directed'];
		}
		if ( edge['weight'] ) {
			delete Object.assign(edge, {'w': edge['weight']})['weight'];
		}
	});
	// console.log(node['e']);
}


/**
 * @describe in theory, should work on already tranformed files... in theory... ;-)
 * @param edges
 */
function replaceDirBooleanWithNum(edges) {
	edges.forEach(edge => {
		if ( edge.d == null ) {
			return;
		}
		edge.d = !!edge.d ? 1 : 0;
	});
	// console.log(edges);
}
