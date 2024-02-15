package order

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/divit-stem/divit-integration-samples/golang/utils"
)

const HOST = "http://localhost:8080"
const SUCCESS_REDIRECT_URL = "%s/?result=success"
const FAILURE_REDIRECT_URL = "%s/?result=failure"
const WEBHOOK_URL = "https://divit.requestcatcher.com/" // note: since webhook cannot reach localhost, here i catch the webhook payload with a public request catcher site
const CREATE_ORDER_API_ENDPOINT = "https://sandbox-api.divit.dev/paynow/orders"
const CREATE_PAYLATER_ORDER_API_ENDPOINT = "https://sandbox-api.divit.dev/paylater/orders"
const EXPIRY_PERIOD = 1800 // 30 minutes

func CreateDivitOrder(apiKey, orderType, firstname, lastname, email, phone, language, currency, itemType string, orderTotal float64, items []map[string]interface{}) (*CreateDivitOrderResp, error) {

	var (
		p       CreateDivitOrderParam
		resp    DivitRespWrapper
		myNewID = utils.GenOrderID()
	)
	p.Customer = DivitCustomerParam{
		FirstName: strings.TrimSpace(firstname),
		LastName:  strings.TrimSpace(lastname),
		Email:     strings.TrimSpace(email),
		Tel:       strings.TrimSpace(phone),
		Language:  strings.TrimSpace(language),
	}
	p.Order = DivitOrderParam{
		TotalAmount: Money{
			Currency: strings.TrimSpace(currency),
			Amount:   int64(math.Round(orderTotal * 100)),
		},
		WebhookSuccess:        fmt.Sprintf(SUCCESS_REDIRECT_URL, HOST),
		WebhookFailure:        fmt.Sprintf(FAILURE_REDIRECT_URL, HOST),
		WebhookEvents:         WEBHOOK_URL,
		ExpiredAt:             int(time.Now().Unix() + EXPIRY_PERIOD),
		MerchantRef:           myNewID,
		UniqueMerchantOrderID: myNewID,
		Language:              strings.TrimSpace(language),
		PromoCode:             "",
		MilesForReward:        0,
		TotalForReward: Money{
			Currency: strings.TrimSpace(currency),
			Amount:   0,
		},
	}
	p.Order.OrderItems = make([]map[string]interface{}, 0)
	for _, v := range items {
		var item = make(map[string]interface{})
		item["itemType"] = itemType
		item["itemData"] = make(map[string]interface{})
		if itemType == "retail" {
			item["itemData"] = map[string]interface{}{
				"productID":    "ID",
				"productTitle": v["productTitle"],
				"qty":          v["productQty"],
				"unitPrice":    v["unitPrice"],
			}
		} else {
			item["itemData"] = map[string]interface{}{
				"aircraft": map[string]string{
					"code": fmt.Sprintf("%v", v["aircraft"]),
				},
				"departure": map[string]string{
					"iataCode": fmt.Sprintf("%v", v["departure"]),
					"terminal": "",
					"at":       fmt.Sprintf("%v", v["departureat"]),
				},
				"arrival": map[string]string{
					"iataCode": fmt.Sprintf("%v", v["arrival"]),
					"terminal": "",
					"at":       fmt.Sprintf("%v", v["arriveat"]),
				},
				"carrierCode": fmt.Sprintf("%v", v["aircraft"]),
				"number":      "1",
				"operating": map[string]string{
					"carrierCode": fmt.Sprintf("%v", v["aircraft"]),
				},
				"duration":     "1:00",
				"numerOfStops": 0,
				"id":           "",
			}
		}
		p.Order.OrderItems = append(p.Order.OrderItems, item)
	}

	paramInBytes, _ := json.Marshal(p)
	fmt.Printf("parameter to be sent: %s\n", string(paramInBytes))

	endpoint := CREATE_ORDER_API_ENDPOINT
	if orderType == "paylater" {
		endpoint = CREATE_PAYLATER_ORDER_API_ENDPOINT
	}
	result, err := utils.RestClient(context.Background(), apiKey, endpoint, "POST", paramInBytes)
	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(result, &resp)
	if err != nil {
		return nil, err
	}
	return &resp.Data, nil
}
