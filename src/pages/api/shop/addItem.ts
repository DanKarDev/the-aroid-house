import type { NextApiRequest, NextApiResponse } from "next";

import { MongoShopRepository } from "src/domain/infrastructure/MongoShopRepository";
import { connectToDatabase } from "src/libs/mongodb";
import { addItemToShop } from "src/domain/application/shop/add-item-to-shop";
import { ShopItem } from "src/domain/models/entities/ShopItem";

module.exports = async (request: NextApiRequest, response: NextApiResponse) => {
  const { db } = await connectToDatabase();
  const shopRepo = MongoShopRepository.create(db);

  const { body } = request;
  const newItem = ShopItem.create(body).getResult();

  const result = await addItemToShop({
    shopRepo,
    shopName: "TheAroyHouse",
    shopItem: newItem,
  });

  response.status(200).json(result);
};
