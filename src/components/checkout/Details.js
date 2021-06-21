import {
  Box,
  Flex,
  chakra,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";

import { SmallButton } from "../buttons/SmallButton";

const Details = (props) => {
  return (
    <Flex
      direction="column"
      width={["full", "auto"]}
      height="full"
      paddingX="5"
    >
      <chakra.h3 marginTop="2" fontSize="xl" color="background">
        Contact details
      </chakra.h3>
      <FormControl marginTop="2" id="last-name" isRequired>
        <FormLabel>Full name</FormLabel>
        <Input
          backgroundColor="background"
          placeholder="name"
          value={props.fullName}
          onChange={(e) => props.updateFullName(e.target.value)}
          color="text"
        />
      </FormControl>
      <FormControl marginTop="2" id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          backgroundColor="background"
          placeholder="Email"
          value={props.email}
          onChange={(e) => props.updateEmail(e.target.value)}
          color="text"
        />
      </FormControl>
      <FormControl marginTop="2" id="address" isRequired>
        <FormLabel>Address</FormLabel>
        <Input
          backgroundColor="background"
          placeholder="Address"
          value={props.address}
          onChange={(e) => props.updateAddress(e.target.value)}
          color="text"
        />
      </FormControl>
      <FormControl marginTop="2" id="phone" isRequired>
        <FormLabel>Phone Number (91234567)</FormLabel>
        <Input
          backgroundColor="background"
          placeholder="91234567"
          value={props.phone}
          onChange={(e) => props.updatePhone(e.target.value)}
          color="text"
        />
      </FormControl>
      <Flex marginTop="5" justifyContent="flex-end">
        <SmallButton
          onClick={() => {
            props.addPaymentItem();
          }}
          name="Next"
        />
      </Flex>
    </Flex>
  );
};
export default Details;
