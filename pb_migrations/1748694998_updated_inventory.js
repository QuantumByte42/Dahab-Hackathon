/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3573984430")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ring",
      "chain"
    ]
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select3617682138",
    "maxSelect": 1,
    "name": "karat",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "24",
      "22",
      "21",
      "18",
      "14",
      "10",
      "6"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3573984430")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "ring, chain"
    ]
  }))

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select3617682138",
    "maxSelect": 1,
    "name": "karat",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "24, 22, 21, 18, 14, 10 , 6"
    ]
  }))

  return app.save(collection)
})
