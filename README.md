# app

[MVP] StakeStar Staking Pool app (Ethereum/SSV)

![package status](https://github.com/stakestar/app/actions/workflows/firebase-hosting-merge.yml/badge.svg)
![package status](https://github.com/stakestar/app/actions/workflows/firebase-hosting-pull-request.yml/badge.svg)

## Setup

- `yarn` - install dependencies
- `cp .env.sample .env` - create your .env file and fill it

## Development

- `yarn start` - run the app in the development mode on port 3000
- `yarn build:serve` - build and serve the app in the production mode on port 3001
- Prepare your IDE:
  - Install [Prettier plugin](https -//prettier.io/docs/en/editors.html) and enable "Format On Save" feature
  - Enable ESLint

## Production

- `yarn build` - build the app to `./build` dir
- `yarn serve` - serve the app in the production mode from `./build` dir
