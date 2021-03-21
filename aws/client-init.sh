#! /bin/bash
sudo apt-get update
echo "REACT_APP_SERVER_API_BASE_URL=http://${REACT_APP_SERVER_API_BASE_URL}" >> /etc/environment
echo "REACT_APP_SERVER_API_PORT=${REACT_APP_SERVER_API_PORT}" >> /etc/environment
sudo apt-get install -y npm
sudo apt-get install -y apache2
sudo systemctl start apache2
sudo systemctl enable apache2
sudo a2enmod rewrite
sudo chmod 777 /etc/apache2/sites-available/000-default.conf
sudo truncate -s0 /etc/apache2/sites-available/000-default.conf
sudo echo "<VirtualHost *:80>" > /etc/apache2/sites-available/000-default.conf
sudo echo "ServerAdmin webmaster@localhost" >> /etc/apache2/sites-available/000-default.conf
sudo echo "DocumentRoot /var/www/html" >> /etc/apache2/sites-available/000-default.conf
sudo echo "<Directory '/var/www/html'>" >> /etc/apache2/sites-available/000-default.conf
sudo echo "Options FollowSymLinks" >> /etc/apache2/sites-available/000-default.conf
sudo echo "AllowOverride All" >> /etc/apache2/sites-available/000-default.conf
sudo echo "RewriteEngine on" >> /etc/apache2/sites-available/000-default.conf
sudo echo "RewriteCond %%{REQUEST_FILENAME} -f [OR]" >> /etc/apache2/sites-available/000-default.conf
sudo echo "RewriteCond %%{REQUEST_FILENAME} -d" >> /etc/apache2/sites-available/000-default.conf
sudo echo "RewriteRule ^ - [L]" >> /etc/apache2/sites-available/000-default.conf
sudo echo "RewriteRule ^ index.html [L]" >> /etc/apache2/sites-available/000-default.conf
sudo echo "</Directory>" >> /etc/apache2/sites-available/000-default.conf
sudo echo "</VirtualHost>" >> /etc/apache2/sites-available/000-default.conf
sudo chmod 644 /etc/apache2/sites-available/000-default.conf
sudo systemctl restart apache2
sudo chown -R ubuntu:www-data /var/www
sudo usermod -a -G www-data ubuntu
echo "<h1>Deployed via Terraform</h1>" | sudo tee /var/www/html/index.html
# sudo scp -i ~/.ssh/aws-mac -r build/* ubuntu@52.23.214.166:/var/www/html