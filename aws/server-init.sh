#! /bin/bash
sudo apt-get update
echo "UBER_DB_HOST=${UBER_DB_HOST}" >> /etc/environment
echo "UBER_DB_PORT=${UBER_DB_PORT}" >> /etc/environment
echo "UBER_DB_NAME=${UBER_DB_NAME}" >> /etc/environment
echo "UBER_DB_USER=${UBER_DB_USER}" >> /etc/environment
echo "UBER_DB_PASSWORD=${UBER_DB_PASSWORD}" >> /etc/environment
sudo apt-get install -y npm
sudo apt-get install -y nodejs
# sudo scp -i ~/.ssh/aws-mac -r build/* ubuntu@52.23.214.166:/var/www/html