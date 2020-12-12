import {TypedGraph} from '../../../lib/core/typed/TypedGraph';
import {JSONOutput} from '../../../lib/io/output/JSONOutput';
import {JSON_SIM_PATH} from '../../../test/config/test_paths';

const cuisineCosineGraph = JSON_SIM_PATH + '/cuisineCosine.json';

const
		g = new TypedGraph('CuisineSimilarities'),
    
    // NODES
		french = g.addNodeByID('French', {type: 'CUISINE'}),
		italian = g.addNodeByID('Italian', {type: 'CUISINE'}),
		indian = g.addNodeByID('Indian', {type: 'CUISINE'}),
		lebanese = g.addNodeByID('Lebanese', {type: 'CUISINE'}),
		portuguese = g.addNodeByID('Portuguese', {type: 'CUISINE'}),
		mauritian = g.addNodeByID('Mauritian', {type: 'CUISINE'}),
		british = g.addNodeByID('British', {type: 'CUISINE'}),

		zhen = g.addNodeByID('Zhen', {type: 'PERSON'}),
		praveena = g.addNodeByID('Praveena', {type: 'PERSON'}),
		michael = g.addNodeByID('Michael', {type: 'PERSON'}),
		arya = g.addNodeByID('Arya', {type: 'PERSON'}),
		karin = g.addNodeByID('Karin', {type: 'PERSON'}),

		shrimp = g.addNodeByID('Shrimp Bolognese', {type: 'RECIPE'}),
		saltimbocca = g.addNodeByID('Saltimbocca alla roman', {type: 'RECIPE'}),
		periperi = g.addNodeByID('Peri Peri Naan', {type: 'RECIPE'}),

    // EDGES'./data/cuisineCosine.json''./data/cuisineCosine.json'
		l1 = g.addEdgeByID('l1', praveena, indian, {directed: true, type: 'LIKES', weighted: true, weight: 9}),
		l2 = g.addEdgeByID('l2', praveena, portuguese, {directed: true, type: 'LIKES', weighted: true, weight: 7}),
		l1a = g.addEdgeByID('l1a', praveena, british, {directed: true, type: 'LIKES', weighted: true, weight: 8}),
		l2a = g.addEdgeByID('l2a', praveena, mauritian, {directed: true, type: 'LIKES', weighted: true, weight: 1}),

		l3 = g.addEdgeByID('l3', zhen, french, {directed: true, type: 'LIKES', weighted: true, weight: 10}),
		l4 = g.addEdgeByID('l4', zhen, indian, {directed: true, type: 'LIKES', weighted: true, weight: 6}),
		l4a = g.addEdgeByID('l4a', zhen, british, {directed: true, type: 'LIKES', weighted: true, weight: 2}),

		l5 = g.addEdgeByID('l5', michael, french, {directed: true, type: 'LIKES', weighted: true, weight: 8}),
		l6 = g.addEdgeByID('l6', michael, italian, {directed: true, type: 'LIKES', weighted: true, weight: 7}),
		l7 = g.addEdgeByID('l7', michael, indian, {directed: true, type: 'LIKES', weighted: true, weight: 9}),
		l7a = g.addEdgeByID('l7a', michael, portuguese, {directed: true, type: 'LIKES', weighted: true, weight: 3}),

		l8 = g.addEdgeByID('l8', arya, lebanese, {directed: true, type: 'LIKES', weighted: true, weight: 10}),
		l9 = g.addEdgeByID('l9', arya, italian, {directed: true, type: 'LIKES', weighted: true, weight: 10}),
		l10 = g.addEdgeByID('l10', arya, portuguese, {directed: true, type: 'LIKES', weighted: true, weight: 7}),
		l10a = g.addEdgeByID('l10a', arya, mauritian, {directed: true, type: 'LIKES', weighted: true, weight: 9}),

		l11 = g.addEdgeByID('l11', karin, lebanese, {directed: true, type: 'LIKES', weighted: true, weight: 9}),
		l12 = g.addEdgeByID('l12', karin, italian, {directed: true, type: 'LIKES', weighted: true, weight: 7}),
		l12a = g.addEdgeByID('l12a', karin, portuguese, {directed: true, type: 'LIKES', weighted: true, weight: 10}),

		t1 = g.addEdgeByID('t1', shrimp, italian, {directed: true, type: 'TYPE'}),
		t2 = g.addEdgeByID('t2', shrimp, indian, {directed: true, type: 'TYPE'}),

		t3 = g.addEdgeByID('t3', saltimbocca, italian, {directed: true, type: 'TYPE'}),
		t4 = g.addEdgeByID('t4', saltimbocca, french, {directed: true, type: 'TYPE'}),

		t5 = g.addEdgeByID('t5', periperi, portuguese, {directed: true, type: 'TYPE'}),
    t6 = g.addEdgeByID('t6', periperi, indian, {directed: true, type: 'TYPE'});

		// EMBEDDINGS
		french.setFeature('embeddings', [0.71, 0.33, 0.81, 0.52, 0.41]);
		italian.setFeature('embeddings', [0.31, 0.72, 0.58, 0.67, 0.31]);
		indian.setFeature('embeddings', [0.43, 0.26, 0.98, 0.51, 0.76]);
		lebanese.setFeature('embeddings', [0.12, 0.23, 0.35, 0.31, 0.39]);
		portuguese.setFeature('embeddings', [0.47, 0.98, 0.81, 0.72, 0.89]);
		british.setFeature('embeddings', [0.94, 0.12, 0.23, 0.4, 0.71]);
		mauritian.setFeature('embeddings', [0.31, 0.56, 0.98, 0.21, 0.62]);

new JSONOutput().writeToJSONFile(cuisineCosineGraph, g);



/**
 * Sample graph used above in Neo4j input notation
 */
const neo4jCusineGraphInput = `
MERGE (french:Cuisine {name:'French'})
MERGE (italian:Cuisine {name:'Italian'})
MERGE (indian:Cuisine {name:'Indian'})
MERGE (lebanese:Cuisine {name:'Lebanese'})
MERGE (portuguese:Cuisine {name:'Portuguese'})
MERGE (british:Cuisine {name:'British'})
MERGE (mauritian:Cuisine {name:'Mauritian'})

MERGE (zhen:Person {name: "Zhen"})
MERGE (praveena:Person {name: "Praveena"})
MERGE (michael:Person {name: "Michael"})
MERGE (arya:Person {name: "Arya"})
MERGE (karin:Person {name: "Karin"})

MERGE (praveena)-[:LIKES {score: 9}]->(indian)
MERGE (praveena)-[:LIKES {score: 7}]->(portuguese)
MERGE (praveena)-[:LIKES {score: 8}]->(british)
MERGE (praveena)-[:LIKES {score: 1}]->(mauritian)

MERGE (zhen)-[:LIKES {score: 10}]->(french)
MERGE (zhen)-[:LIKES {score: 6}]->(indian)
MERGE (zhen)-[:LIKES {score: 2}]->(british)

MERGE (michael)-[:LIKES {score: 8}]->(french)
MERGE (michael)-[:LIKES {score: 7}]->(italian)
MERGE (michael)-[:LIKES {score: 9}]->(indian)
MERGE (michael)-[:LIKES {score: 3}]->(portuguese)

MERGE (arya)-[:LIKES {score: 10}]->(lebanese)
MERGE (arya)-[:LIKES {score: 10}]->(italian)
MERGE (arya)-[:LIKES {score: 7}]->(portuguese)
MERGE (arya)-[:LIKES {score: 9}]->(mauritian)

MERGE (karin)-[:LIKES {score: 9}]->(lebanese)
MERGE (karin)-[:LIKES {score: 7}]->(italian)
MERGE (karin)-[:LIKES {score: 10}]->(portuguese)
	`;


const additionalEmbeddings = `
	MERGE (french:Cuisine {name:'French'})          SET french.embedding = [0.71, 0.33, 0.81, 0.52, 0.41]
	MERGE (italian:Cuisine {name:'Italian'})        SET italian.embedding = [0.31, 0.72, 0.58, 0.67, 0.31]
	MERGE (indian:Cuisine {name:'Indian'})          SET indian.embedding = [0.43, 0.26, 0.98, 0.51, 0.76]
	MERGE (lebanese:Cuisine {name:'Lebanese'})      SET lebanese.embedding = [0.12, 0.23, 0.35, 0.31, 0.39]
	MERGE (portuguese:Cuisine {name:'Portuguese'})  SET portuguese.embedding = [0.47, 0.98, 0.81, 0.72, 0.89]
	MERGE (british:Cuisine {name:'British'})        SET british.embedding = [0.94, 0.12, 0.23, 0.4, 0.71]
	MERGE (mauritian:Cuisine {name:'Mauritian'})    SET mauritian.embedding = [0.31, 0.56, 0.98, 0.21, 0.62]
`;