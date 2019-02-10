<p align="center">
  <img src="https://i.imgur.com/E9LyKea.png" width=450 />
</p>

## Quickstart

Install pennywall:

```
npm i pennywall
```

Edit your configuration file:

```
vi pennywall.json
```

Generate your penny wall:

```
pennywall -c pennywall.json build
```

Push assets to your webserver:

```
scp -r build/* you@yourhost:/your/www/path
```

## Configuration

```json
{
  "apiKey": "kt-JH7P34VV62F3LUH3QC01N99LIIKIA8V7",
  "merchant": {
    "name": "Kev's Vegan Blog"
  },
  "product": {
    "id": "10001",
    "name": "Online donation",
    "description": "Donation to Kev's Vegan Blog",
    "url": "https://kevsveganblog.com/donate",
    "price": 1.0,
    "currency": "CAD"
  },
  "destination": {
    "url": "https://kevsveganblog.com",
    "method": "GET",
    "sendReceipt": false
  },
  "button": {
    "slider": true,
    "palette": "dark",
    "min": 0,
    "max": 2,
    "text": "DONATE",
    "paidText": "THANKS FOR DONATING!"
  },
  "theme": {
    "name": "heart",
    "palette": "metal",
    "icon": "face",
    "title": "Donate to Kev's Vegan Blog",
    "message": "This site is supported with your donations. Please consider adding a tip.",
    "allowSkip": true,
    "skipText": "No thanks! Take me Kev's Vegan Blog."
  }
}
```

## Examples

<p align="center">
  <a href="http://give.pennywall.io/kevsveganblog"><img src="https://imgur.com/n7fpFHS.png" width=300 /></a>
  &nbsp;
  <a href="http://give.pennywall.io/kevsmaroonblog"><img src="https://imgur.com/kg0UEEW.png" width=300 /></a>
</p>


## Themes

Current themes:

* `heart` with palettes `maroon`, `metal`

To create a new theme, add a new directory under `themes/NAME` and include the files `index.hbs` (handlebars HTML), `index.js`, and `index.scss`. For custom palettes, you and have multiple `index-PALETE.scss` files.


## Hacking on this repo

Run a local webserver and watch the files for changes.

```
npx serve
npm run watch
```
