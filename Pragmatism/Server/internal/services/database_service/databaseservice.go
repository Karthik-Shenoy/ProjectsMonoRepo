package database_service

import (
	"database/sql"
	"fmt"
	"sync"

	_ "github.com/lib/pq"
)

type DatabaseService struct {
	dbConn *sql.DB
}

func (db *DatabaseService) initEnvVariables() error {
	return InitEnvVariables()
}

func (db *DatabaseService) connect() error {
	dbConnString := fmt.Sprintf(
		"host=%s port= %d user=%s password=%s dbname=%s sslmode=disable",
		DB_SERVICE_CONFIG_host,
		DB_SERVICE_CONFIG_port,
		DB_SERVICE_CONFIG_user,
		DB_SERVICE_CONFIG_password,
		DB_SERVICE_CONFIG_dbName,
	)

	dbConn, err := sql.Open("postgres", dbConnString)

	if err != nil {
		return err
	}

	db.dbConn = dbConn
	return nil
}

func (db *DatabaseService) Query(queryString string) (*sql.Rows, error) {
	rows, err := db.dbConn.Query(queryString)
	return rows, err
}

func (db *DatabaseService) Dispose() {
	db.dbConn.Close()
}

func (db *DatabaseService) Prepare(queryString string) (*sql.Stmt, error) {
	return db.dbConn.Prepare("")
}

var singletonMutex sync.Mutex
var singletonInstance *DatabaseService = nil

func GetInstance() (*DatabaseService, error) {

	if singletonInstance == nil {
		singletonMutex.Lock()

		singletonInstance = &DatabaseService{}
		err := singletonInstance.initEnvVariables()

		if err != nil {
			return nil, err
		}

		err = singletonInstance.connect()

		if err != nil {
			return nil, err
		}

		singletonMutex.Unlock()
	}
	return singletonInstance, nil
}
