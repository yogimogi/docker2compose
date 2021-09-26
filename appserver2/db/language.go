package db

import (
	"appserver2/models"
	"database/sql"
)

func (db Database) GetAllLanguages() (*models.LanguageList, error) {
	list := &models.LanguageList{}

	rows, error := db.Conn.Query("SELECT * FROM languages ORDER BY first_release ASC")
	if error != nil {
		return list, error
	}

	for rows.Next() {
		var lang models.Language
		error := rows.Scan(&lang.ID, &lang.Name, &lang.Details, &lang.Author, &lang.FirstRelease)
		if error != nil {
			return list, error
		}
		list.Languages = append(list.Languages, lang)
	}
	return list, nil
}

func (db Database) GetLanguageById(itemId int) (models.Language, error) {
	lang := models.Language{}

	query := `SELECT * FROM languages WHERE id = $1;`
	rows := db.Conn.QueryRow(query, itemId)
	switch error := rows.Scan(&lang.ID, &lang.Name, &lang.Details, &lang.Author, &lang.FirstRelease); error {
	case sql.ErrNoRows:
		return lang, ErrorNoMatch
	default:
		return lang, error
	}
}
