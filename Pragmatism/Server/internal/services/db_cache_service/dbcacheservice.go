package db_cache_service

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/helpers"
	"pragmatism/internal/services/database_service"
	"pragmatism/internal/services/serviceinjector"
)

// initialize package and register the service
func init() {
	var factory serviceinjector.FactoryFunction[DBCacheService] = func(args ...any) (*DBCacheService, error) {
		dbService, ok := args[0].(*database_service.DatabaseService)
		if !ok || dbService == nil {
			return nil, fmt.Errorf("DBCacheService.factory: invalid argument type or nil value")
		}
		return &DBCacheService{
			dbService: dbService,
			cache:     make(map[string]*CacheRecord),
		}, nil
	}

	// Type is inferred here
	serviceinjector.RegisterService(factory)
}

func getServiceErrorOrigin(funcName string) string {
	return "DBCacheService." + funcName
}

type CacheRecord struct {
	Data      []byte
	TTL       int64
	CreatedAt int64
}

type DBCacheService struct {
	dbService *database_service.DatabaseService
	cache     map[string]*CacheRecord
}

func (dbCache *DBCacheService) Query(query string, shouldForceFetch bool) ([]byte, *apperrors.AppError) {

	if !shouldForceFetch && dbCache.cache[query] != nil {
		if dbCache.cache[query].CreatedAt+dbCache.cache[query].TTL > helpers.GetCurrentUnixTime() {
			return dbCache.cache[query].Data, nil
		}
	}

	rows, appErr := dbCache.dbService.Query(query)
	if appErr != nil {
		return nil, apperrors.NewAppErrorFromLowerLayerError(
			apperrors.DBCacheService_Retryable_FailedToQueryDatabase,
			getServiceErrorOrigin("Query"),
			"Failed to query database : "+appErr.Message,
			appErr,
		)
	}
	defer rows.Close()

	columns, err := getCleanedColumns(rows)

	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.DBCacheService_Retryable_FailedToGetCleanedColumns,
			getServiceErrorOrigin("Query"),
			"Failed to get cleaned columns : "+err.Error(),
		)
	}

	typeInfo := make(map[string]string)
	columnTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.DBCacheService_Retryable_FailedToGetColumnTypes,
			getServiceErrorOrigin("Query"),
			"Failed to get cleaned columns : "+err.Error(),
		)
	}

	for _, columnType := range columnTypes {
		camelCaseColumnName := helpers.ConvertSnakeToCamelCase(columnType.Name())
		typeInfo[camelCaseColumnName] = columnType.DatabaseTypeName()
	}

	convertedMapRows := make([]map[string]interface{}, 0)
	for rows.Next() {
		// ptrs to byte slices [](*[]byte)
		values := make([]interface{}, len(columns))
		for i := range values {
			// ptr to byte slice
			values[i] = new([]byte)
		}
		if err := rows.Scan(values...); err != nil {
			return nil, apperrors.NewAppError(
				apperrors.DBCacheService_Retryable_FailedToScanRows,
				getServiceErrorOrigin("Query"),
				"Failed to scan rows : "+err.Error(),
			)
		}
		convertedMapRow := make(map[string]interface{})
		for i, column := range columns {
			switch typeInfo[column] {
			case "INT4":
				convertedMapRow[column] = getIntFromBytes(*(values[i].(*[]byte)))
			case "BOOL":
				convertedMapRow[column] = getBoolFromBytes(*(values[i].(*[]byte)))
			case "TEXT":
				convertedMapRow[column] = getStringFromBytes(*(values[i].(*[]byte)))
			default:
				convertedMapRow[column] = *(values[i].(*[]byte))
			}
		}
		convertedMapRows = append(convertedMapRows, convertedMapRow)
	}

	payload, err := json.Marshal(convertedMapRows)

	if err != nil {
		return nil, apperrors.NewAppError(
			apperrors.DBCacheService_NonRetryable_FailedToMarshalCacheData,
			getServiceErrorOrigin("Query"),
			"Failed to marshal cache data : "+err.Error(),
		)
	}

	dbCache.cache[query] = &CacheRecord{
		Data:      payload,
		TTL:       CacheItemTTL(),
		CreatedAt: helpers.GetCurrentUnixTime(),
	}

	return payload, nil
}

func getCleanedColumns(rows *sql.Rows) ([]string, error) {

	columns, err := rows.Columns()
	if err != nil {
		return nil, err
	}
	cleanedColumns := make([]string, len(columns))
	for i, column := range columns {
		cleanedColumns[i] = helpers.ConvertSnakeToCamelCase(column)
	}

	return cleanedColumns, nil
}
