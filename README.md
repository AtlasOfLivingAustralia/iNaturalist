# iNaturalist
This repo stores assets used by ALA's iNaturalist instance.

## Generating stylesheet
Step 1. Install yarn

```
brew install yarn
```

Step 2. Install dependencies

```
cd PROJECT-PATH
yarn install
```

Step 3. Generate css from sass files

```
./node_modules/.bin/gulp sass
```