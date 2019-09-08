import {JSON_REC_PATH} from "../config/test_paths";
import {JSONInput} from "../../src/io/input/JSONInput";
import {TypedGraph} from "../../src/core/typed/TypedGraph";
import {Logger} from "../../src/utils/Logger";

const
	logger = new Logger(),
	jobsGraphFile = JSON_REC_PATH + '/jobs.json',
	meetupGraphFile = JSON_REC_PATH + '/meetupGraph.json';


describe('typed graph performance - ', () => {

	let
		jobGraph: TypedGraph,
		meetupGraph: TypedGraph;


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
		jobGraph = new JSONInput().readFromJSONFile(jobsGraphFile, new TypedGraph('job')) as TypedGraph;
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

});

