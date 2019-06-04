import networkx as nx
from networkx import pagerank, pagerank_numpy, pagerank_scipy, google_matrix
import time
import json

''' 
Small graphs
'''

n3graph = nx.read_edgelist('../3node2SPs1direct.csv', create_using=nx.DiGraph())

'''
Simplest Pagerank, use defaults (but print google matrix first)
'''
n3res = pagerank(n3graph, alpha=0.85, personalization=None, dangling=None, max_iter=1000, nstart=None, weight=None)
print("Pagerank, NO teleport set:")
print(google_matrix(n3graph, alpha=0.85, weight=None))
print(n3res)


'''
We only need to provide values for the nodes we want considered (rather than all nodes)
Personalization values are normalized automatically
'''
pValues = {'A': 1}
n3res = pagerank(n3graph, alpha=0.85, personalization=pValues, dangling=None, max_iter=1000,nstart=None)
print("Pagerank, teleport set {A}:")
print(n3res)

pValues = {'A': 5, 'B': 5} # same as 0.5, 0.5, 0 - or - 0.2, 0.2, 0
n3res = pagerank(n3graph, alpha=0.85, personalization=pValues, dangling=None, max_iter=1000,nstart=None)
print("Pagerank, teleport set {A, B}:")
print(n3res)

pValues = {'A': .1, 'B': .3, 'C': .6}
n3res = pagerank(n3graph, alpha=0.85, personalization=pValues, dangling=None, max_iter=1000,nstart=None)
print("Pagerank, skewed teleport set {A: .1, B: .3, C: .6}:")
print(n3res)


'''
In case of start values, we need to provide one for each node
nStart values are normalized automatically
'''
nValues = {'A': 4, 'B': 3, 'C': 3} # {'A': 5, 'B': 5} -> KeyError: 'C'
n3res = pagerank(n3graph, alpha=0.85, nstart=nValues, dangling=None, max_iter=1000)
print("Pagerank, start values = {'A': 4, 'B': 3, 'C': 3}")
print(n3res)


'''
Weighted version

NetworkX computes the weight into the google matrix by
1) First calculating the 'raw' coefficient:
    - (1-alpha)*weight + alpha/|V|
    - normalize all weighted edges by:
      + taking their sum
      + in case of same weights: each weight / sum(weights) * 1-Sum(weight of dead ends)
      + in case of different weights: doing something weird..... !?
'''
n3Wgraph = nx.read_weighted_edgelist('../3node2SPs1direct_weighted.csv', create_using=nx.DiGraph())
print(google_matrix(n3Wgraph, alpha=0.85, weight='weight'))
n3Wres = pagerank(n3Wgraph, alpha=0.85, max_iter=1000)
print("Pagerank, weighted version")
print(n3Wres)
