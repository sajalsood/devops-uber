# VPC for infrastructure
resource "aws_vpc" "tf_vpc" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  tags = {
    "Name" = var.vpc_name
  }
}

# Subnet for VPC
resource "aws_subnet" "subnet1" {
  vpc_id                  = aws_vpc.tf_vpc.id
  cidr_block              = var.cidrs[0]
  availability_zone       = join("", [var.region, var.azs[0]])
  map_public_ip_on_launch = true
  tags = {
    "Name" = "uber-vpc-subnet1"
  }
}

# Subnet 2 for VPC
resource "aws_subnet" "subnet2" {
  vpc_id                  = aws_vpc.tf_vpc.id
  cidr_block              = var.cidrs[1]
  availability_zone       = join("", [var.region, var.azs[1]])
  map_public_ip_on_launch = true
  tags = {
    "Name" = "uber-vpc-subnet2"
  }
}

# Internet gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.tf_vpc.id
  tags = {
    "Name" = "tf-igw"
  }
}

# Route table
resource "aws_route_table" "rtb" {
  vpc_id = aws_vpc.tf_vpc.id
  tags = {
    "Name" = "tf-rtb"
  }
}

# Public route
resource "aws_route" "public_route" {
  route_table_id         = aws_route_table.rtb.id
  gateway_id             = aws_internet_gateway.igw.id
  destination_cidr_block = "0.0.0.0/0"
}

# Subnet1 route table association
resource "aws_route_table_association" "assoc1" {
  subnet_id      = aws_subnet.subnet1.id
  route_table_id = aws_route_table.rtb.id
}

# Subnet2 route table association
resource "aws_route_table_association" "assoc2" {
  subnet_id      = aws_subnet.subnet2.id
  route_table_id = aws_route_table.rtb.id
}

# Uber Client Application security group
resource "aws_security_group" "uber_client_app_sg" {
  name        = "uber-client-application"
  description = "Security group for EC2 instance with uber client application"
  vpc_id      = aws_vpc.tf_vpc.id
  ingress {
    protocol    = "tcp"
    from_port   = "22"
    to_port     = "22"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol    = "tcp"
    from_port   = "80"
    to_port     = "80"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    "Name" = "uber-client-app-sg"
  }
}

# Application security group
resource "aws_security_group" "uber_server_app_sg" {
  name        = "uber-server-application"
  description = "Security group for EC2 instance with uber server web application"
  vpc_id      = aws_vpc.tf_vpc.id
  ingress {
    protocol    = "tcp"
    from_port   = "22"
    to_port     = "22"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    protocol    = "tcp"
    from_port   = var.ec2_server_port
    to_port     = var.ec2_server_port
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  tags = {
    "Name" = "uber-server-app-sg"
  }
}

# Database security group
resource "aws_security_group" "db_sg" {
  name        = "uber-database-sg"
  description = "Security group for RDS instance for uber database"
  vpc_id      = aws_vpc.tf_vpc.id
  ingress {
    protocol        = "tcp"
    from_port       = "5432"
    to_port         = "5432"
    security_groups = [aws_security_group.uber_server_app_sg.id]
  }
  tags = {
    "Name" = "uber-db-sg"
  }
}

#db subnet group for rds
resource "aws_db_subnet_group" "db_subnet_group" {
  description = "Subnet group for RDS"
  subnet_ids  = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
  tags = {
    "Name" = "uber-db-subnet-group"
  }
}

#rds
resource "aws_db_instance" "rds" {
  allocated_storage      = var.db_storage_size
  identifier             = "uber-app-rds-db"
  db_subnet_group_name   = aws_db_subnet_group.db_subnet_group.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  instance_class         = var.db_instance_class
  engine                 = var.db_engine
  engine_version         = var.db_engine_version
  name                   = var.db_name
  username               = var.db_username
  password               = var.db_password
  publicly_accessible    = var.db_public_access
  multi_az               = var.db_multiaz
  skip_final_snapshot    = true
  tags = {
    "Name" = "uber-rds"
  }
}

# Server EC2
resource "aws_instance" "uber-server-ec2" {
  ami                  = var.ami_name
  instance_type        = var.instance_type
  subnet_id            = element([aws_subnet.subnet1.id, aws_subnet.subnet2.id], var.instance_subnet - 2)
  key_name             = var.key_name
  security_groups      = [aws_security_group.uber_server_app_sg.id]
  ebs_block_device {
    device_name           = "/dev/sda1"
    volume_type           = var.instance_vol_type
    volume_size           = var.instance_vol_size
    delete_on_termination = true
  }

  connection {
    type = "ssh"
    user = "ubuntu"
    private_key = "${file(var.key_path)}"
    host = "${self.public_ip}"
  } 

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo chmod 777 /etc/environment",
      "echo UBER_DB_HOST=${aws_db_instance.rds.address} >> /etc/environment",
      "echo UBER_DB_PORT=${aws_db_instance.rds.port} >> /etc/environment",
      "echo UBER_DB_NAME=${var.db_name} >> /etc/environment",
      "echo UBER_DB_USER=${var.db_username} >> /etc/environment",
      "echo UBER_DB_PASSWORD=${var.db_password} >> /etc/environment",
      "sudo chmod 644 /etc/environment",
      "curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -",
      "sudo apt install -y nodejs",
      "mkdir /home/ubuntu/app/"
    ]
  }

  provisioner "local-exec" {
    command = "rm -rf ../backend/node_modules"
  }

  provisioner "file" {
    source      = "../backend/"
    destination = "/home/ubuntu/app"
  }

  provisioner "remote-exec" {
    inline = [
      "cd /home/ubuntu/app/",
      "rm .env",
      "npm install",
      "sudo touch /etc/systemd/system/uber-server.service",
      "sudo chmod 777 /etc/systemd/system/uber-server.service",
      "sudo echo '[Unit]' > /etc/systemd/system/uber-server.service",
      "sudo echo 'Description=UBER Server Service' >> /etc/systemd/system/uber-server.service",
      "sudo echo 'After=network.target' >> /etc/systemd/system/uber-server.service",
      "sudo echo '[Service]' >> /etc/systemd/system/uber-server.service",
      "sudo echo 'ExecStart=/usr/bin/node /home/ubuntu/app/server.js' >> /etc/systemd/system/uber-server.service",
      "sudo echo 'User=ubuntu' >> /etc/systemd/system/uber-server.service",
      "sudo echo 'EnvironmentFile=/etc/environment/' >> /etc/systemd/system/uber-server.service",
      "sudo echo '[Install]' >> /etc/systemd/system/uber-server.service",
      "sudo echo 'WantedBy=multi-user.target' >> /etc/systemd/system/uber-server.service",
      "sudo chmod 644 /etc/systemd/system/uber-server.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl start uber-server",
      "sudo systemctl enable uber-server"
    ]
  }

  tags = {
    "Name" = "ec2-uber-server"
  }
  depends_on = [aws_db_instance.rds]
}

# Elastic IP for uber-server-ec2
resource "aws_eip" "uber-server-eip" {
  instance = aws_instance.uber-server-ec2.id
  vpc      = true
  depends_on = [aws_instance.uber-server-ec2]
}

# Client EC2
resource "aws_instance" "uber-client-ec2" {
  ami                  = var.ami_name
  instance_type        = var.instance_type
  subnet_id            = element([aws_subnet.subnet1.id, aws_subnet.subnet2.id], var.instance_subnet - 1)
  key_name             = var.key_name
  security_groups      = [aws_security_group.uber_client_app_sg.id]
  ebs_block_device {
    device_name           = "/dev/sda1"
    volume_type           = var.instance_vol_type
    volume_size           = var.instance_vol_size
    delete_on_termination = true
  }

  connection {
    type = "ssh"
    user = "ubuntu"
    private_key = "${file(var.key_path)}"
    host = "${self.public_ip}"
  } 

  provisioner "remote-exec" {
    inline = [
      "sudo apt-get update",
      "sudo chmod 777 /etc/environment",
      "echo REACT_APP_SERVER_API_BASE_URL=http://${aws_eip.uber-server-eip.public_ip} >> /etc/environment",
      "echo REACT_APP_SERVER_API_PORT=${var.ec2_server_port} >> /etc/environment",
      "sudo chmod 644 /etc/environment",
      "curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -",
      "sudo apt install -y nodejs",
      "sudo apt-get install -y apache2",
      "sudo systemctl start apache2",
      "sudo systemctl enable apache2",
      "sudo a2enmod rewrite",
      "sudo systemctl restart apache2",
      "sudo chmod 777 /etc/apache2/sites-available/000-default.conf",
      "sudo truncate -s0 /etc/apache2/sites-available/000-default.conf",
      "sudo echo '<VirtualHost *:80>' > /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'ServerAdmin webmaster@localhost' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'DocumentRoot /var/www/html' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo '<Directory '/var/www/html'>' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'Options FollowSymLinks' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'AllowOverride All' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'RewriteEngine on' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'RewriteCond %%{REQUEST_FILENAME} -f [OR]' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'RewriteCond %%{REQUEST_FILENAME} -d' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'RewriteRule ^ - [L]' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo 'RewriteRule ^ index.html [L]' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo '</Directory>' >> /etc/apache2/sites-available/000-default.conf",
      "sudo echo '</VirtualHost>' >> /etc/apache2/sites-available/000-default.conf",
      "sudo chmod 644 /etc/apache2/sites-available/000-default.conf",
      "sudo systemctl restart apache2",
      "sudo chown -R ubuntu:www-data /var/www",
      "sudo usermod -a -G www-data ubuntu",
      "mkdir /home/ubuntu/app/"
    ]
  }

  provisioner "local-exec" {
    command = "rm -rf ../frontend/client-uber/node_modules ../frontend/client-uber/build"
  }

  provisioner "file" {
    source      = "../frontend/client-uber/"
    destination = "/home/ubuntu/app"
  }

  provisioner "remote-exec" {
    inline = [
      "cd /home/ubuntu/app",
      "rm .env",
      "npm install",
      "npm run build",
      "cp -r build/* /var/www/html/"
    ]
  }

  tags = {
    "Name" = "ec2-uber-client"
  }
  depends_on = [aws_instance.uber-server-ec2]
}

output "ec2_public_ip" {
  value = aws_instance.uber-client-ec2.public_ip
   description = "The public IP address of the uber client instance."
}