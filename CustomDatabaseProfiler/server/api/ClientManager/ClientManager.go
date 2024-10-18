package api

import (
	"fmt"
	"os"
	"os/exec"
	"strconv"
	"sync"
	"time"
)

type ClientManager struct {
	intervalMs int64
	// map from client id to the last time we received a heartbeat from that client
	clientRegistry []Client
	portCounter    uint16
}

type JWTPayload struct {
	ClientId  string
	CreatedAt int64
}

func (mgr *ClientManager) AddClient(clientId string) {
	client := Client{
		ClientId:      clientId,
		LastHeartBeat: time.Now(),
	}

	// create a new folder for the client
	client.FolderPath = "../client_dirs/" + "client_" + clientId
	client.DBPort = mgr.portCounter
	os.Mkdir(client.FolderPath, os.ModeDir)

	// open log file
	logFile, err := os.OpenFile(client.FolderPath+"/db_logs.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		// handle error
		fmt.Println(err)
		return
	}
	defer logFile.Close()

	// spawn the database in the given folder
	cmd := exec.Command("../../db/database", strconv.Itoa(int(mgr.portCounter)))
	cmd.Dir = client.FolderPath
	cmd.Stdout = logFile
	cmd.Stderr = logFile
	fmt.Println("command", cmd.String())
	err = cmd.Start()

	if err != nil {
		fmt.Printf(err.Error() + " " + client.FolderPath)
		return
	}

	mgr.clientRegistry = append(mgr.clientRegistry, client)
	mgr.portCounter++
}

func (mgr *ClientManager) GetClient(clientId string) (*Client, bool) {
	for _, client := range mgr.clientRegistry {
		if client.ClientId == clientId {
			return &client, true
		}
	}
	return nil, false
}

func (mgr *ClientManager) HeartBeat(clientId string) {
	// update the heartbeat for a client
	for _, client := range mgr.clientRegistry {
		if client.ClientId == clientId {
			client.LastHeartBeat = time.Now()
		}
	}
}

func (mgr *ClientManager) Start() {
	// start a goroutine that will check for dead clients
	go func() {
		for {
			// yield to other goroutines
			time.Sleep(0)
			mgr.checkForDeadClients()
		}
	}()
}

func (mgr *ClientManager) checkForDeadClients() {
	// check for clients that have not sent a heartbeat in the last interval
	for i, client := range mgr.clientRegistry {
		if time.Since(client.LastHeartBeat).Milliseconds() > mgr.intervalMs {
			// client is dead, remove client from registry
			mgr.clientRegistry = append(mgr.clientRegistry[:i], mgr.clientRegistry[i+1:]...)
		}
	}
}

var singleTonMutex sync.Mutex
var clientManagerSingletonInstance *ClientManager = nil

func GetClientManagerInstance() *ClientManager {
	singleTonMutex.Lock()
	defer singleTonMutex.Unlock()
	if clientManagerSingletonInstance == nil {
		clientManagerSingletonInstance = &ClientManager{
			intervalMs:     500 * 1000,
			clientRegistry: make([]Client, 0),
			portCounter:    8080,
		}
		clientManagerSingletonInstance.Start()
	}

	return clientManagerSingletonInstance
}
