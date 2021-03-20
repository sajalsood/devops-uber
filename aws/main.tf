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
    from_port       = "3306"
    to_port         = "3306"
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
  user_data = <<-EOF
    #!/bin/bash
    echo "# App Environment Variables"
    echo "export UBER_DB_HOST=${aws_db_instance.rds.address}" >> /etc/environment
    echo "export UBER_DB_PORT=${aws_db_instance.rds.port}" >> /etc/environment
    echo "export UBER_DB_NAME=${var.db_name}" >> /etc/environment
    echo "export UBER_DB_USER=${var.db_username}" >> /etc/environment
    echo "export UBER_DB_PASSWORD=${var.db_password}" >> /etc/environment
  EOF
  tags = {
    "Name" = "ec2-uber-server"
  }
  depends_on = [aws_db_instance.rds]
}

data "template_file" "client_init" {
  template = "${file("install_client.sh")}"

  vars = {
    REACT_APP_SERVER_API_BASE_URL = aws_instance.uber-server-ec2.public_ip
    REACT_APP_SERVER_API_PORT  = var.ec2_server_port
  }
}

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
  user_data = "${data.template_file.client_init.rendered}"
  tags = {
    "Name" = "ec2-uber-client"
  }
  depends_on = [aws_instance.uber-server-ec2]
}

