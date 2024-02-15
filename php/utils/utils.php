<?php

function GenOrderID()
{
    $uppercaseCharset = "ABCDEFGHJKMNPQRSTUVWXYZ";
    $result = '';
    for ($key = 1; $key <= 5; $key++) {
        $res = random_int(0, 22);
        $keyGen = $uppercaseCharset[$res];
        $stringGen = sprintf("%c", $keyGen);
        $result .= $stringGen;
    }
    return time() . $result;
}

function RestClient($apiKey, $targetURL, $verb, $p) : string
{
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $targetURL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $verb);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $p);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Api-Key: ' . $apiKey,
        'Content-Type: application/json'
    ));

    $response = curl_exec($ch);
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception("cURL request error: $error");
    }

    $statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($statusCode >= 300) {
        curl_close($ch);
        throw new Exception("HTTP request failed with status code $statusCode: $response");
    }

    curl_close($ch);
    return json_encode($response);
}

?>
