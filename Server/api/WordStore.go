package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"word-roulette/interop"
)

const (
	SGN_LT uint8 = iota
	SGN_GT
	SGN_EQ
)

func stringCmp(str1, str2 string) uint8 {
	i := 0
	j := 0
	n1 := len(str1)
	n2 := len(str2)
	for i < n1 && j < n2 {
		if str1[i] > str2[i] {
			return SGN_GT
		} else if str1[i] < str2[i] {
			return SGN_LT
		}
		i++
		j++
	}
	if n1 > n2 {
		return SGN_GT
	} else if n1 < n2 {
		return SGN_LT
	}
	return SGN_EQ
}

type WordStore struct {
	words []string
}

func (ws *WordStore) loadWords() {
	fileBytes, err := os.ReadFile("./data/words_alpha.txt")
	if err != nil {
		fmt.Println("api.WordStore.LoadWords: Error reading file", err)
		return
	}

	var word string = ""
	for _, currByte := range fileBytes {
		if currByte == byte('\n') {
			wordBytes := []byte(word)
			// remove carriage return '\r'
			formattedWord := string(wordBytes[:len(wordBytes)-1])
			ws.words = append(ws.words, formattedWord)
			word = ""
			continue
		}
		word += string(currByte)
	}
	if len(word) > 0 {
		ws.words = append(ws.words, word)
	}

	mergeSort(ws.words, 0, len(ws.words)-1, stringCmp)
}

func (ws *WordStore) IsWordPresent(word string) bool {
	L := 0
	R := len(ws.words)

	for L <= R {
		var mid int = (L + R) / 2
		var currWord string = ws.words[mid]
		var cmpSGN = stringCmp(word, currWord)

		if cmpSGN == SGN_EQ {
			return true
		} else if cmpSGN == SGN_GT {
			L = mid + 1
		} else {
			R = mid - 1
		}
	}
	return false
}

var wordStoreInstance *WordStore = nil

func getWordStoreInstance() *WordStore {
	if wordStoreInstance != nil {
		return wordStoreInstance
	}

	wordStoreInstance = &WordStore{
		words: make([]string, 0),
	}
	wordStoreInstance.loadWords()
	return wordStoreInstance
}

func HandleIsValidRequest(w http.ResponseWriter, req *http.Request) {
	decoder := json.NewDecoder(req.Body)

	isWordValidRequest := interop.IsWordValidRequest{}
	err := decoder.Decode(&isWordValidRequest)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	wordStore := getWordStoreInstance()
	isWordPresent := wordStore.IsWordPresent(isWordValidRequest.Word)

	isWordValidResponse := interop.IsWordValidResponse{
		IsValid: isWordPresent,
	}

	payload, err := json.Marshal(isWordValidResponse)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "application/json")
	w.Write(payload)
}

func mergeSort(arr []string, L, R int, comparator func(str1, str2 string) uint8) {
	if L >= R {
		return
	}

	var mid int = (L + R) / 2
	mergeSort(arr, L, mid, comparator)
	mergeSort(arr, mid+1, R, comparator)

	merge(arr, L, mid, R, comparator)
}

func merge(arr []string, L, mid, R int, comparator func(str1, str2 string) uint8) {
	var n1 int = (mid - L + 1)
	var n2 int = (R - mid)
	left := make([]string, n1)
	copy(left, arr[L:mid+1])

	right := make([]string, n2)
	copy(right, arr[mid+1:R+1])

	i := 0
	j := 0
	k := L
	for i < len(left) && j < len(right) {
		if comparator(left[i], right[j]) == SGN_LT {
			arr[k] = left[i]
			k++
			i++
		} else {
			arr[k] = right[j]
			j++
			k++
		}
	}
	for i < len(left) {
		arr[k] = left[i]
		i++
		k++
	}
	for j < len(right) {
		arr[k] = right[j]
		j++
		k++
	}
}
