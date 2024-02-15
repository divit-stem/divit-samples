<?php
include_once "types.php";
include_once(__DIR__ . '/../utils/utils.php');

const HOST = "http://localhost:3000";
const SUCCESS_REDIRECT_URL = "%s/?result=success";
const FAILURE_REDIRECT_URL = "%s/?result=failure";
const WEBHOOK_URL = "https://divit.requestcatcher.com/";
const CREATE_ORDER_API_ENDPOINT = "https://sandbox-api.divit.dev/paynow/orders";
const CREATE_PAYLATER_ORDER_API_ENDPOINT = "https://sandbox-api.divit.dev/paylater/orders";
const EXPIRY_PERIOD = 1800; // 30 minutes

function CreateDivitOrder($apiKey, $orderType, $firstname, $lastname, $email, $phone, $language, $currency, $itemType, $orderTotal, $items) {
    $customer = new DivitCustomerParam($firstname, $lastname, $email, $phone, $language);
    $myNewID = GenOrderID();
    $currency = trim($currency);
    $webhookSuccess = sprintf(SUCCESS_REDIRECT_URL, HOST);
    $webhookFailure = sprintf(FAILURE_REDIRECT_URL, HOST);
    $webhookEvents = WEBHOOK_URL;
    $expiredAt = time() + EXPIRY_PERIOD;
    $merchantRef = $myNewID;
    $uniqueMerchantOrderID = $myNewID;
    $language = trim($language);
    $promoCode = "";
    $milesForReward = 0;
    $orderItems = array();

    $amount = round($orderTotal * 100);
    $money1 = new Money($currency, $amount);
    $money2 = new Money($currency, 0);
    $order = new DivitOrderParam(
        $money1, $webhookSuccess, $webhookFailure, $webhookEvents, $expiredAt, $merchantRef, $uniqueMerchantOrderID, $language, $orderItems, $milesForReward, $promoCode, $money2
    );
    foreach ($items as $v) {
        $item = array();
        $item["itemType"] = $itemType;
        if ($itemType == "retail") {
            $item["itemData"] = array(
                "productID" => "ID",
                "productTitle" => $v->productTitle,
                "qty" => $v->productQty,
                "unitPrice" => $v->unitPrice
            );
        } else {
            $item["itemData"] = array(
                "aircraft" => array(
                  "code" => strval($v->aircraft)
                ),
                "departure" => array(
                    "iataCode" => strval($v->departure),
                    "terminal" => "",
                    "at" => strval($v->departureat)
                ),
                "arrival" => array(
                    "iataCode" => strval($v->arrival),
                    "terminal" => "",
                    "at" => strval($v->arriveat)
                ),
                "carrierCode" => strval($v->aircraft),
                "number" => "1",
                "operating" => array(
                    "carrierCode" => strval($v->aircraft)
                ),
                "duration" => "1:00",
                "numerOfStops" => 0,
                "id" => ""
            );
        }
        $order->orderItems[] = $item;
    }

    $divitOrderParam = new CreateDivitOrderParam($customer, $order);
    $paramInJson = json_encode($divitOrderParam);

    $endpoint = CREATE_ORDER_API_ENDPOINT;
    if ($orderType == "paylater") {
      $endpoint = CREATE_PAYLATER_ORDER_API_ENDPOINT;
    }

    return RestClient($apiKey, $endpoint, "POST", $paramInJson);
}

?>
