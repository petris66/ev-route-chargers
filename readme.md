# EV Route Chargers

Kevyt PWA-sovellus sähköauton latauspisteiden hakemiseen ja reittisuunnitteluun.

Sovellus näyttää lähistön ja seuraavan sopivan latauspysähdyksen kartalla
käyttäen Open Charge Map -dataa.

👉 Toimii selaimessa ja asennettavana PWA:na (GitHub Pages).

## Demo
https://petris66.github.io/ev-route-chargers/

## Ominaisuudet
- Karttanäkymä (Leaflet)
- Latauspisteiden haku Open Charge Map API:sta
- Seuraavan latauspysähdyksen logiikka
- Operaattorisuodattimet (ABC, K-Lataus, Neste, ST1, Faast)
- PWA (asennettavissa kotinäytölle)
- Debug-tila URL-parametrilla (`?debug=1`)

## Arkkitehtuuri
- **Frontend:**  
  - GitHub Pages  
  - HTML + CSS + JavaScript  
  - Leaflet-kartta

- **Backend / API-proxy:**  
  - Vercel serverless function  
  - Proxy Open Charge Map -kutsuille
  - Estää CORS- ja rate limit -ongelmat

- **API:**  
  - Open Charge Map  
  - API-avain tallennettu Vercelin ympäristömuuttujana (`OCM_API_KEY`)

> Cloudflare Workers hylättiin Open Charge Mapin 524 timeout -ongelmien vuoksi.

## Kehitys
Frontend on täysin staattinen ja toimii suoraan GitHub Pagesissa.

API-kutsut tehdään Vercelin kautta:

## Lisenssi

Tämä projekti on lisensoitu [MIT-lisenssillä](LICENSE).
