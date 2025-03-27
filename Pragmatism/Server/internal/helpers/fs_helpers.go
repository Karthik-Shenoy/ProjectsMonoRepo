package helpers

import "os"

// CheckOrCreateFolder ensures that a folder exists, creating it if necessary.
func CheckOrCreateFolder(folderPath string, permissions os.FileMode) error {
	if _, err := os.Stat(folderPath); os.IsNotExist(err) {
		return os.Mkdir(folderPath, permissions)
	}
	return nil
}
