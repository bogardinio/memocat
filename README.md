# FlashForge ⚡

Karteikarten-App fürs iPhone — offline, installierbar, Anki-kompatibel.

---

## Quickstart

### 1. App öffnen & installieren

1. **[flashforge öffnen](https://bogardinio.github.io/flashforge/)** — in Safari auf dem iPhone (kein Chrome, kein Firefox)
2. Teilen-Button antippen → **„Zum Home-Bildschirm"** → Hinzufügen

Die App startet danach wie eine native App, funktioniert vollständig offline.

---

### 2. Eigene Karten anlegen

**Variante A — CSV manuell pflegen (empfohlen für Einsteiger)**

Erstelle eine CSV-Datei mit deinen Vokabeln — semikolon- oder tab-getrennt:

```
"Guten Tag.";"Dzień dobry."
"Danke.";"Dziękuję."
"Wie geht's?";"Jak się masz?"
```

Speichere die Datei z.B. in der **iCloud** (Ordner „Dateien") oder direkt im iPhone-Speicher.

In der App: **Deck importieren → CSV-Datei wählen**

Den Lernfortschritt speichert die App automatisch lokal auf dem Gerät.

> **Tipp:** Jederzeit neue Karten ergänzen und die CSV neu importieren — bereits gelernte Karten behalten ihren Fortschritt.

**Variante B — Aus Anki Desktop exportieren**

1. Anki Desktop → Datei → Exportieren
2. Format: **„Notizen im Klartext (.txt)"**
3. Exportierte Datei in FlashForge importieren

---

## Funktionen

- **SM-2 Algorithmus** — Again / Schwer / Gut / Leicht (wie Anki)
- **CSV-Import** — Anki-Export (.txt), Semikolon-CSV, Tab-CSV
- **Statistiken** — Streak, Aktivitäts-Heatmap, Karten-Verteilung
- **Markierte Karten** — zum gezielten Wiederholen
- **Offline-First** — IndexedDB + Service Worker, kein Internet nötig
- **Dark Mode** — OLED-optimiert

---

## Fortgeschritten: Lernfortschritt in eigenem GitHub speichern

Standardmäßig liegt dein Lernfortschritt nur lokal auf dem Gerät. Wer ihn sichern oder geräteübergreifend nutzen möchte, kann ihn in einem **privaten GitHub-Repository** speichern.

### Was du brauchst

- Ein GitHub-Account
- Ein privates Repository (z.B. `meine-lernkarten`)
- Einen Fine-Grained Personal Access Token (PAT)

---

### Schritt 1 — Privates Repository anlegen

1. [github.com/new](https://github.com/new) öffnen
2. Name vergeben (z.B. `meine-lernkarten`)
3. **Private** auswählen → Repository erstellen

---

### Schritt 2 — Fine-Grained PAT erstellen

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens**
2. **Generate new token** klicken
3. Einstellungen:
   - **Token name:** z.B. `FlashForge`
   - **Expiration:** nach Bedarf (z.B. 1 Jahr)
   - **Repository access:** „Only select repositories" → dein privates Repo auswählen
4. Unter **Permissions → Repository permissions:**
   - **Contents:** `Read and write`
   - Alles andere bleibt `No access`
5. **Generate token** → Token kopieren (wird nur einmal angezeigt!)

---

### Schritt 3 — In FlashForge einrichten

In der App: **Einstellungen → GitHub-Sync**

| Feld | Wert |
|------|------|
| GitHub Owner | dein GitHub-Benutzername |
| Repository | Name deines privaten Repos |
| Dateiname | z.B. `data.json` |
| Token | der PAT aus Schritt 2 |

Speichern → **Jetzt synchronisieren**

Die App legt `data.json` automatisch im Repository an und synchronisiert ab sofort deinen Lernfortschritt.
