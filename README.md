<p align="center">
  <img src="https://i.imgur.com/E9LyKea.png" width=450 />
 <br/>
  <img src="https://pennywall.io/assets/sushi-screenshot.png" width=350/>
 <br/>
 [ <a href="https://give.pennywall.io/v1cbiwm/index.html">See demo</a> ]
</p>

## What is Pennywall?

Pennywall is a micro paywall / donation-wall / tip-jar for sharing your content on social networks. You can generate as many pennywalls as you like, one for each link you want to share. Users can choose to tip you with a tiny payment, or simply skip past the wall to the target link.

For example, here's one of my open-source projects, VexFlow, behind a pennywall: [VexFlow](https://give.pennywall.io/vexflow).

## Quickstart

### Hosted on pennywall.io

Simply run `bash <(curl -s https://pennywall.io/build)`, and paste in your [pennywall configuration](https://raw.githubusercontent.com/0xfe/pennywall/master/pennywall.json).

```sh
$ bash <(curl -s https://pennywall.io/build)
{
  "apiKey": "YOUR_QUID_API_KEY",
  "destination": {
    "url": "https://kevsveganblog.com/post_how_to_eat_bananas"
  }
}
^D (Hit CTRL-D)
```

The path to your pennywall is returned in the response.

```
{"success": true, path: "https://give.pennywall.io/v1k87dp"}
```

You can also send your configuration file directly with:

```sh
$ cat pennywall.json | bash <(curl -s https://pennywall.io/build)
```

Make sure to have your [QUID API key](https://how.quid.works/selling-with-quid/setup-a-pennywall-with-quid) handy to accept payments. (The key must allow access from origin `https://give.pennywall.io`.)

### Self hosted

Install pennywall:

```
npm i pennywall
```

Edit your configuration file. You need a [QUID API key](https://how.quid.works/selling-with-quid/setup-a-pennywall-with-quid) API key to accept payments.

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

## Examples

<p align="center">
  <a href="http://give.pennywall.io/kevsveganblog"><img src="https://imgur.com/n7fpFHS.png" width=300 /></a>
  &nbsp;
  <a href="http://give.pennywall.io/kevsmaroonblog"><img src="https://imgur.com/kg0UEEW.png" width=300 /></a>
</p>

## Configuration

```
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
    "palette": "maroon",
    "icon": "face",
    "title": "Donate to Kev's Vegan Blog",
    "message": "This site is supported with your donations. Please consider adding a tip.",
    "allowSkip": true,
    "skipText": "No thanks! Take me Kev's Vegan Blog."
  }
}
```

## Themes

Current themes:

* `heart` with palettes `maroon`, `metal`, `blue`
* `vegout` with palettes `maroon`, `metal`, `blue`

### Creating a new theme

* Add a new directory under `themes/NAME`
* Include files `index.hbs` (handlebars HTML), `index.js`, and `index.scss`
   * For custom palettes, you and have multiple `index-PALETE.scss` files.
   * Additional assets (images, videos, fonts) must be under `themes/NAME/assets`
* Finally, add your theme configuration (name, palettes, etc.) to `src/themes.js`
* If you want your theme to be shareable (on https://give.pennywall.io), send a PR :-)

## Hacking on this repo

Run a local webserver and watch the files for changes.

### First time setup

```
git clone this repo
npm i
npm link
```

### During development

```
npx serve
npm run watch
```

### Publishing a new release

```
# bump version in package.json
npm login
npm publish
```

## MIT License

Copyright (c) Mohit Muthanna Cheppudira 2019 <br/>
0xFE <mohit@muthanna.com> http://www.pennywall.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
