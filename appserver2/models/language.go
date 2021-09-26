package models

import (
	"fmt"
	"net/http"
)

type Language struct {
	ID int `json:"id"`
	Name string `json:"name"`
	Details string `json:"details"`
	Author string `json:"author"`
	FirstRelease int `json:"first_release"`
}

type LanguageList struct {
	Languages []Language `json:"Languages"`
}

func (l *Language) Bind(r *http.Request) error {
	if l.Name == "" {
		return fmt.Errorf("name is a required field")
	}
	return nil
}

func (*LanguageList) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func (*Language) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}
