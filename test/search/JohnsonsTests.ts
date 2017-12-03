
/*
test pseudocode: 

Step 1: checking if this is an empty graph, throw error if so

Step 2: addig extra node and edges
graph: the original graph
graphForBF: the one with extraNode and edges

graphForBF.nrOfNodes.expect. (graph.nrOfNodes+1)
graphForBF.nrofEdges.expect.(graph.nrOfEdges+graph.nrOfNodes)

3. Bellman-Ford: 
make sure sanity checks are performed not necessary
make sure it detect negative cycles not necessary

4. re-weighing graphs
make sure data for extraNode is deleted from the BF Result dictionary
make sure there are no negative weight edges after the re-weighing
make sure re-weighed graph has the same number of dir and undir edges as the original

5. Dijkstra
check outputs




*/