---
layout: post
title:  "itertools"
date:   2018-10-22 10:51:07 +0100
categories: jekyll update
---
max and min both have "key" as a parameter, therefore one can use it flexibly.  
example 1:   
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`dist = {"a":3, "b":2, "c":1}`  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;we want to get the key with the largest value  
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;normally `max(dist)` will return `"c"`  
	&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;but `max(dist, key=dist.get)` will do as we expect  
example 2:  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`lst = [(1,9,3),(4,5,6)]`   
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;we want to get an item with the largest second element  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`max(lst) = (4,5,6)`by default  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`max(lst,key=lambda x:x[1]) = (1,9,3)`  

`itertools.product` is powerful  
repeat means repeat itself multiple times  
For example, product(A, repeat=4) means the same as product(A, A, A, A).  
```
# product('ABCD', 'xy') --> Ax Ay Bx By Cx Cy Dx Dy
# product(range(2), repeat=3) --> 000 001 010 011 100 101 110 111
```
There are also **permutation** and **combination** in `itertools`.  


