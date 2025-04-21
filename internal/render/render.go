package render

import (
	"bytes"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"path/filepath"

	"github.com/justinas/nosurf"
	"github.com/tsawler/bookings-app/internal/config"
	"github.com/tsawler/bookings-app/internal/models"
)

var functions = template.FuncMap{}

var app *config.AppConfig

// NewTemplates sets the config for the template package
func NewTemplates(a *config.AppConfig) {
	app = a
}

// AddDefaultData adds data for all templates
func AddDefaultData(td *models.TemplateData, r *http.Request) *models.TemplateData {
	if td == nil {
		td = &models.TemplateData{}
	}
	td.CSRFToken = nosurf.Token(r)
	// Add other default data here if needed
	return td
}

// RenderTemplate renders templates using html/template
func RenderTemplate(w http.ResponseWriter, r *http.Request, tmpl string, td *models.TemplateData) {
	var tc map[string]*template.Template
	var err error

	if app.UseCache {
		// Use the template cache from app config
		tc = app.TemplateCache
	} else {
		// Create a new template cache
		tc, err = CreateTemplateCache()
		if err != nil {
			log.Println("Error creating template cache:", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
	}

	t, ok := tc[tmpl]
	if !ok {
		log.Printf("Template %s not found in template cache", tmpl)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	buf := new(bytes.Buffer)

	td = AddDefaultData(td, r)

	err = t.Execute(buf, td)
	if err != nil {
		log.Printf("Error executing template %s: %v", tmpl, err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	_, err = buf.WriteTo(w)
	if err != nil {
		log.Printf("Error writing template to browser: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
	}
}

// CreateTemplateCache creates a template cache as a map
func CreateTemplateCache() (map[string]*template.Template, error) {
	myCache := make(map[string]*template.Template)

	pages, err := filepath.Glob("./templates/*.page.html")
	if err != nil {
		return nil, fmt.Errorf("error finding page templates: %w", err)
	}

	layouts, err := filepath.Glob("./templates/*.layout.html")
	if err != nil {
		return nil, fmt.Errorf("error finding layout templates: %w", err)
	}

	for _, page := range pages {
		name := filepath.Base(page)

		// Parse the page template first
		ts, err := template.New(name).Funcs(functions).ParseFiles(page)
		if err != nil {
			return nil, fmt.Errorf("error parsing page template %s: %w", page, err)
		}

		// Parse layouts if they exist
		if len(layouts) > 0 {
			ts, err = ts.ParseGlob("./templates/*.layout.html")
			if err != nil {
				return nil, fmt.Errorf("error parsing layout templates: %w", err)
			}
		}

		myCache[name] = ts
	}

	return myCache, nil
}