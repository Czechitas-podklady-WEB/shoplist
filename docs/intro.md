---
layout: default
title: Getting list data
permalink: /
nav_order: 0
---

# Documentation of Shoplist API

Here you can find documentation to all the API endoints of Shoplist.

This page is about getting all the data.

## All shopping lists [GET]

```
{{ site.apibase }}/lists
```

The dataset always contains one shopping list with name _default_. This list cannot be deleted so you can rely on it always being there.

## One shopping list [GET]

Get one shopping list with name `name`.

```
{{ site.apibase }}/lists/{name}
```

The dataset always contains one shopping list with name _default_. This list cannot be deleted so you can rely on it always being there.

## Item of a shopping list [GET]

Get the item with id `itemId` from shopping list with name `name`.

```
{{ site.apibase }}/lists/{name}/{itemId}
```
