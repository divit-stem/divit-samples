<?php
include_once "./create-order/order.php";
include_once "./create-order/types.php";
include_once "./utils/utils.php";

$env = parse_ini_file('.env');

foreach ($env as $key => $value) {
    $_ENV[$key] = $value;
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $requestData = file_get_contents('php://input');
        $p = json_decode($requestData);
        if (!isset($_ENV['API_KEY'])) {
            echo json_encode([
                'code' => -1,
                'message' => 'No API key provided. Please set the env variable to run.'
            ]);
        }
        $apiKey = $_ENV['API_KEY'];
        $firstname = $p->firstname;
        $lastname = $p->lastname;
        $email = $p->email;
        $phone = "";
        $language = $p->language;
        $currency = $p->currency;
        $itemType = $p->itemType;
        $orderTotal = $p->orderTotal;
        $orderType = $p->orderType;
        $items = $p->items;
        $result = CreateDivitOrder($apiKey, $orderType, $firstname, $lastname, $email, $phone, $language, $currency, $itemType, $orderTotal, $items);
        // Set the response headers to indicate JSON content
        echo $result;
        exit();
    } else {
        echo json_encode([
            'code' => -1,
            'message' => 'Invalid method'
        ]);
        exit();
    }
}
?>
