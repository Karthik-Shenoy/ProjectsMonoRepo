package db_cache_service

import (
	"pragmatism/internal/cmdflags"
)

func CacheItemTTL() int64 {
	if cmdflags.IsDevMode() {
		return 0
	}
	return 3600
}
