import {TypedGraph} from '../../../src/core/typed/TypedGraph';
import {JSONOutput} from '../../../src/io/output/JSONOutput';
import {JSON_SIM_PATH} from '../../../test/config/test_paths';

const cuisineJaccardGraph = JSON_SIM_PATH + '/cuisine.json';

const
		g = new TypedGraph('CuisineSimilarities'),
    
    // NODES
		french = g.addNodeByID('French', {type: 'CUISINE'}),
		italian = g.addNodeByID('Italian', {type: 'CUISINE'}),
		indian = g.addNodeByID('Indian', {type: 'CUISINE'}),
		lebanese = g.addNodeByID('Lebanese', {type: 'CUISINE'}),
		portuguese = g.addNodeByID('Portuguese', {type: 'CUISINE'}),

		zhen = g.addNodeByID('Zhen', {type: 'PERSON'}),
		praveena = g.addNodeByID('Praveena', {type: 'PERSON'}),
		michael = g.addNodeByID('Michael', {type: 'PERSON'}),
		arya = g.addNodeByID('Arya', {type: 'PERSON'}),
		karin = g.addNodeByID('Karin', {type: 'PERSON'}),

		shrimp = g.addNodeByID('Shrimp Bolognese', {type: 'RECIPE'}),
		saltimbocca = g.addNodeByID('Saltimbocca alla roman', {type: 'RECIPE'}),
		periperi = g.addNodeByID('Peri Peri Naan', {type: 'RECIPE'}),

    // EDGES
		l1 = g.addEdgeByID('l1', praveena, indian, {directed: true, type: 'LIKES'}),
		l2 = g.addEdgeByID('l2', praveena, portuguese, {directed: true, type: 'LIKES'}),

		l3 = g.addEdgeByID('l3', zhen, french, {directed: true, type: 'LIKES'}),
		l4 = g.addEdgeByID('l4', zhen, indian, {directed: true, type: 'LIKES'}),

		l5 = g.addEdgeByID('l5', michael, french, {directed: true, type: 'LIKES'}),
		l6 = g.addEdgeByID('l6', michael, italian, {directed: true, type: 'LIKES'}),
		l7 = g.addEdgeByID('l7', michael, indian, {directed: true, type: 'LIKES'}),

		l8 = g.addEdgeByID('l8', arya, lebanese, {directed: true, type: 'LIKES'}),
		l9 = g.addEdgeByID('l9', arya, italian, {directed: true, type: 'LIKES'}),
		l10 = g.addEdgeByID('l10', arya, portuguese, {directed: true, type: 'LIKES'}),

		l11 = g.addEdgeByID('l11', karin, lebanese, {directed: true, type: 'LIKES'}),
		l12 = g.addEdgeByID('l12', karin, italian, {directed: true, type: 'LIKES'}),

		t1 = g.addEdgeByID('t1', shrimp, italian, {directed: true, type: 'TYPE'}),
		t2 = g.addEdgeByID('t2', shrimp, indian, {directed: true, type: 'TYPE'}),

		t3 = g.addEdgeByID('t3', saltimbocca, italian, {directed: true, type: 'TYPE'}),
		t4 = g.addEdgeByID('t4', saltimbocca, french, {directed: true, type: 'TYPE'}),

		t5 = g.addEdgeByID('t5', periperi, portuguese, {directed: true, type: 'TYPE'}),
    t6 = g.addEdgeByID('t6', periperi, indian, {directed: true, type: 'TYPE'});

new JSONOutput().writeToJSONFile(cuisineJaccardGraph, g);



/**
 * Sample graph used above in Neo4j input notation
 */
const neo4jCusineGraphInput = `
		MERGE (french:Cuisine {name:'French'})
		MERGE (italian:Cuisine {name:'Italian'})
		MERGE (indian:Cuisine {name:'Indian'})
		MERGE (lebanese:Cuisine {name:'Lebanese'})
		MERGE (portuguese:Cuisine {name:'Portuguese'})
	
		MERGE (zhen:Person {name: "Zhen"})
		MERGE (praveena:Person {name: "Praveena"})
		MERGE (michael:Person {name: "Michael"})
		MERGE (arya:Person {name: "Arya"})
		MERGE (karin:Person {name: "Karin"})
	
		MERGE (shrimp:Recipe {title: "Shrimp Bolognese"})
		MERGE (saltimbocca:Recipe {title: "Saltimbocca alla roman"})
		MERGE (periperi:Recipe {title: "Peri Peri Naan"})
	
		MERGE (praveena)-[:LIKES]->(indian)
		MERGE (praveena)-[:LIKES]->(portuguese)
	
		MERGE (zhen)-[:LIKES]->(french)
		MERGE (zhen)-[:LIKES]->(indian)
	
		MERGE (michael)-[:LIKES]->(french)
		MERGE (michael)-[:LIKES]->(italian)
		MERGE (michael)-[:LIKES]->(indian)
	
		MERGE (arya)-[:LIKES]->(lebanese)
		MERGE (arya)-[:LIKES]->(italian)
		MERGE (arya)-[:LIKES]->(portuguese)
	
		MERGE (karin)-[:LIKES]->(lebanese)
		MERGE (karin)-[:LIKES]->(italian)
	
		MERGE (shrimp)-[:TYPE]->(italian)
		MERGE (shrimp)-[:TYPE]->(indian)
	
		MERGE (saltimbocca)-[:TYPE]->(italian)
		MERGE (saltimbocca)-[:TYPE]->(french)
	
		MERGE (periperi)-[:TYPE]->(portuguese)
		MERGE (periperi)-[:TYPE]->(indian)
	`;