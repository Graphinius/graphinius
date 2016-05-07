# Graphinius JS
Generic graph (analysis) library in Typescript

## Demo

GraphiniusJS is integrated in our current [GraphiniusVIS Demo Site.](http://berndmalle.com/GraphiniusVis)

Execute the following lines of code in succession to arrive at a simple degree distribution:

![Simple Degree Distribution][degDist]

Then reproduce the code given below to visualize a first graph:

![First graph visualization][graphInREPL]

You can execute a BFS algorithm starting at a random node, then explore the resulting data structure by following this example:

![BFS Color Map][colorBFSREPL]

In the above code, the BFS coloring does not necessarily correspond to the BFS result computed in line 3. Colors run from green (start node) to red (most distant node).

You can configure the JSON graph loader for directed mode first:

```javascript
// ignore explicit direction as specified by file content
jsonReader._explicit_direction = false;
// interpret all edges as directed instead
jsonReader._direction = true;
```

Then execute the following lines of code to obtain a (random) DFS segmentation:

![DFS Color Map][colorDFSREPL]


[degDist]:https://raw.githubusercontent.com/cassinius/MSCThesisGraphinius/master/figures/deg_dist.png

[graphInREPL]:https://raw.githubusercontent.com/cassinius/MSCThesisGraphinius/master/figures/loadingGraphInREPL.png

[colorBFSREPL]:https://raw.githubusercontent.com/cassinius/MSCThesisGraphinius/master/figures/colorBFSREPL.png

[colorDFSREPL]:https://raw.githubusercontent.com/cassinius/MSCThesisGraphinius/master/figures/colorDFSREPL.png
