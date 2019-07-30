/**
 * HANDLE WITH EXTREME CARE !!!
 *
 * THIS FILE WAS WRITTEN AT 5 A.M. WITHOUT **ANY**
 * DESIGN OR SECURITY CONSIDERATIONS...
 *
 * @todo refactor
 */

import * as fs from 'fs';
import * as path from 'path';
import { JSONInput } from '../../../src/io/input/JSONInput';
import { JSONOutput } from '../../../src/io/output/JSONOutput';
const jsonIn = new JSONInput();
const jsonOut = new JSONOutput();

const transformDir = path.join(__dirname, '../json/general/');

const fileList = fs.readdirSync(transformDir);

fileList.forEach(file => {
	console.log(`Shrinking edge entries of file ${file}`);
	const graphJSON = JSON.parse(fs.readFileSync(transformDir + file).toString());

	Object.values(graphJSON['data']).forEach(node => {
		if ( !node['e'] ) {
			return;
		}
		/**
		 * This deletes data in files that were already transformed
		 */
		node['e'].forEach(edge => {
			delete Object.assign(edge, {'t': edge['to'] })['to'];
			delete Object.assign(edge, {'d': edge['directed'] })['directed'];
			delete Object.assign(edge, {'w': edge['weight'] })['weight'];
		});
		// console.log(node['e']);
	});


	fs.writeFileSync(transformDir + file, JSON.stringify(graphJSON));


	// const outfile = file.split('.')[0];
	// fs.writeFileSync(transformDir + outfile + ".new.json", JSON.stringify(graphJSON));


	// const graph = jsonIn.readFromJSONFile(transformDir + file);
	// console.log(graph.getStats());
	// jsonOut.writeToJSONFile(transformDir + file, graph);
});

