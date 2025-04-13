package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"pragmatism/internal/apperrors"
	"pragmatism/internal/auth"
	"pragmatism/internal/helpers"
	"pragmatism/internal/middlewares"
	users_model "pragmatism/internal/models/usersmodel"
	"pragmatism/internal/services/serviceinjector"
)

func InitUserDataHandlers() {
	http.HandleFunc("GET /users/solved_tasks", middlewares.CorsMiddleware(auth.AuthMiddleWare(handleGetSolvedTasksForUser), http.MethodGet))
}

func handleGetSolvedTasksForUser(w http.ResponseWriter, req *http.Request) {
	// Use service injector to get the UsersModelService
	userModelService, appErr := serviceinjector.GetService[users_model.UsersModelService]()
	if appErr != nil {
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(appErr)
		w.Write(payload)
		return
	}

	// Extract user ID from the request context (assuming it's set by AuthMiddleware)
	userId := req.Context().Value("userId").(string)

	// Fetch solved problems for the user
	solvedProblems, appErr := userModelService.GetSolvedTasks(userId)
	if appErr != nil {
		wrappedAppErr := apperrors.NewAppErrorFromLowerLayerError(
			apperrors.UserDataHandlers_NonRetryable_FailedToGetSolvedProblems,
			"UserDataHandlers.handleGetSolvedProblemsForUser",
			"Failed to get solved problems for user",
			appErr,
		)
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(wrappedAppErr)
		w.Write(payload)
		return
	}
	fmt.Println("solvedProblems", solvedProblems)
	// Marshal the response
	payload, err := json.Marshal(solvedProblems)
	if err != nil {
		wrappedAppErr := apperrors.NewAppError(
			apperrors.UserDataHandlers_NonRetryable_FailedToMarshallSolvedProblems,
			"UserDataHandlers.handleGetSolvedProblemsForUser",
			err.Error(),
		)
		w.WriteHeader(http.StatusInternalServerError)
		payload := helpers.LogErrorToTelemetryAndGetPayload(wrappedAppErr)
		w.Write(payload)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(payload)
}
