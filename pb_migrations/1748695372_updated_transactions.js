/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // remove field
  collection.fields.removeById("relation309285470")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "json3776899405",
    "maxSize": 0,
    "name": "items",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number3097235076",
    "max": null,
    "min": null,
    "name": "subtotal",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number2533970805",
    "max": null,
    "min": null,
    "name": "making_charges",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1186288468",
    "max": null,
    "min": null,
    "name": "total_amount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3174063690")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3573984430",
    "hidden": false,
    "id": "relation309285470",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "item_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("json3776899405")

  // remove field
  collection.fields.removeById("number3097235076")

  // remove field
  collection.fields.removeById("number2533970805")

  // remove field
  collection.fields.removeById("number1186288468")

  return app.save(collection)
})
