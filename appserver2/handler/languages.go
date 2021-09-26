package handler

import (
	"appserver2/db"
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)


type LanguageIDKey struct {
	key string
}

var languageIDKey = LanguageIDKey{key: "languageID"}

func languages(router chi.Router) {
	router.Get("/", getAllLanguages)

	router.Route("/{languageID}", func(router chi.Router) {
		router.Use(LanguageContext)
		router.Get("/", getLanguage)
	})
}

func LanguageContext(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		languageId := chi.URLParam(r, "languageID")
		if languageId == "" {
			render.Render(w, r, ErrorRenderer(fmt.Errorf("language ID is required")))
			return
		}
		id, error := strconv.Atoi(languageId)
		if error != nil {
			render.Render(w, r, ErrorRenderer(fmt.Errorf("invalid Language ID")))
		}
		ctx := context.WithValue(r.Context(), languageIDKey, id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getAllLanguages(w http.ResponseWriter, r *http.Request) {
	languages, error := dbInstance.GetAllLanguages();
	if error != nil {
		render.Render(w, r, ServerErrorRenderer(error))
		return
	}
	if error := render.Render(w, r, languages); error != nil {
		render.Render(w, r, ErrorRenderer(error))
	}
}

func getLanguage(w http.ResponseWriter, r *http.Request) {
	langID := r.Context().Value(languageIDKey).(int)
	lang, error := dbInstance.GetLanguageById(langID)
	if error != nil {
		if error == db.ErrorNoMatch {
			render.Render(w, r, ErrorNotFound)
		} else {
			render.Render(w, r, ErrorRenderer(error))
		}
		return
	}
	if error := render.Render(w, r, &lang); error != nil {
		render.Render(w, r, ServerErrorRenderer(error))
		return
	}
}
