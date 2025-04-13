package database_service

import (
	"database/sql"
	"fmt"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/services/serviceinjector"

	_ "github.com/lib/pq"
)

func init() {
	var factory serviceinjector.FactoryFunction[DatabaseService] = func(args ...any) (*DatabaseService, error) {
		instance := &DatabaseService{}
		err := instance.initEnvVariables()

		if err != nil {
			return nil, err
		}

		err = instance.connect()

		if err != nil {
			return nil, err
		}

		return instance, nil
	}

	serviceinjector.RegisterService(factory)
}

func getServiceErrorOrigin(funcName string) string {
	return "DatabaseService." + funcName
}

// No connection pooling as of now can become a bottleneck
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

func (db *DatabaseService) Query(queryString string) (*sql.Rows, *apperrors.AppError) {
	rows, err := db.dbConn.Query(queryString)

	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.DataBaseService_Retryable_FailedToQueryDatabase,
			getServiceErrorOrigin("Query"),
			"Failed to query database : "+err.Error(),
		)
	}

	return rows, nil
}

func (db *DatabaseService) Dispose() {
	db.dbConn.Close()
}

func (db *DatabaseService) Prepare(queryString string) (*sql.Stmt, error) {
	return db.dbConn.Prepare("")
}
