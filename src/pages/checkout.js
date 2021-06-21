import {
  Flex,
  Center,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
} from "@chakra-ui/react";
import { HeaderCheckout } from "../components/layout/HeaderCheckout";
import Details from "../components/checkout/Details";
import Payment from "../components/checkout/Payment";
import { PaymentContext } from "../context/PaymentContext";
import React, { useState, useContext } from "react";

function checkout() {
  const toast = useToast();

  const [tabIndex, setTabIndex] = useState(0);
  const handleTabsChange = (index) => setTabIndex(index);

  const [paymentItem, setPaymentItem] = useContext(PaymentContext);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const updateFullName = (fullName) => {
    setFullName(fullName);
  };
  const updateEmail = (email) => {
    setEmail(email);
  };
  const updateAddress = (address) => {
    setAddress(address);
  };
  const updatePhone = (phone) => {
    setPhone(phone);
  };

  const addPaymentItem = (e) => {
    if (fullName === "") {
      toast({
        title: "Name empty",
        description: "Please fill in your name",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } else if (email === "") {
      toast({
        title: "Email empty",
        description: "Please fill in your email",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } else if (address === "") {
      toast({
        title: "Address empty",
        description: "Please fill in your address",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } else if (phone === "") {
      toast({
        title: "Phone empty",
        description: "Please fill in your phone number",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    } else if (phone !== "") {
      const validPhoneNumber = /[8|9][0-9]{7}$/;
      if (!phone.match(validPhoneNumber)) {
        toast({
          title: "Phone empty",
          description: "Phone number must start with 9 or 8 and have 8 digits",
          status: "warning",
          duration: 2500,
          isClosable: true,
          position: "top",
        });
      } else {
        setPaymentItem((prevItems) => [
          ...prevItems,
          { fullName, email, address, phone },
        ]);
      }
    } else {
      toast({
        title: "Something went wrong",
        description:
          "Something went wrong please message marcus on instagram instead",
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <Center backgroundColor="background">
      <Flex width={["full", "60vw"]} height="100vh" direction="column">
        <HeaderCheckout />
        <Flex
          backgroundColor="text"
          height="150vh"
          width="auto"
          borderRadius="20px 20px 0px 0px"
          direction="column"
        >
          <Tabs
            variant="enclosed"
            isFitted
            index={paymentItem.length != 1 ? 1 : 0}
            onChange={handleTabsChange}
          >
            <TabList>
              <Tab
                textColor="background"
                _selected={{ color: "background", bg: "text" }}
                backgroundColor="secondaryBackground"
                borderRadius="20px 0px 0px 0px"
                isDisabled={tabIndex == 1}
              >
                Contact
              </Tab>
              <Tab
                textColor="background"
                _selected={{ color: "background", bg: "text" }}
                backgroundColor="secondaryBackground"
                borderRadius="0px 20px 0px 0px"
                isDisabled={tabIndex == 0}
              >
                Payment
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel color="background">
                <Details
                  setTabIndex={setTabIndex}
                  paymentItem={paymentItem}
                  addPaymentItem={addPaymentItem}
                  fullName={fullName}
                  email={email}
                  address={address}
                  phone={phone}
                  updateFullName={updateFullName}
                  updateEmail={updateEmail}
                  updateAddress={updateAddress}
                  updatePhone={updatePhone}
                />
              </TabPanel>
              <TabPanel color="background" backgroundColor="text">
                <Center>
                  <Payment setTabIndex={setTabIndex} />
                </Center>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Flex>
    </Center>
  );
}

export default checkout;
