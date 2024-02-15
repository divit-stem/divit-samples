const { restClient, genOrderID } = require("../utils/utils");

const SUCCESS_REDIRECT_URL = "/?result=success";
const FAILURE_REDIRECT_URL = "/?result=failure";
const WEBHOOK_URL = "https://divit.requestcatcher.com/"; // note: since webhook cannot reach localhost, here i catch the webhook payload with a public request catcher site
const API_HOST = "https://sandbox-api.divit.dev";
const CREATE_ORDER_API_ENDPOINT = "/paynow/orders";
const CREATE_PAYLATER_ORDER_API_ENDPOINT = "/paylater/orders";
const EXPIRY_PERIOD = 1800; // 30 minutes

const createDivitOrder = async (
  host,
  apiKey,
  orderType,
  firstName,
  lastName,
  email,
  phone,
  language,
  currency,
  itemType,
  orderTotal,
  items
) => {
  let p = {};
  let myNewID = genOrderID();

  p.customer = {
    firstname: firstName.trim(),
    lastname: lastName.trim(),
    email: email?.trim(),
    tel: phone?.trim() || "undefined",
    language: language?.trim(),
  };

  p.order = {
    totalAmount: {
      currency: currency.trim(),
      amount: Math.round(orderTotal * 100),
    },
    webhookSuccess: `${host}${SUCCESS_REDIRECT_URL}`,
    webhookFailure: `${host}${FAILURE_REDIRECT_URL}`,
    webhookEvents: WEBHOOK_URL,
    expiredAt: +(new Date().getSeconds + EXPIRY_PERIOD),
    merchantRef: myNewID,
    uniqueMerchantOrderID: myNewID,
    language: language?.trim(),
    promoCode: "",
    milesForReward: 0,
    totalForReward: {
      currency: currency?.trim(),
      amount: 0,
    },
  };

  p.order.orderItems = [];

  items.map((data) => {
    let item = {};
    item.itemType = itemType;
    item.itemData = {};

    if (itemType === "retail") {
      item.itemData = {
        productID: "ID",
        productTitle: data.productTitle,
        qty: data.productQty,
        unitPrice: data.unitPrice,
      };
    } else {
      item.itemData = {
        aircraft: {
          code: data.aircraft,
        },
        departure: {
          iataCode: data.departure,
          terminal: "",
          at: data.departureat,
        },
        arrival: {
          iataCode: data.arrival,
          terminal: "",
          at: data.arrivalat,
        },
        carrierCode: data.aircraft,
        number: "1",
        operating: {
          carrierCode: data.aircraft,
        },
        duration: "1:00",
        numberOfStops: 0,
        id: "",
      };
    }

    p.order.orderItems.push(item);
  });

  let endpoint = CREATE_ORDER_API_ENDPOINT;
  if (orderType === "paylater") {
    endpoint = CREATE_PAYLATER_ORDER_API_ENDPOINT;
  }

  let data = await restClient(apiKey, API_HOST, endpoint, p);
  return data;
};

module.exports = {
  createDivitOrder,
};
