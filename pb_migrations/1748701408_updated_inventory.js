/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3573984430")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "QB4_[0-9]{6}",
    "hidden": false,
    "id": "text309285470",
    "max": 0,
    "min": 0,
    "name": "item_id",
    "pattern": "^[A-Z0-9_]+$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3573984430")

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "MIT[0-9]{6}",
    "hidden": false,
    "id": "text309285470",
    "max": 0,
    "min": 0,
    "name": "item_id",
    "pattern": "^[A-Z0-9]+$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
