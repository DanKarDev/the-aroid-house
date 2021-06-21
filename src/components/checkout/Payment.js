import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import { Box, chakra, Divider, Flex, Spacer, Text } from "@chakra-ui/react";

import Item from "./Item";
import { PaymentContext } from "../../context/PaymentContext";
import { CartContext } from "../../context/CartContext";
import { SmallButton } from "../buttons/SmallButton";

import { Customer } from "domain/models/entities/Customer";
import { CartItem } from "domain/models/entities/CartItem";
import { Cart } from "domain/models/entities/Cart";
import {
  OrderState,
  OrderAggregate,
} from "domain/models/aggregates/OrderAggregate";

const Payment = (props) => {
  let name = "";
  let email = "";
  let address = "";
  let number = 0;
  let itemList = [];
  let delivery = 0;

  const [paymentItem, setPaymentItem] = useContext(PaymentContext);
  const [_, setItems] = useContext(CartContext);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleOrderSubmit = async () => {
    setLoading(true);
    const fullName = paymentItem[1].fullName;
    const phoneNumber = paymentItem[1].phone;
    const email = paymentItem[1].email;
    const address = paymentItem[1].address;
    const isSelfCollect = paymentItem[0].deliveryCost == 0;

    const customer = Customer.create({
      fullName,
      phoneNumber,
      email,
      address,
    }).getResult();

    // populate cart to add into order
    let cartItems = [];
    paymentItem[0].items.map((item) => {
      cartItems.push(
        CartItem.create({
          shopItemName: item.shopItemName,
          shopItemSlug: item.shopItemSlug,
          quantity: item.quantity,
          variant: item.variant,
          value: item.value,
        }).getResult()
      );
    });

    const order = OrderAggregate.create({
      cart: Cart.create({ cartItems: [...cartItems] }).getResult(),
      isSelfCollect,
      customer,
    }).getResult();
    order.changeState(OrderState.PAYMENT_UNCONFIRMED);

    await fetch("/api/order/createOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    setItems([]);
    setLoading(false);
    router.replace("/thankyou");
  };

  const handleRemove = () => {
    const newList = paymentItem.filter(
      (item) => paymentItem.indexOf(item) !== 1
    );

    setPaymentItem(newList);
  };

  if (paymentItem.length == 2) {
    name = paymentItem[1].fullName;
    email = paymentItem[1].email;
    address = paymentItem[1].address;
    number = paymentItem[1].phone;
    delivery = paymentItem[0].deliveryCost;
    itemList = paymentItem[0].items;
  }

  return (
    <Flex
      direction="column"
      paddingLeft={["5", "0"]}
      paddingTop="2"
      height="full"
      width={["100vw", "55vw"]}
    >
      <Flex direction={["column", "row"]}>
        <chakra.h3 fontSize="lg" color="background" textDecoration="underline">
          Name
        </chakra.h3>
        <Spacer />
        <chakra.h3 fontSize="md" color="background" padding="2">
          {name}
        </chakra.h3>
      </Flex>
      <Flex direction={["column", "row"]}>
        <chakra.h3 fontSize="lg" color="background" textDecoration="underline">
          Contact number
        </chakra.h3>
        <Spacer />
        <chakra.h3 fontSize="md" color="background" padding="2">
          {number}
        </chakra.h3>
      </Flex>
      <Flex direction={["column", "row"]}>
        <chakra.h3 fontSize="lg" color="background" textDecoration="underline">
          Email
        </chakra.h3>
        <Spacer />
        <Box fontSize="md" color="background" padding="2">
          {email}
        </Box>
      </Flex>
      <Flex direction={["column", "row"]}>
        <chakra.h3 fontSize="lg" color="background" textDecoration="underline">
          Address
        </chakra.h3>
        <Spacer />
        <Box fontSize="md" color="background" padding="2">
          {address}
        </Box>
      </Flex>
      <chakra.h3 fontSize="xl" color="background">
        Items
      </chakra.h3>
      <Divider width={["80vw", "55vw"]} />

      {itemList.map((item, i) => {
        return <Item item={item} key={i} index={i} />;
      })}
      {delivery > 0 ? (
        <Flex
          direction="row"
          marginBottom="2"
          paddingLeft="5"
          width={["80vw", "55vw"]}
        >
          <Text color="background">Delivery</Text>
          <Spacer />
          <Text color="background">SGD {delivery}</Text>
        </Flex>
      ) : (
        <Text marginLeft="5" marginY="2">
          Self Collect @ Begonia Drive
        </Text>
      )}
      <Divider width={["80vw", "55vw"]} />
      <Flex direction="row" paddingTop="2" width={["80vw", "55vw"]}>
        <chakra.h3 fontSize="lg" fontWeight="bold" color="background">
          Total
        </chakra.h3>
        <Spacer />
        <chakra.h3 fontSize="lg" fontWeight="bold" color="background">
          SGD{" "}
          {itemList.reduce((accumulator, cartItem) => {
            return accumulator + cartItem.value;
          }, 0) + delivery}
        </chakra.h3>
      </Flex>

      <Flex direction="row" marginTop="5" justifyContent="space-between">
        <SmallButton
          name={"Back"}
          onClick={() => {
            props.setTabIndex(0);
            handleRemove();
          }}
        />
        <SmallButton
          isLoading={loading}
          name={"Finish"}
          onClick={handleOrderSubmit}
        />
      </Flex>
    </Flex>
  );
};
export default Payment;
