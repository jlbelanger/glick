# Glick

[View the site](https://glick.jennybelanger.com/).

## Development

### Requirements

- [Composer](https://getcomposer.org/)
- [Git](https://git-scm.com/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- Database
- Web server with PHP

### Setup

``` bash
# Clone the repo
git clone https://github.com/jlbelanger/glick.git

# Configure the PHP environment settings
cd glick/api
cp .env.example .env

# Install PHP dependencies
composer install

# Generate key
php artisan key:generate

# Run database migrations
php artisan migrate
php artisan db:seed

# Set permissions
chown -R www-data:www-data storage

# Create account with username "test" and password "password" (or reset existing account password to "password")
php artisan auth:reset-admin

# Configure the JS environment settings
cd ../app
cp .env.example .env
cp .env.example .env.production
cp cypress.env.example.json cypress.env.json

# Install JS dependencies
yarn install
```

### Run

``` bash
cd app && yarn start
```

Your browser should automatically open http://localhost:3000/

### Lint

``` bash
./api/vendor/bin/phpcs
```

``` bash
cd app && yarn lint
```

### Test

``` bash
./api/vendor/bin/phpunit
```

``` bash
cd app && yarn test:cypress
```

## Deployment

Essentially, to set up the repo on the server:

``` bash
git clone https://github.com/jlbelanger/glick.git
cd glick/api
cp .env.example .env
# Then configure the values in .env.
composer install
php artisan key:generate
php artisan migrate
chown -R www-data:www-data storage
cd ../app
cp .env.example .env
# Then configure the values in .env.
yarn build
```

For subsequent deploys, push changes to the main branch, then run the following on the server:

``` bash
cd glick
git fetch origin
git pull
cd api
composer install
php artisan config:clear
cd ../app
yarn build
```

### Deploy script

Note: The deploy script included in this repo depends on other scripts that only exist in my private repos. If you want to deploy this repo, you'll have to create your own script.

``` bash
./deploy.sh
```
