import networkx as nx
from networkx import pagerank
import time
import json

''' 
Small graphs
'''

n3graph = nx.read_edgelist('../3node2SPs1direct.csv', create_using=nx.DiGraph())
n3res = pagerank(n3graph, alpha=0.85, personalization=None, dangling=None, max_iter=1000, nstart=None)
print("Pagerank, NO teleport set:")
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


'''
In case of start values, we need to provide one for each node
nStart values are normalized automatically
'''
nValues = {'A': 4, 'B': 3, 'C': 3} # {'A': 5, 'B': 5} -> KeyError: 'C'
# nValues = {'A': .4, 'B': .3, 'C': .3}
n3res = pagerank(n3graph, alpha=0.85, nstart=nValues, dangling=None, max_iter=1000)
print("Pagerank, start values for {A, B}:")
print(n3res)


