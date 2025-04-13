package serviceregistry

// we just import all the services here to register them
// this will package will be imported in main.go
// and all the services will be registered in their respective init function

import (
	_ "pragmatism/internal/models/tasksmodel"
	_ "pragmatism/internal/models/usersmodel"
	_ "pragmatism/internal/services/containermanagerservice"
	_ "pragmatism/internal/services/database_service"
	_ "pragmatism/internal/services/db_cache_service"
)
