---
layout: default
title: Getting data
permalink: /
nav_order: 0
---

# Documentation of Shoplist API

Here you can find documentation to all the API endoints of Shoplist.

This page is about getting all the data.

## All weeks of the year [GET]

```
{{ site.apibase }}/weeks
```

## One week [GET]

Weeks are numbered from 0 to 51.

```
{{ site.apibase }}/weeks/{weekNumber}
```

## All days in a week [GET]

```
{{ site.apibase }}/weeks/{weekNumber}/days
```

## Shopping items for one day of a week [GET]

```
{{ site.apibase }}/weeks/{weekNumber}/days/{day}
```

There are always 7 days in every week: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun`.

## Shopping item with an id [GET]

Returns a shopping item by its *id*.

```
{{ site.apibase }}/weeks/{weekNumber}/days/{day}/{id}
```
