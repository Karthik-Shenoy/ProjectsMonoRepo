package api

import "time"

type Client struct {
	ClientId      string
	LastHeartBeat time.Time
	FolderPath    string
	DBPort        uint16
}
