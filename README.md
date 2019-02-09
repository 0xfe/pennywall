# pennywall

A self-hosted donation / tip wall for sharing content

## Dev

Watch while hacking:

```
npx nodemon -e js,hbs,sass -w themes/ -w index.js -x './index.js build default --title Hi'
```

## Usage

### Build pennywal

```
pennywall theme -k APIKEY --title "My Title"
```

### Serve built results

```
npx serve
```


