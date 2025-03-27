package db_cache_service

import (
	"database/sql"
	"encoding/json"
	"pragmatism/internal/helpers"
	"pragmatism/internal/services/database_service"
	"sync"
)

type CacheRecord struct {
	Data      []byte
	TTL       int64
	CreatedAt int64
}

type DBCacheService struct {
	dbService *database_service.DatabaseService
	cache     map[string]*CacheRecord
}

func (dbCache *DBCacheService) Query(query string) ([]byte, error) {

	if dbCache.cache[query] != nil {
		if dbCache.cache[query].CreatedAt+dbCache.cache[query].TTL > helpers.GetCurrentUnixTime() {
			return dbCache.cache[query].Data, nil
		}
	}

	rows, err := dbCache.dbService.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	columns, err := getCleanedColumns(rows)

	if err != nil {
		return nil, err
	}

	typeInfo := make(map[string]string)
	columnTypes, err := rows.ColumnTypes()
	if err != nil {
		return nil, err
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
			return nil, err
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
		return nil, err
	}

	dbCache.cache[query] = &CacheRecord{
		Data:      payload,
		TTL:       3600,
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

var singletonMutex sync.Mutex
var singleton *DBCacheService

func GetInstance() (*DBCacheService, error) {
	singletonMutex.Lock()
	defer singletonMutex.Unlock()

	if singleton == nil {
		dbService, err := database_service.GetInstance()

		if err != nil {
			return nil, err
		}

		singleton = &DBCacheService{
			dbService: dbService,
			cache:     make(map[string]*CacheRecord),
		}
	}
	return singleton, nil
}
