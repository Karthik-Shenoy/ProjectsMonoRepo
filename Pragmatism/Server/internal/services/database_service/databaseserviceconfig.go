package database_service

import (
	"fmt"
	"os"
	"strconv"
)

var DB_SERVICE_CONFIG_password string = ""
var DB_SERVICE_CONFIG_host = ""
var DB_SERVICE_CONFIG_port uint16 = 0
var DB_SERVICE_CONFIG_user = ""
var DB_SERVICE_CONFIG_dbName = ""

func InitEnvVariables() error {
	port, err := strconv.Atoi(getOSEnvWithLogging("DB_SERVICE_CONFIG_port"))

	if err != nil {
		return err
	}

	if port < 0 || port >= (1<<16) {
		fmt.Println(fmt.Errorf("DatabaseServiceConfig.InitEnvVariables: port out of uint16 bound"))
		return fmt.Errorf("DatabaseServiceConfig.InitEnvVariables: port out of uint16 bound")
	}

	DB_SERVICE_CONFIG_password = getOSEnvWithLogging("DB_SERVICE_CONFIG_password")
	DB_SERVICE_CONFIG_host = getOSEnvWithLogging("DB_SERVICE_CONFIG_host")
	DB_SERVICE_CONFIG_port = uint16(port)
	DB_SERVICE_CONFIG_user = getOSEnvWithLogging("DB_SERVICE_CONFIG_user")
	DB_SERVICE_CONFIG_dbName = getOSEnvWithLogging("DB_SERVICE_CONFIG_dbName")

	return err
}

func getOSEnvWithLogging(varName string) string {
	value := os.Getenv(varName)

	if value == "" {
		fmt.Println("env variable", varName, "was not found")
	}
	return value
}
