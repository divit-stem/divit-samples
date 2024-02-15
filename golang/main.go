package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	order "github.com/divit-stem/divit-integration-samples/golang/create-order"
)

type checkoutPayload struct {
	Firstname  string                   `json:"firstname"`
	Lastname   string                   `json:"lastname"`
	Email      string                   `json:"email"`
	Phone      string                   `json:"phone"`
	Language   string                   `json:"language"`
	Currency   string                   `json:"currency"`
	ItemType   string                   `json:"itemType"`
	Items      []map[string]interface{} `json:"items"`
	OrderTotal float64                  `json:"orderTotal"`
	OrderType  string                   `json:"orderType"`
}

func loadHtml(w http.ResponseWriter, r *http.Request) {
	// serving the static html file
	http.ServeFile(w, r, "./index.html")
}

func checkout(w http.ResponseWriter, req *http.Request) {
	// response in json format
	w.Header().Set("Content-Type", "application/json")
	if req.Method == "POST" {
		var (
			p = checkoutPayload{
				Items: make([]map[string]interface{}, 0),
			}
			decoder = json.NewDecoder(req.Body)
		)
		err := decoder.Decode(&p)
		if err != nil {
			resp(w, -1, err.Error(), nil)
			return
		}
		// extract the parameters from POST
		result, err := order.CreateDivitOrder(os.Getenv("API_KEY"), p.OrderType,
			p.Firstname, p.Lastname, p.Email, p.Phone, p.Language, p.Currency, p.ItemType, p.OrderTotal, p.Items)
		if err != nil {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"code":    -1,
				"message": err.Error(),
			})
			return
		}
		resp(w, 0, "ok", result)
		return
	}
	resp(w, -1, "invalid method", nil)
}

func resp(w http.ResponseWriter, code int, message string, data interface{}) {
	var result = make(map[string]interface{})
	result["code"] = code
	result["message"] = message
	if data != nil {
		result["data"] = data
	}
	json.NewEncoder(w).Encode(result)
}

func main() {
	if os.Getenv("API_KEY") == "" {
		panic("no api-key, please set the env variable to run")
	}

	http.HandleFunc("/checkout", checkout)
	http.HandleFunc("/", loadHtml)

	fmt.Println("start serving at localhost:8080")
	http.ListenAndServe(":8080", nil)
}
