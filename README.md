# app

## Setup

- `yarn`: Install dependencies
- `cp .env.sample .env` Create your .env file and fill it
- Install [Prettier extension for your IDE](https://prettier.io/docs/en/editors.html) and enable "Format On Save" feature
- Enable ESLint for your IDE

## Development

- `yarn start`: run the app in the development mode on port 3000
- `yarn lint` and `yarn lint:fix`: to lint the code
- `yarn build:serve`: build and serve the app in the production mode on port 3001

## Production

- `yarn build`: build the app to `./build` dir
- `yarn serve`: serve the app in the production mode from `./build` dir
