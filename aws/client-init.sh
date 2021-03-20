#! /bin/bash
sudo apt-get update
echo "REACT_APP_SERVER_API_BASE_URL=http://${REACT_APP_SERVER_API_BASE_URL}" >> /etc/environment
echo "REACT_APP_SERVER_API_PORT=${REACT_APP_SERVER_API_PORT}" >> /etc/environment
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
sudo systemctl start apache2
sudo systemctl enable apache2
sudo chown -R ubuntu:www-data /var/www
sudo usermod -a -G www-data ubuntu
echo "<h1>Deployed via Terraform</h1>" | sudo tee /var/www/html/index.html
# sudo scp -i ~/.ssh/aws-mac -r build/* ubuntu@52.23.214.166:/var/www/html