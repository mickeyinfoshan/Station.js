#PipeFlux

---

**PipeFlux** is a Flux-like architecture for more complex applications. Let's consider the architecture of an application as a directed graph, which including nodes and links. Everything in an application that process/store data is a node of the graph and the connections between them are links.
In **PipeFlux**, we consider a node as a data station and a link as a pipe where stream runs through.

#DataStation

---

DataStation is a core concept in PipeFlux. 

An undirectional application is like a tree(graph)	and a data station is like a node of the tree. A data station take the responsibility to receive data, process data, and then dispatch the processed data to the next.

Everything can be a data station. Models, views and controllers in MVC can be data stations. Dispatchers and stores in Flux can be data stations.

A data station can have several data sources. Sources can be 
added through 'addSource' method which will create a stream 
waiting for data. 

A data station can have one or more data destinations. When a data station add an another data station as a data source, this data station will be a data destination of the other one.

A data station can have several handlers dealing with a certain data type. When data comes, a data station will choose the corresponding handler to process the data. If no corresponding handler found, do nothing. If a handler returns value, then the data station will	dispatch the return value to all data destinations of it. Otherwise, nothing more to do. If the return value doesn't have 'dataType' attribute, the origin data type will add to it.