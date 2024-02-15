package order

type CreateDivitOrderParam struct {
	Customer DivitCustomerParam `json:"customer"`
	Order    DivitOrderParam    `json:"order"`
}

type DivitOrderParam struct {
	TotalAmount           Money                    `json:"totalAmount"`
	WebhookSuccess        string                   `json:"webhookSuccess"`
	WebhookFailure        string                   `json:"webhookFailure"`
	WebhookEvents         string                   `json:"webhookEvents"`
	ExpiredAt             int                      `json:"expiredAt"`
	MerchantRef           string                   `json:"merchantRef"`
	UniqueMerchantOrderID string                   `json:"uniqueMerchantOrderID"`
	Language              string                   `json:"language"`
	OrderItems            []map[string]interface{} `json:"orderItems"`
	MilesForReward        int64                    `json:"milesForReward"`
	PromoCode             string                   `json:"promoCode"`
	TotalForReward        Money                    `json:"totalForReward"`
}

type DivitCustomerParam struct {
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Tel       string `json:"tel"`
	Language  string `json:"language"`
}

type Money struct {
	Currency string `json:"currency"`
	Amount   int64  `json:"amount"`
}

type DivitRespWrapper struct {
	Code    int                  `json:"code"`
	Message string               `json:"message"`
	Data    CreateDivitOrderResp `json:"data"`
}

type CreateDivitOrderResp struct {
	RedirectURI string `json:"redirectURI"`
	Token       string `json:"token"`
	OrderID     string `json:"orderID"`
}
