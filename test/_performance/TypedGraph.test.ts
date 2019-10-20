import {JSON_PERF_PATH, JSON_REC_PATH} from "../config/test_paths";
import {JSONInput} from "../../src/io/input/JSONInput";
import {TypedGraph} from "../../src/core/typed/TypedGraph";
import {Logger} from "../../src/utils/Logger";
import {DIR} from "../../src/core/interfaces";
import * as fs from 'fs';

const
	logger = new Logger(),
	jobsGraphFile = JSON_REC_PATH + '/jobs.json',
	meetupGraphFile = JSON_REC_PATH + '/meetupGraph.json';


type SoSFreq = Array<{ freq: number, name: string }>;


function csvToFreqArray(file: string): SoSFreq {
	const lines = file.split('\n');
	lines.shift();
	return lines.map(l => {
		const line = l.split(',');
		return {freq: +line[1], name: line[0]};
	});
}


describe('typed graph performance - ', () => {

	let
		jobGraph: TypedGraph,
		meetupGraph: TypedGraph,
		expandNodeKResults = [],
		expandSetKResults = [],
		peripheryResults = [];


	beforeAll(() => {
		jobGraph = new JSONInput().readFromJSONFile(jobsGraphFile, new TypedGraph('job')) as TypedGraph;
		for ( let k = 1; k < 6; k++ ) {
			const expandNodeKResultsFile = `${JSON_PERF_PATH}/expand/tomlemke-friends-expand${k}.csv`;
			expandNodeKResults[k] = csvToFreqArray(fs.readFileSync(expandNodeKResultsFile).toString().trim());
			const expandSetKResultsFile = `${JSON_PERF_PATH}/expand/kovacek-friends-expand${k}.csv`;
			expandSetKResults[k] = csvToFreqArray(fs.readFileSync(expandSetKResultsFile).toString().trim());
			const peripherySetKResultsFile = `${JSON_PERF_PATH}/expand/kovacek-friends-periphery${k}.csv`;
			peripheryResults[k] = csvToFreqArray(fs.readFileSync(peripherySetKResultsFile).toString().trim());
		}
	});


	it('should read meetupGraph from neo4j example in reasonable time', () => {
		const tic = +new Date;
		meetupGraph = new JSONInput().readFromJSONFile(meetupGraphFile, new TypedGraph('meetup')) as TypedGraph;
		const toc = +new Date;
		logger.log(`Reading in TypedGraph from Neo4j meetup example took: ${toc - tic} ms.`);
		logger.log(meetupGraph.stats);
	});


	/**
	 * Non-atomic, since meetupGraph is read the test case before.. but irrelevant for performance
	 */
	it('computes all possible nType->eType->dir distributions for MEETUP graph', () => {
		const tic = +new Date;
		['GROUP', 'TOPIC', 'MEMBER', 'EVENT'].forEach(nType => {
			['HAS_TOPIC', 'MEMBER_OF', 'INTERESTED_IN', 'HOSTED_EVENT'].forEach(eType => {
				let res = meetupGraph.inHistT(nType, eType);
				res = meetupGraph.outHistT(nType, eType);
				res = meetupGraph.connHistT(nType, eType);
			});
		});
		const toc = +new Date;
		logger.log(`Computing typed histograms over the MEETUP graph took ${toc - tic} ms.`)
	});


	it('computes all possible nType->eType->dir distributions for JOB graph', () => {
		const tic = +new Date;
		['COMPANY', 'COUNTRY', 'PERSON', 'SKILL'].forEach(nType => {
			['HAS_SKILL', 'KNOWS', 'LIVES_IN', 'LOCATED_IN', 'LOOKS_FOR_SKILL', 'WORKS_FOR'].forEach(eType => {
				let res = jobGraph.inHistT(nType, eType);
				res = jobGraph.outHistT(nType, eType);
				res = jobGraph.connHistT(nType, eType);
			});
		});
		const toc = +new Date;
		logger.log(`Computing typed histograms over the JOBS graph took ${toc - tic} ms.`)
	});


	/**
	 MATCH (me:Person{name: 'Tom Lemke'})-[:KNOWS*1..5]->(p:Person)
	 WITH me, p.name as person, count(p.name) as cnt
	 RETURN person, cnt
	 ORDER by cnt DESC
	 */
	for ( let k = 1; k < 6; k++ ) {
		it.only('expands NODE -> friends of friends a certain number of times', () => {
			const tic = +new Date;
			const me = jobGraph.n('583');
			const socialSphere = jobGraph.expandK(me, DIR.out, 'KNOWS', {k});
			const toc = +new Date;
			logger.log(`Expanding social sphere of 'Tom Lemke' ${k}-fold took ${toc - tic} ms.`);

			const readable: SoSFreq = Array.from(socialSphere.freq).map(f => ({freq: f[1], name: f[0].f('name')})).sort((a, b) => b.freq - a.freq);
			console.log(readable);
			readable.forEach(e => expect(expandNodeKResults[k]).toContainEqual(e));
		});
	}


	/**
	 MATCH (c:Company{name: 'Kovacek-Aufderhar'})<-[:WORKS_FOR]-(e:Person)-[:KNOWS*1..k]->(p:Person)
	 WITH c.name as company, p, p.name as person, count(p.name) as cnt
	 RETURN person, cnt
	 ORDER by cnt DESC
	 */
	for ( let k = 1; k < 6; k++ ) {
		it.only('expands SET -> friends of friends a certain number of times', () => {
			const tic = +new Date;
			const company = jobGraph.n('245');
			const employees = jobGraph.expand(company, DIR.in, 'WORKS_FOR');
			const socialSphere = jobGraph.expandK(employees, DIR.out, 'KNOWS', {k});
			const toc = +new Date;
			logger.log(`Expanding social sphere of 'Kovacek'-employees ${k}-fold took ${toc - tic} ms.`);

			const readable: SoSFreq = Array.from(socialSphere.freq).map(f => ({freq: f[1], name: f[0].f('name')})).sort((a, b) => b.freq - a.freq);
			console.log(readable);
			readable.forEach(e => expect(expandSetKResults[k]).toContainEqual(e));
		});
	}


	/**
	 MATCH (c:Company{name: 'Kovacek-Aufderhar'})<-[:WORKS_FOR]-(e:Person)-[:KNOWS*k]->(p:Person)
	 WITH c.name as company, p, p.name as person, count(p.name) as cnt
	 RETURN person, cnt
	 ORDER by cnt DESC
	 */
	for ( let k = 1; k < 6; k++ ) {
		it.only('social periphery SET -> friends of friends @ distance k', () => {
			const tic = +new Date;
			const company = jobGraph.n('245');
			const employees = jobGraph.expand(company, DIR.in, 'WORKS_FOR');
			const socialSphere = jobGraph.peripheryAtK(employees, DIR.out, 'KNOWS', {k});
			const toc = +new Date;
			logger.log(`Computing ${k}-distant social periphery of 'Kovacek'-employees took ${toc - tic} ms.`);

			const readable: SoSFreq = Array.from(socialSphere.freq).map(f => ({freq: f[1], name: f[0].f('name')})).sort((a, b) => b.freq - a.freq);
			console.log(readable);
			readable.forEach(e => expect(peripheryResults[k]).toContainEqual(e));
		});
	}

});

