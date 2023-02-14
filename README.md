## Berner Fachhochschule : Project 1 (BTI3301) 21
### Raumüberwachung-P1-Group15
**Betreuer**

Stefan Cotting - cis1 04 Raumüberwachung mit Smartphones

**Entwickler**

1. Mohammed Ali - aliam1
2. Mac Müller - mullk8

**Beschreibung**

Alte Smartphones mit Kameras sollen weiterverwendet werden können, indem sie als Webcam / Überwachungskamera eingesetzt werden.
Die Überwachung der Bilder / Videos der Smartphones erfolgt mit dem Tablet/Smartphone/PC.
Die Live-Überwachung sollen aufgezeichnet werden können. Als Erweiterung soll die 2-Weg-Kommunikation ebenfalls umgesetzt werden.

**Technologie**
1. WebRTC (Web Real-Time Communication)
2. Node.js
3. HTTPs

### Anwendung
**Voraussetzungen**
- Ein PC/Server als Webserver
- 2x Smartphones, je mit einer funktionierenden Kamera und WLAN fähig
- Alle Geräte sind in einer gleichen Local-Netzwerk-Verbindung
- [RTC-fähiges Webbrowser](https://caniuse.com/rtcpeerconnection) (wird von meistens Webbrowser unterstützt)

**1. Respository herunterladen**

Laden Sie dieses Git-Repository auf einem Computer, den Sie als Webserver verwenden möchten.

**2. Node.js installieren und starten**

- [Node.js](https://nodejs.org/en/download/) auf dem Server herunterladen und installieren 
- Node.js in Ordner "webapp" starten
```
  $node server.js
```
**3. Smartphone als Überwachung-Kamera einschalten**

- Auf dem Webbrowser `https//[IP-Adresse des Servers]:3000` aufrufen 
- Gerätenamen eingeben z.B. WohnzimmerCam
- Password `test` eingeben
- Zugriff zur Kamera des Smartphones zulassen

**4. Mit einem Smartphone(Tablet/Smartphone/PC) das Live-Video zuschauen**

- Auf dem Webbrowser `https//[IP-Adresse des Servers]:3000` aufrufen 
- Password `test` eingeben
- Zugriff zur Kamera des Smartphones zulassen

Danach haben Sie die Möglichkeit das Live-Video mit dem Button [`Video Aufnehmen`] aufzunehmen.
Um die Zweiweg-Kommunikation zu aktivieren, clicken Sie auf [`Sprechen`].

### Bemerkung
Einige Fehler von der Funktionen wurde nicht behandelt. z.B. wenn der User den Zugriff zu der Kamera nicht erlaubt hätte.
