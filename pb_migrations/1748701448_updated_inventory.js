/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3573984430")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_wKzWshZcft` ON `inventory` (`item_id`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3573984430")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
