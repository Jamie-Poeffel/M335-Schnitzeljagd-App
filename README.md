<h1 align="center">📱 M335 – Schnitzeljagd App (Angular & Ionic)</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Modul-M335-orange" />
  <img src="https://img.shields.io/badge/Ionic-Framework-blue" />
  <img src="https://img.shields.io/badge/Angular-Frontend-red" />
  <img src="https://img.shields.io/badge/Capacitor-Plugins-lightgrey" />
  <img src="https://img.shields.io/badge/Status-In%20Development-yellow" />
</p>

<p align="center">
  Repo: https://github.com/Jamie-Poeffel/M335-Schnitzeljagd-App
</p>

---

## 📖 Projektbeschreibung

Im Rahmen des Moduls **M335 – Mobile Applikation realisieren** wird eine **Schnitzeljagd-App** in einer 3er-Gruppe entwickelt.  
Die App nutzt native Gerätefunktionen wie Kamera, GPS, Sensoren usw., um verschiedene Aufgaben zu erfüllen.

Ziel ist eine funktionierende Mobile App mit sauberem Code, guter UI und realistischen Features.

---

## ✅ Voraussetzungen für die Bewertung

Folgende Punkte müssen erfüllt sein:

- UI-Prototyp vorhanden  
- Funktionale Anforderungen umgesetzt  
- Nicht-funktionale Anforderungen berücksichtigt  
- Testplan vorhanden  

---

## ⚙️ Funktionale Anforderungen

- Spieler kann vor Start seinen Namen eingeben  
- Schnitzeljagd kann nur mit eingegebenem Namen gestartet werden (Alert)  
- Beim Start werden Berechtigungen für **Kamera** und **Standort** abgefragt  
- Jagd startet erst, wenn Berechtigungen erteilt sind  
- Bei Abschluss einer Aufgabe erfolgt ein **haptisches Feedback**  
- Laufende Schnitzeljagd kann abgebrochen werden  
- Mindestens **6 Aufgaben** müssen umgesetzt werden  
  - Aufgaben mit „!!️“ sind Pflicht  
- Jede Aufgabe enthält:
  - Titel  
  - kurzen Einführungstext  
  - Navigation nur möglich, wenn Aufgabe erfüllt  
  - Möglichkeit zum Überspringen  
  - Möglichkeit zum Abbrechen und zum Leaderboard  
- Am Ende der Schnitzeljagd werden angezeigt:
  - Gesammelte Schnitzel (1 pro Aufgabe)  
  - Gesammelte Kartoffeln (bei zu langer Dauer)  
  - Gesamtdauer der Jagd  
- Liste mit bisherigen Durchläufen:
  - Name  
  - Datum  
  - Punkte  
  - Diese Daten werden **persistiert**  
- Online-Leaderboard:
  - Ergebnis wird per **API Call** gesendet  

---

## 🎯 Schnitzeljagd-Aufgaben

Die Aufgaben werden in dieser Reihenfolge umgesetzt:

1. !!️ Geolocation – Zu bestimmten Koordinaten bewegen  
2. Bestimmte Distanz zurücklegen (z. B. 20 m gehen)  
3. !!️ QR-Code mit Kamera scannen und vergleichen  
4. Sensor-Aufgabe (z. B. Handy drehen, Bewegung erkennen)  
5. Gerätestatus prüfen (z. B. Gerät lädt)  
6. WLAN verbinden und trennen  
7. NFC-Scan mit Vergleich des Inhalts  

---

## 🧱 Nicht-funktionale Anforderungen

- Verwendung von **Standard Ionic UI Komponenten**  
- Projekt liegt in einem **Git-Repository**  
- Projekt läuft ohne Code-Fixes  
- Mobile Design-Grundlagen berücksichtigt  
- App läuft auf **Android oder iOS**  
- Keine UI-Hänger, flüssige Performance  
- Sauber strukturierter und lesbarer Code  
- Verwendung von **Capacitor Plugins** statt Ionic Native  
- Entwicklung mit **Angular**  

---

## 🚀 Verwendete Tools & Technologien

<p align="center">
  <img src="https://img.shields.io/badge/-Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" />
  <img src="https://img.shields.io/badge/-Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white" />
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/-Capacitor-000000?style=for-the-badge&logo=capacitor&logoColor=white" />
  <img src="https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github&logoColor=white" />
</p>

---

## 👥 Contributors

<a href="https://github.com/Jamie-Poeffel/M335-Schnitzeljagd-App/graphs/contributors">
  <img src="https://contrib.rocks/image?&columns=25&max=10000&&repo=Jamie-Poeffel/M335-Schnitzeljagd-App" />
</a>

---

## 📦 Projektstatus

🛠️ In Entwicklung  
📱 Fokus: Mobile Features mit echten Gerätesensoren  
🎯 Ziel: Vollständige Erfüllung der M335-Anforderungen

---

## 🧪 Testkonzept

Für dieses Projekt wurde ein **manuelles Testkonzept** erstellt, welches alle zentralen Funktionen der App abdeckt (Namenseingabe, Aufgaben, Vibration, WLAN-Popup, Skip-Funktion, Leaderboard usw.).

📄 **Testkonzept herunterladen (Word-Dokument):**  

After Pressing the Link press 'view raw'
[👉 Testkonzept - Schnitzeljagd App](./TestKonzept_SchnitzelJagd_Jamie_Gregory_Kush.docx)


---

## 🧪 PowerPointPresentation

Für dieses Projekt wurde ein **PowerPointPresentation** erstellt.

📄 **PPP herunterladen (.pptx):**  

After Pressing the Link press 'view raw'
[👉 PowerPointPresentation](./PPP.pptx)

---


## 🧠 Modul

**M335 – Mobile Applikation realisieren**  
ICT Berufsbildung Zentralschweiz


![PotOfGreedGIF](https://github.com/user-attachments/assets/ff7b5ca8-562d-40a9-b422-1ab3c34c1ec8)
