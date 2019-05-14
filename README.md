# STRIPS in the Browser

I recently stumbled into the world of plan-space search algorithms. This led to STRIPS and PDDL.  

During my search for a javascript implementation I came across [Kory Becker's](https://github.com/primaryobjects/strips)
implementation with nodejs. It's awesome work! I wanted to be able to run this in a browser without a node server for file fetching so I am slowly migrating her code to accept JSON instead of text files and run completely in browser based on one's domain/problem input.