import {TypedGraph} from '../../../src/core/typed/TypedGraph';
import {JSONOutput} from '../../../src/io/output/JSONOutput';
import {JSON_SIM_PATH} from '../../../test/config/test_paths';

const moviePearsonGraph = JSON_SIM_PATH + '/movies.json';


const
	g = new TypedGraph('MovieSimilarities'),

	// NODES
	home_alone = g.addNodeByID('Home Alone', {type: 'MOVIE'}),
	matrix = g.addNodeByID('The Matrix', {type: 'MOVIE'}),
	good_men = g.addNodeByID('A Few Good Men', {type: 'MOVIE'}),
	top_gun = g.addNodeByID('Top Gun', {type: 'MOVIE'}),
	jerry = g.addNodeByID('Jerry Maguire', {type: 'MOVIE'}),
	gruffalo = g.addNodeByID('The Gruffalo', {type: 'MOVIE'}),

	zhen = g.addNodeByID('Zhen', {type: 'PERSON'}),
	praveena = g.addNodeByID('Praveena', {type: 'PERSON'}),
	michael = g.addNodeByID('Michael', {type: 'PERSON'}),
	arya = g.addNodeByID('Arya', {type: 'PERSON'}),
	karin = g.addNodeByID('Karin', {type: 'PERSON'}),

	// EDGES
	l1 = g.addEdgeByID('l1', zhen, home_alone, {weighted: true, weight: 2, directed: true, type: 'RATED'}),
	l2 = g.addEdgeByID('l2', zhen, good_men, {weighted: true, weight: 2, directed: true, type: 'RATED'}),
	l3 = g.addEdgeByID('l3', zhen, matrix, {weighted: true, weight: 3, directed: true, type: 'RATED'}),
	l4 = g.addEdgeByID('l4', zhen, jerry, {weighted: true, weight: 6, directed: true, type: 'RATED'}),

	l5 = g.addEdgeByID('l5', praveena, home_alone, {weighted: true, weight: 6, directed: true, type: 'RATED'}),
	l6 = g.addEdgeByID('l6', praveena, good_men, {weighted: true, weight: 7, directed: true, type: 'RATED'}),
	l7 = g.addEdgeByID('l7', praveena, matrix, {weighted: true, weight: 8, directed: true, type: 'RATED'}),
	l8 = g.addEdgeByID('l8', praveena, jerry, {weighted: true, weight: 9, directed: true, type: 'RATED'}),

	l9 = g.addEdgeByID('l9', michael, home_alone, {weighted: true, weight: 7, directed: true, type: 'RATED'}),
	l10 = g.addEdgeByID('l10', michael, good_men, {weighted: true, weight: 9, directed: true, type: 'RATED'}),
	l11 = g.addEdgeByID('l11', michael, jerry, {weighted: true, weight: 3, directed: true, type: 'RATED'}),
	l12 = g.addEdgeByID('l12', michael, top_gun, {weighted: true, weight: 4, directed: true, type: 'RATED'}),

	l13 = g.addEdgeByID('l13', arya, top_gun, {weighted: true, weight: 8, directed: true, type: 'RATED'}),
	l14 = g.addEdgeByID('l14', arya, matrix, {weighted: true, weight: 1, directed: true, type: 'RATED'}),
	l15 = g.addEdgeByID('l15', arya, jerry, {weighted: true, weight: 10, directed: true, type: 'RATED'}),
	l16 = g.addEdgeByID('l16', arya, gruffalo, {weighted: true, weight: 10, directed: true, type: 'RATED'}),

	l17 = g.addEdgeByID('l17', karin, top_gun, {weighted: true, weight: 9, directed: true, type: 'RATED'}),
	l18 = g.addEdgeByID('l18', karin, matrix, {weighted: true, weight: 7, directed: true, type: 'RATED'}),
	l19 = g.addEdgeByID('l19', karin, home_alone, {weighted: true, weight: 7, directed: true, type: 'RATED'}),
	l20 = g.addEdgeByID('l20', karin, gruffalo, {weighted: true, weight: 9, directed: true, type: 'RATED'});


	new JSONOutput().writeToJSONFile(moviePearsonGraph, g);



const neo4jMovieGraphInput = `
  MERGE (home_alone:Movie {name:'Home Alone'})
	MERGE (matrix:Movie {name:'The Matrix'})
	MERGE (good_men:Movie {name:'A Few Good Men'})
	MERGE (top_gun:Movie {name:'Top Gun'})
	MERGE (jerry:Movie {name:'Jerry Maguire'})
	MERGE (gruffalo:Movie {name:'The Gruffalo'})
	
	MERGE (zhen:Person {name: "Zhen"})
	MERGE (praveena:Person {name: "Praveena"})
	MERGE (michael:Person {name: "Michael"})
	MERGE (arya:Person {name: "Arya"})
	MERGE (karin:Person {name: "Karin"})
	
	MERGE (zhen)-[:RATED {score: 2}]->(home_alone)
	MERGE (zhen)-[:RATED {score: 2}]->(good_men)
	MERGE (zhen)-[:RATED {score: 3}]->(matrix)
	MERGE (zhen)-[:RATED {score: 6}]->(jerry)
	
	MERGE (praveena)-[:RATED {score: 6}]->(home_alone)
	MERGE (praveena)-[:RATED {score: 7}]->(good_men)
	MERGE (praveena)-[:RATED {score: 8}]->(matrix)
	MERGE (praveena)-[:RATED {score: 9}]->(jerry)
	
	MERGE (michael)-[:RATED {score: 7}]->(home_alone)
	MERGE (michael)-[:RATED {score: 9}]->(good_men)
	MERGE (michael)-[:RATED {score: 3}]->(jerry)
	MERGE (michael)-[:RATED {score: 4}]->(top_gun)
	
	MERGE (arya)-[:RATED {score: 8}]->(top_gun)
	MERGE (arya)-[:RATED {score: 1}]->(matrix)
	MERGE (arya)-[:RATED {score: 10}]->(jerry)
	MERGE (arya)-[:RATED {score: 10}]->(gruffalo)
	
	MERGE (karin)-[:RATED {score: 9}]->(top_gun)
	MERGE (karin)-[:RATED {score: 7}]->(matrix)
	MERGE (karin)-[:RATED {score: 7}]->(home_alone)
	MERGE (karin)-[:RATED {score: 9}]->(gruffalo)
`;
