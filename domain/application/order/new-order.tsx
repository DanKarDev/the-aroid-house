import { OrderAggregate } from "domain/models/aggregates/OrderAggregate";
import { IOrderRepo } from "domain/models/infrastructure/IOrderRepository";
import { sendGridEmailNotification } from "../notification/sendgrid-email-notification";
import { telegramBotNotification } from "../notification/telegram-bot-notification";

interface INewOrder {
  orderRepo: IOrderRepo;
  orderAggregate: OrderAggregate;
}

export const newOrder = async ({ orderRepo, orderAggregate }: INewOrder) => {
  // no matter what save order first
  await orderRepo.save(orderAggregate);

  // send order confirmation email
  sendGridEmailNotification({ orderAggregate });

  return telegramBotNotification({ orderAggregate });
};
