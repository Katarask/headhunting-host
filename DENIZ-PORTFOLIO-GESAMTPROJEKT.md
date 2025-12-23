# DENIZ PORTFOLIO – GESAMTPROJEKT
## Stand: 23. Dezember 2024

---

# 📋 INHALTSVERZEICHNIS

1. [Projekt-Übersicht](#projekt-übersicht)
2. [Tech Stack & Deployment](#tech-stack--deployment)
3. [Design System](#design-system)
4. [SEO Strategie](#seo-strategie)
5. [Landing Pages](#landing-pages)
6. [Keyword-Datenbank](#keyword-datenbank)
7. [Backlink-Strategie](#backlink-strategie)
8. [Dateien & Assets](#dateien--assets)
9. [To-Do Liste](#to-do-liste)

---

# 🎯 PROJEKT-ÜBERSICHT

## Wer ist Deniz

- **Name:** Deniz Levent Tulay
- **Rolle:** Tech-Recruiter & Headhunter
- **Firma:** Tekom Industrielle Systemtechnik GmbH, München
- **Spezialisierung:** IT, Engineering, Aerospace, Defense
- **Track Record:** 500+ Placements, 98% Retention, 42 Tage ø Time-to-Hire

## Mission

Aufbau einer **Personal Brand** um "DER Typ" für Tech-Recruiting in Deutschland zu werden.

**Konkrete Ziele:**
- Podcast-Einladungen
- Speaking-Gigs
- Thought Leadership in der Defense/IT-Recruiting Nische

## Philosophie

> "Ich finde Menschen, nicht Lebensläufe."

Datengetriebenes Recruiting mit Automatisierung (Make.com, Apify, Hunter.io, Lemlist, Brevo).

---

# 🛠️ TECH STACK & DEPLOYMENT

## Frontend
```
Framework:    React 19.2 + Vite 7.2
Animationen:  GSAP 3.14
Styling:      CSS-in-JS (Inline Styles mit Design Tokens)
Font:         JetBrains Mono (Google Fonts)
```

## Deployment
```
Live URL:     https://denizleventtulay.de
GitHub:       https://github.com/Katarask/headhunting-host
Hosting:      Vercel (Auto-Deploy bei git push zu main)
Build:        npm run build → Output in /dist
```

## Projekt-Ordner
```
~/Desktop/deniz-portfolio/
├── src/
│   ├── App.jsx              ← Hauptdatei (~1500 Zeilen)
│   ├── ElectricBorder.jsx   ← Animierter SVG-Border
│   ├── ScrambleText.jsx     ← Text-Animation
│   ├── index.css            ← Globale Styles
│   └── main.jsx             ← Entry Point
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── api/                     ← Vercel Serverless Functions
│   └── contact.js           ← Notion Integration (noch erstellen)
├── index.html
├── package.json
└── vite.config.js
```

## Workflow-Befehle
```bash
cd ~/Desktop/deniz-portfolio
npm run dev                    # localhost:5173
npm run build                  # Production Build
npm run preview                # Build testen

# Lokal committen (NICHT live)
git add -A && git commit -m "..."

# Live deployen (nur auf Aufforderung)
git push
```

---

# 🎨 DESIGN SYSTEM

## Farbpalette (60/25/10/5 Regel)

```javascript
colors: {
  sand: '#DBD6CC',        // 60% - Hauptfarbe, Backgrounds
  cream: '#EFEDE5',       // 25% - Text, Akzente  
  burgundy: '#652126',    // 10% - CTAs, Highlights
  black: '#0a0a0a',       // 5%  - Kontrast-Sections
  
  // Utility
  darkAlt: '#151413',
  muted: 'rgba(10, 10, 10, 0.5)',
  mutedLight: 'rgba(239, 237, 229, 0.6)',
  border: 'rgba(101, 33, 38, 0.12)',
  borderLight: 'rgba(239, 237, 229, 0.15)',
}
```

## Typografie

```javascript
font: '"JetBrains Mono", "SF Mono", monospace'
// Überall verwenden, keine andere Schriftart!
```

## Animationen

```javascript
easing: {
  smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
  snappy: 'cubic-bezier(0.19, 1, 0.22, 1)',
}
timing: {
  fast: '200ms',
  medium: '400ms',
  slow: '800ms',
}
```

## Spacing

```javascript
space: {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '48px',
  xxl: '64px',
  section: 'clamp(80px, 12vw, 140px)',
}
```

## Design-Philosophie

| Aspekt | Vorgabe |
|--------|---------|
| Aesthetic | Premium Editorial Bold |
| Layouts | Asymmetrisch, viel Whitespace |
| Ton | Professionell, nicht flashy |
| Effekte | Dezent, keine Spielereien |

## Unterschiede nach Seiten-Typ

| Seite | Ton | CTA |
|-------|-----|-----|
| Active Sourcing | Provokant, direkt | "Kostenlose Potenzialanalyse" |
| Geheimschutz | Seriös, vertrauenswürdig | "Vertrauliches Gespräch" |
| Cost of Vacancy | Zahlen-fokussiert | "Time-to-Hire reduzieren" |

---

# 📈 SEO STRATEGIE

## Pillar-Cluster-Modell

```
                         HAUPTSEITE
                    denizleventtulay.de
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
   PILLAR 1            PILLAR 2            PILLAR 3
 Active Sourcing     Geheimschutz       Cost of Vacancy
   (3.400/mo)         (2.600/mo)          (140/mo)
        │                   │                   │
        ▼                   ▼                   ▼
   Supporting          Supporting          Supporting
   - Definition        - VS-NfD Blog       - Formeln
   - Methoden          - Ü1/Ü2/Ü3         - Branchen
   - FAQ               - FAQ               - FAQ
```

## Domain Authority Status

| Domain | DA | Rolle |
|--------|-----|-------|
| denizleventtulay.de | ~5-10 | Hauptdomain, Personal Brand |
| tekom-gmbh.de | 3 | Arbeitgeber, Backlink-Quelle |
| eura-personal.de | 12 | Schwester-Firma, Backlink-Quelle |
| personio.de | ~70 | Konkurrenz |
| haufe.de | ~75 | Konkurrenz |

## SEO-Vorteil

**Defense/Geheimschutz-Nische hat NULL Konkurrenz!**
- Keine Recruiting-Seiten ranken für "vs nfd", "ü1 ü2 ü3"
- Selbst mit DA 5-10 kannst du Top 3 erreichen

---

# 📄 LANDING PAGES

## Übersicht

| # | Seite | URL | Keywords | Volume | Diff | Status |
|---|-------|-----|----------|--------|------|--------|
| 1 | Cost of Vacancy | /cost-of-vacancy-rechner | cost of vacancy | 140 | 5 | 🔨 Bauen |
| 2 | Active Sourcing | /active-sourcing | active sourcing, definition, methoden | 3.800 | 16-20 | ✅ Fertig |
| 3 | Geheimschutz | /geheimschutz-recruiting | vs nfd, ü1 ü2 ü3, geheimschutz | 2.600 | 14-22 | ✅ Fertig |
| 4 | Personalvermittlung IT | /personalvermittlung-it | personalvermittlung it, it recruiter | 350 | 13-26 | 📋 Geplant |
| 5 | Talent Acquisition | /talent-acquisition | talent acquisition, personalgewinnung | 840 | 17-23 | 📋 Geplant |
| 6 | Headhunter München | /headhunter-it-muenchen | headhunter, headhunter münchen | 10.100 | 27 | 📋 Geplant |
| 7 | Kontakt | /kontakt | - | - | - | ✅ Fertig |

**Gesamt-Traffic-Potenzial: ~17.800/Monat**

---

## LP 1: Cost of Vacancy

### Meta
```
URL:         /cost-of-vacancy-rechner
Title:       Cost of Vacancy Rechner: Was kostet Ihre unbesetzte Stelle?
Description: Berechnen Sie die wahren Kosten Ihrer Vakanz. Kostenloser Rechner 
             für HR & Geschäftsführung.
```

### Keywords
| Keyword | Volume | Difficulty |
|---------|--------|------------|
| cost of vacancy | 140 | 5 |

### Struktur
```
1. HERO
   - H1: "Was kostet Ihre unbesetzte Stelle?"
   - Subline: "Die meisten unterschätzen es um 70%"

2. COST OF VACANCY RECHNER (Interaktiv)
   - Inputs: Jahresgehalt, Tage offen, Level
   - Outputs: Direkte Kosten, Produktivitätsverlust, Opportunitätskosten
   - Animierte Gesamtsumme

3. DIE VERSTECKTEN KOSTEN
   - Produktivitätsverlust im Team
   - Überstunden der Kollegen
   - Verlorene Aufträge
   - Employer Brand Schaden

4. BRANCHEN-BENCHMARKS
   - IT: 500-1000€/Tag
   - Engineering: 400-800€/Tag
   - Sales: 300-600€/Tag

5. FAQ (Schema Markup)
   - Was ist Cost of Vacancy?
   - Wie berechnet man Cost of Vacancy?
   - Was ist eine gute Time-to-Hire?

6. CTA
   - "Time-to-Hire reduzieren? Ich helfe."
   - Link zu Active Sourcing LP
```

### Rechner-Formel
```javascript
// Basis
dailyCost = (jahresgehalt / 220) * faktor

// Faktoren
Junior:  1.0x
Senior:  1.5x
Lead:    2.0x
C-Level: 3.0x

// Aufschlüsselung
direkteKosten = totalCost * 0.3
produktivitaet = totalCost * 0.5
opportunitaet = totalCost * 0.2
```

---

## LP 2: Active Sourcing

### Meta
```
URL:         /active-sourcing
Title:       Active Sourcing: ROI-Rechner & Methoden für IT-Recruiting
Description: Was kostet Active Sourcing? Berechnen Sie mit unserem ROI-Rechner, 
             ob intern, Freelancer oder Headhunter günstiger ist.
```

### Keywords
| Keyword | Volume | Difficulty |
|---------|--------|------------|
| active sourcing | 3.400 | 20 |
| active sourcing definition | 280 | 16 |
| active sourcing methoden | 70 | 11 |
| direktansprache | 70 | 9 |
| personalgewinnung | 210 | 23 |
| mitarbeiter gewinnen | 70 | 17 |

### Struktur
```
1. HERO (Provokation)
   - H1: "Warum Ihr Active Sourcing nicht funktioniert"
   - Stats: 10-20 Anfragen/Woche, <3% Response, 143+ Tage

2. DEFINITION
   - H2: "Was ist Active Sourcing?"
   - Keywords: definition, direktansprache, personalgewinnung

3. METHODEN
   - H2: "Die wichtigsten Active Sourcing Methoden"
   - 5 Karten: LinkedIn, GitHub, Referrals, Events, Boolean

4. ROI-RECHNER (USP!)
   - H2: "Was kostet Active Sourcing?"
   - 3-Spalten: Intern vs. Freelancer vs. Headhunter
   - Dynamische Empfehlung

5. PAIN POINTS
   - H2: "Warum Ihre Direktansprache ignoriert wird"
   - 4 brutale Wahrheiten

6. MEINE METHODE
   - Multi-Channel, Personalisiert, Tech-Verständnis, Schnell
   - Track Record: 500+, 98%, 42 Tage

7. FAQ (Schema Markup)
   - Was ist Active Sourcing?
   - Was kostet Active Sourcing?
   - Active Sourcing vs. Headhunter?

8. CTA
   - "Kostenlose Potenzialanalyse"
```

### Datei
```
active-sourcing-landing-v2.jsx
```

---

## LP 3: Geheimschutz Recruiting

### Meta
```
URL:         /geheimschutz-recruiting
Title:       Geheimschutz Recruiting: Mitarbeiter mit Sicherheitsfreigabe finden
Description: Recruiting für VS-NfD, Ü1, Ü2, Ü3 Positionen. Spezialisiert auf 
             Defense, Aerospace & sicherheitskritische IT.
```

### Keywords
| Keyword | Volume | Difficulty |
|---------|--------|------------|
| vs nfd | 1.500 | 16 |
| verschlusssache | 420 | 29 |
| geheimschutz | 210 | 22 |
| sicherheitsüberprüfung | ~500 | 20 |
| sabotageschutz | 70 | 14 |
| ü1 ü2 ü3 | ~300 | ~18 |

### Struktur
```
1. HERO
   - H1: "Ihr Projekt erfordert Ü2. Ihr Wunschkandidat hat keine Freigabe."
   - Subline: "Was jetzt?"

2. DAS PROBLEM
   - Talentpool ist winzig
   - Überprüfung dauert Monate
   - Normale Recruiter verstehen das nicht
   - Diskretion ist kritisch

3. GEHEIMSCHUTZ-TABELLE
   - VS-NfD (Ü1): 4-8 Wochen
   - VS-Vertraulich (Ü2): 3-6 Monate
   - Geheim (Ü3): 6-12 Monate
   - Streng Geheim (Ü3+): 12+ Monate

4. MEIN ANSATZ
   - Netzwerk in der Branche
   - Kandidaten MIT Freigabe
   - Technisches Verständnis
   - Absolute Diskretion

5. ROLLEN
   - Systems Engineers
   - Embedded Entwickler
   - Security Engineers
   - Projektleiter Verteidigung
   - etc.

6. TRACK RECORD
   - 500+ (150+ Defense)
   - 98%
   - 42 Tage

7. FAQ (Schema Markup)
   - Was bedeutet VS-NfD?
   - Unterschied Ü1, Ü2, Ü3?
   - Kann ich ohne Freigabe einstellen?

8. CTA
   - "Vertrauliches Gespräch vereinbaren"
```

### Datei
```
geheimschutz-recruiting-lp.jsx
```

---

## LP 7: Kontakt

### Meta
```
URL:         /kontakt
```

### Features
- Name, Email, Betreff (Dropdown), Nachricht
- Notion API Backend
- Vercel Serverless Function

### Betreff-Optionen
```
- Allgemeine Anfrage
- IT Recruiting
- Defense & Aerospace
- Geheimschutz-Positionen
- Podcast / Speaking
- Sonstiges
```

### Datei
```
contact-form-notion.jsx
```

### Notion Setup
1. Integration erstellen: https://www.notion.so/my-integrations
2. Database erstellen: Name, Email, Betreff, Nachricht, Datum, Quelle
3. Database mit Integration verbinden
4. Environment Variables in Vercel:
   - NOTION_API_KEY=secret_xxxxx
   - NOTION_DATABASE_ID=xxxxx

---

# 🔑 KEYWORD-DATENBANK

## Tier 1: Hohes Volumen

| Keyword | Volume | Difficulty | Seite |
|---------|--------|------------|-------|
| recruiting | 11.500 | 29 | - (zu generisch) |
| headhunter | 10.100 | 27 | Headhunter München LP |
| recruiter | 5.300 | 29 | - (zu generisch) |
| active sourcing | 3.400 | 20 | Active Sourcing LP ✅ |
| sourcing | 2.400 | 21 | Active Sourcing LP |
| vs nfd | 1.500 | 16 | Geheimschutz LP ✅ |
| personalberatung | 1.300 | 34 | - |

## Tier 2: Mittleres Volumen

| Keyword | Volume | Difficulty | Seite |
|---------|--------|------------|-------|
| talent acquisition | 630 | 17 | Talent Acquisition LP |
| executive search | 570 | 20 | - |
| verschlusssache | 420 | 29 | Geheimschutz LP ✅ |
| active sourcing definition | 280 | 16 | Active Sourcing LP ✅ |
| cosmic top secret | 280 | 20 | Geheimschutz LP |
| personalgewinnung | 210 | 23 | Active Sourcing LP ✅ |
| geheimschutz | 210 | 22 | Geheimschutz LP ✅ |
| tech recruiter | 210 | 26 | Personalvermittlung IT LP |
| programmierer finden | 210 | 22 | Personalvermittlung IT LP |

## Tier 3: Nischen (Easy Wins)

| Keyword | Volume | Difficulty | Seite |
|---------|--------|------------|-------|
| cost of vacancy | 140 | 5 | Cost of Vacancy LP 🔨 |
| skill gap | 140 | 15 | - |
| personalvermittlung it | 70 | 13 | Personalvermittlung IT LP |
| it recruiter | 70 | 26 | Personalvermittlung IT LP |
| direktansprache | 70 | 9 | Active Sourcing LP ✅ |
| active sourcing methoden | 70 | 11 | Active Sourcing LP ✅ |
| sabotageschutz | 70 | 14 | Geheimschutz LP ✅ |
| vs vertraulich | 70 | 22 | Geheimschutz LP |

---

# 🔗 BACKLINK-STRATEGIE

## Eigene Assets

| Domain | DA | Aktion |
|--------|-----|--------|
| tekom-gmbh.de | 3 | Link zu denizleventtulay.de setzen |
| eura-personal.de | 12 | Link zu denizleventtulay.de setzen |

## Konkrete Links setzen

### Auf tekom-gmbh.de
```
Im Ü1/Ü2/Ü3 Blog-Artikel ergänzen:

"Sie suchen Mitarbeiter mit Sicherheitsfreigabe? 
Unser Headhunter Deniz Tulay ist spezialisiert 
auf Defense & Aerospace Recruiting."

→ Link zu denizleventtulay.de/geheimschutz-recruiting
```

### Auf eura-personal.de
```
Neue Seite/Blog:
"IT & Defense Recruiting – Unser Spezialist"

"Für sicherheitskritische Positionen mit 
Geheimschutz-Anforderungen arbeiten wir mit 
Deniz Tulay zusammen."

→ Link zu denizleventtulay.de/geheimschutz-recruiting
```

## Externe Backlinks (später)
- Gastbeiträge auf HR-Blogs
- Podcast-Auftritte (dein Ziel sowieso!)
- Speaking-Gigs → Slides online → Backlinks
- PR in Fachmedien

---

# 📁 DATEIEN & ASSETS

## Fertige React Components

| Datei | Beschreibung |
|-------|--------------|
| `active-sourcing-landing-v2.jsx` | Active Sourcing LP mit ROI-Rechner |
| `geheimschutz-recruiting-lp.jsx` | Geheimschutz LP für Defense |
| `contact-form-notion.jsx` | Contact Form mit Notion Backend |

## Noch zu erstellen

| Datei | Beschreibung |
|-------|--------------|
| `cost-of-vacancy-lp.jsx` | CoV LP mit Rechner |
| `personalvermittlung-it-lp.jsx` | IT Recruiting LP |
| `talent-acquisition-lp.jsx` | Talent Acquisition Guide |
| `/api/contact.js` | Vercel Serverless Function für Notion |

---

# ✅ TO-DO LISTE

## Kurzfristig (Diese Woche)

- [ ] Cost of Vacancy LP bauen
- [ ] LPs in Portfolio einbauen (React Router)
- [ ] Notion Integration einrichten
- [ ] Vercel Function `/api/contact.js` erstellen
- [ ] Deployen

## Mittelfristig (Januar)

- [ ] Personalvermittlung IT LP bauen
- [ ] Talent Acquisition LP bauen
- [ ] Backlinks von Tekom + Eura setzen
- [ ] VS-NfD Blog-Artikel schreiben
- [ ] Schema Markup für FAQs implementieren

## Langfristig (Q1 2025)

- [ ] Headhunter IT München LP (Local SEO)
- [ ] Google Business Profile (optional)
- [ ] Gastbeiträge / Podcast-Auftritte
- [ ] Mobile & Tablet Responsive verbessern
- [ ] PageSpeed optimieren (Ziel: 85+)

---

# 📊 ERFOLGSMESSUNG

## KPIs

| Metrik | Ziel (6 Monate) |
|--------|-----------------|
| Organic Traffic | 1.000-1.500/Monat |
| Top 3 Rankings | "cost of vacancy", "vs nfd" |
| Top 10 Rankings | "active sourcing", "geheimschutz" |
| Kontaktanfragen | 10-20/Monat |
| Podcast-Einladungen | 2-3 |

## Tracking

- Google Search Console einrichten
- Vercel Analytics nutzen
- Notion Database für Leads

---

# 📞 KONTAKTDATEN

```
Email:     d.l.tulay@tekom-gmbh.de
LinkedIn:  linkedin.com/in/deniz-levent-tulay-tekom2025
Domain:    denizleventtulay.de
```

---

*Dokument erstellt: 23. Dezember 2024*
*Für Nutzung mit Claude Code*
