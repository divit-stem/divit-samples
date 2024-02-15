package utils

import (
	"bytes"
	"context"
	"crypto/rand"
	"fmt"
	"io"
	"math/big"
	"net/http"
	"time"
)

func GenOrderID() string {
	const UPPERCASE_CHARSET string = "ABCDEFGHJKMNPQRSTUVWXYZ"
	result := ""
	for key := 1; key <= 5; key++ {
		res, _ := rand.Int(rand.Reader, big.NewInt(23))
		keyGen := UPPERCASE_CHARSET[res.Int64()]
		stringGen := fmt.Sprintf("%c", keyGen)
		result += stringGen
	}
	return fmt.Sprintf("%d%s", time.Now().Unix(), result)
}

func RestClient(ctx context.Context, apiKey, targetURL, verb string, p []byte) ([]byte, error) {
	var (
		result   = make([]byte, 0)
		client   = &http.Client{}
		request  *http.Request
		response *http.Response
		err      error
	)
	request, err = http.NewRequest(verb, targetURL, bytes.NewBuffer(p))
	if err != nil {
		return result, err
	}
	request.Header.Set("Api-Key", apiKey)
	request.Header.Set("Content-Type", "application/json")

	response, err = client.Do(request)
	if err != nil {
		return result, err
	}
	defer response.Body.Close()

	b, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}

	if response.StatusCode >= 300 {
		return nil, fmt.Errorf("%s", string(b))
	}

	fmt.Printf("body %s\n", string(b))
	return b, err
}
