import {TypedGraph} from '../../../lib/core/typed/TypedGraph';
import {JSONOutput} from '../../../lib/io/output/JSONOutput';
import {JSON_SIM_PATH} from '../../../test/config/test_paths';

const bookOverlapGraph = JSON_SIM_PATH + '/books.json';

const
		g = new TypedGraph('BookSimilarities'),
    
    // NODES
		fahrenheit451 = g.addNodeByID('fahrenheit451', {type: 'BOOK'}),
		dune = g.addNodeByID('dune', {type: 'BOOK'}),
		hungerGames = g.addNodeByID('hungerGames', {type: 'BOOK'}),
		nineteen84 = g.addNodeByID('nineteen84', {type: 'BOOK'}),
		gatsby = g.addNodeByID('gatsby', {type: 'BOOK'}),

		scienceFiction = g.addNodeByID('scienceFiction', {type: 'GENRE'}),
		fantasy = g.addNodeByID('fantasy', {type: 'GENRE'}),
		dystopia = g.addNodeByID('dystopia', {type: 'GENRE'}),
		classics = g.addNodeByID('classics', {type: 'GENRE'}),
		// romance = g.addNodeByID('romance', {type: 'GENRE'}),

    // EDGES
		l1 = g.addEdgeByID('l1', fahrenheit451, dystopia, {directed: true, type: 'HAS_GENRE'}),
		l2 = g.addEdgeByID('l2', fahrenheit451, scienceFiction, {directed: true, type: 'HAS_GENRE'}),
		l3 = g.addEdgeByID('l3', fahrenheit451, fantasy, {directed: true, type: 'HAS_GENRE'}),
    l4 = g.addEdgeByID('l4', fahrenheit451, classics, {directed: true, type: 'HAS_GENRE'}),
    
		l5 = g.addEdgeByID('l5', hungerGames, scienceFiction, {directed: true, type: 'HAS_GENRE'}),
		l6 = g.addEdgeByID('l6', hungerGames, fantasy, {directed: true, type: 'HAS_GENRE'}),
    // l7 = g.addEdgeByID('l7', hungerGames, romance, {directed: true, type: 'HAS_GENRE'}),
    
    l8 = g.addEdgeByID('l8', nineteen84, scienceFiction, {directed: true, type: 'HAS_GENRE'}),
		l9 = g.addEdgeByID('l9', nineteen84, dystopia, {directed: true, type: 'HAS_GENRE'}),
    l10 = g.addEdgeByID('l10', nineteen84, classics, {directed: true, type: 'HAS_GENRE'}),
    
		l11 = g.addEdgeByID('l11', dune, scienceFiction, {directed: true, type: 'HAS_GENRE'}),
		l12 = g.addEdgeByID('l12', dune, fantasy, {directed: true, type: 'HAS_GENRE'}),
    l13 = g.addEdgeByID('l13', dune, classics, {directed: true, type: 'HAS_GENRE'}),
    
		l14 = g.addEdgeByID('l14', gatsby, classics, {directed: true, type: 'HAS_GENRE'});

new JSONOutput().writeToJSONFile(bookOverlapGraph, g);



const neo4jMovieGraphInput = `
  MERGE (fahrenheit451:Book {title:'Fahrenheit 451'})
  MERGE (dune:Book {title:'Dune'})
  MERGE (hungerGames:Book {title:'The Hunger Games'})
  MERGE (nineteen84:Book {title:'1984'})
  MERGE (gatsby:Book {title:'The Great Gatsby'})

  MERGE (scienceFiction:Genre {name: "Science Fiction"})
  MERGE (fantasy:Genre {name: "Fantasy"})
  MERGE (dystopia:Genre {name: "Dystopia"})
  MERGE (classics:Genre {name: "Classics"})

  MERGE (fahrenheit451)-[:HAS_GENRE]->(dystopia)
  MERGE (fahrenheit451)-[:HAS_GENRE]->(scienceFiction)
  MERGE (fahrenheit451)-[:HAS_GENRE]->(fantasy)
  MERGE (fahrenheit451)-[:HAS_GENRE]->(classics)

  MERGE (hungerGames)-[:HAS_GENRE]->(scienceFiction)
  MERGE (hungerGames)-[:HAS_GENRE]->(fantasy)
  MERGE (hungerGames)-[:HAS_GENRE]->(romance)

  MERGE (nineteen84)-[:HAS_GENRE]->(scienceFiction)
  MERGE (nineteen84)-[:HAS_GENRE]->(dystopia)
  MERGE (nineteen84)-[:HAS_GENRE]->(classics)

  MERGE (dune)-[:HAS_GENRE]->(scienceFiction)
  MERGE (dune)-[:HAS_GENRE]->(fantasy)
  MERGE (dune)-[:HAS_GENRE]->(classics)

  MERGE (gatsby)-[:HAS_GENRE]->(classics)
`
