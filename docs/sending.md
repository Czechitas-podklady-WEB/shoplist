---
layout: default
title: Data manipulation
permalink: /sending
nav_order: 1
---

# Manipulating the data on the server

## Add a new item to a list [POST]

```
{{ site.apibase }}/weeks/{weekNumber}/days/{day}
```

Body:

```json
{
  "product": "Product Name",
  "amount": 2,
  "unit": "kg",
  "done": true,
}
```

| Property | Type    | Required | Default value |
| -------- | ------- | -------- | ------------- |
| product  | string  | yes      | _none_        |
| amount   | integer | yes      | _none_        |
| unit     | string  | yes      | _none_        |
| done     | boolean | no       | `false`       |

The endpoint returns the whole updated list.

## Update existing item [PATCH]

Change any property of an item with given *id*.

```
{{ site.apibase }}/weeks/{weekNumber}/days/{day}/{id}
```

Example:

```json
{
  "done": true
}
```

The endpoint return the updated item.

## Delete item from a list [DELETE]

Delete the item with give *id* from a list.

```
{{ site.apibase }}/weeks/{weekNumber}/days/{day}/{id}
```

The endpoint returns the whole updated list.

## Move item up or down in a list [POST]

Move the item with given *id* up or down in a list.

```
{{ site.apibase }}/weeks/{weekNumber}/days/{day}/{id}/actions
```

To move up, send

```json
{
  "type": "moveUp"
}
```

To move down, send

```json
{
  "type": "moveDown"
}
```

The endpoint returns the whole updated list.

## Reset list [POST]

Resets the list to its original items

```
{{ site.apibase }}/weeks/{weekNumber}/days/{day}/actions
```

Body:

```json
{
  "type": "reset"
}
```

The endpoint returns the whole updated list.

## Clear list [POST]

Clears all the items in the list

```
{{ site.apibase }}/weeks/{weekNumber}/days/{day}/actions
```

Body:

```json
{
  "type": "clear"
}
```

The endpoint returns en empty list.

