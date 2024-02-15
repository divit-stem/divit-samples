<?php
class CreateDivitOrderParam {
    public DivitCustomerParam $customer;
    public DivitOrderParam $order;

    public function __construct(DivitCustomerParam $customer, DivitOrderParam $order) {
        $this->customer = $customer;
        $this->order = $order;
    }
}

class DivitOrderParam {
    public Money $totalAmount;
    public string $webhookSuccess;
    public string $webhookFailure;
    public string $webhookEvents;
    public int $expiredAt;
    public string $merchantRef;
    public string $uniqueMerchantOrderID;
    public string $language;
    public array $orderItems;
    public int $milesForReward;
    public string $promoCode;
    public Money $totalForReward;

    public function __construct(
        Money $totalAmount,
        string $webhookSuccess,
        string $webhookFailure,
        string $webhookEvents,
        int $expiredAt,
        string $merchantRef,
        string $uniqueMerchantOrderID,
        string $language,
        array $orderItems,
        int $milesForReward,
        string $promoCode,
        Money $totalForReward
    ) {
        $this->totalAmount = $totalAmount;
        $this->webhookSuccess = $webhookSuccess;
        $this->webhookFailure = $webhookFailure;
        $this->webhookEvents = $webhookEvents;
        $this->expiredAt = $expiredAt;
        $this->merchantRef = $merchantRef;
        $this->uniqueMerchantOrderID = $uniqueMerchantOrderID;
        $this->language = $language;
        $this->orderItems = $orderItems;
        $this->milesForReward = $milesForReward;
        $this->promoCode = $promoCode;
        $this->totalForReward = $totalForReward;
    }
}

class DivitCustomerParam {
    public string $firstName;
    public string $lastName;
    public string $email;
    public string $tel;
    public string $language;

    public function __construct(
        string $firstName,
        string $lastName,
        string $email,
        string $tel,
        string $language
    ) {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->email = $email;
        $this->tel = $tel;
        $this->language = $language;
    }
}

class Money {
    public string $currency;
    public int $amount;

    public function __construct(string $currency, int $amount) {
        $this->currency = $currency;
        $this->amount = $amount;
    }
}

?>
