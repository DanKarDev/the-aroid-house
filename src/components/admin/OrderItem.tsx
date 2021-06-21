import { FC, useState } from "react";
import {
  Button,
  Box,
  Flex,
  HStack,
  VStack,
  Heading,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spacer,
  Divider,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  FaUserAlt,
  FaShuttleVan,
  FaDirections,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";

import {
  OrderAggregate,
  OrderState,
} from "domain/models/aggregates/OrderAggregate";
import { CartItem } from "domain/models/entities/CartItem";
import { UniqueEntityID } from "types-ddd/dist/src";

const orderStateColors = {
  PAYMENT_UNCONFIRMED: "blue",
  PAYMENT_CONFIRMED: "orange",
  PACKED: "cyan",
  ON_DELIVERY: "yellow",
  DELIVERED: "green",
  CANCELLED: "red",
};

type Props = {
  order: OrderAggregate;
  mutate: Function;
};

const OrderItem: FC<Props> = ({ order, mutate }) => {
  const [loading, setLoading] = useState(false);

  const handleOrderStateChange = async (
    orderID: UniqueEntityID,
    newOrderState: OrderState
  ) => {
    setLoading(true);
    fetch(
      // @ts-ignore
      `/api/order/changeOrderState?orderID=${orderID.value}&newOrderState=${newOrderState}`
    ).then(() => {
      mutate();
      setLoading(false);
    });
  };

  return (
    <Flex
      direction="column"
      borderRadius="lg"
      borderWidth="1px"
      shadow="sm"
      backgroundColor="gray.50"
      margin="4"
    >
      <Box padding="4" minWidth={["xs", "md", "lg"]}>
        <HStack>
          <VStack alignItems="flex-start" spacing="1">
            {order.cart.cartItems.map((cartItem: CartItem, i: number) => (
              <Text key={i}>
                ➤ {cartItem.shopItemName} {cartItem.variant} x{" "}
                {cartItem.quantity}
              </Text>
            ))}
          </VStack>
          <Spacer />
          <Box alignSelf="flex-end">
            <Heading fontSize="lg">SGD {order.orderTotalAmount}</Heading>
          </Box>
        </HStack>
      </Box>

      <Divider />

      <Box padding="4">
        <HStack>
          <Icon as={FaClock} />
          <Text>
            {new Date(order.orderHistory[0].dateString).toDateString()}
          </Text>
        </HStack>
        <HStack>
          <Icon as={FaShuttleVan} />
          {order.isSelfCollect ? (
            <Text>Self-collect</Text>
          ) : (
            <Text>Delivery</Text>
          )}
        </HStack>
        <HStack>
          <Icon as={FaUserAlt} />
          <Text>{order.customer.fullName}</Text>
        </HStack>
        <HStack>
          <Icon as={FaPhoneAlt} />
          <Text>{order.customer.phoneNumber}</Text>
        </HStack>
        <HStack>
          <Icon as={FaDirections} />
          <Text>{order.customer.address}</Text>
        </HStack>
      </Box>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          isLoading={loading}
          backgroundColor={`${orderStateColors[order.currentState]}.300`}
        >
          Change Order State
        </MenuButton>
        <MenuList>
          {Object.keys(OrderState).map((orderState: string, i: number) => {
            return (
              <MenuItem
                key={i}
                backgroundColor={`${
                  orderStateColors[orderState as OrderState]
                }.300`}
                onClick={() =>
                  handleOrderStateChange(
                    order.orderID,
                    OrderState[orderState as OrderState]
                  )
                }
              >
                {orderState}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default OrderItem;
