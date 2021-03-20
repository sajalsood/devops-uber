# VPC for infrastructure
resource "aws_vpc" "tf_vpc" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  tags = {
    "Name" = var.vpc_name
  }
}

# Subnet for VPC
resource "aws_subnet" "subnet" {
  vpc_id                  = aws_vpc.tf_vpc.id
  cidr_block              = var.cidrs
  availability_zone       = join("", [var.region, var.azs])
  map_public_ip_on_launch = true
  tags = {
    "Name" = "subnet"
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

# Subnet route table association
resource "aws_route_table_association" "assoc" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.rtb.id
}

# Uber Client Application security group
resource "aws_security_group" "uber_client_app_sg" {
  name        = "uber_client_application"
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
  name        = "uber_server_application"
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
    from_port   = "4444"
    to_port     = "4444"
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
  name        = "database"
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

resource "aws_instance" "uber-client-ec2" {
  ami                  = var.ami_name
  subnet_id            = element([aws_subnet.subnet.id], var.instance_subnet - 1)
  key_name             = var.key_name
  instance_type        = var.instance_type
  security_groups      = [aws_security_group.uber_client_app_sg.id]
  ebs_block_device {
    device_name           = "/dev/sda1"
    volume_type           = var.instance_vol_type
    volume_size           = var.instance_vol_size
    delete_on_termination = true
  }
  tags = {
    "Name" = "ec2-uber-client"
  }
}

resource "aws_instance" "uber-server-ec2" {
  ami                  = var.ami_name
  subnet_id            = element([aws_subnet.subnet.id], var.instance_subnet - 1)
  key_name             = var.key_name
  instance_type        = var.instance_type
  security_groups      = [aws_security_group.uber_server_app_sg.id]
  ebs_block_device {
    device_name           = "/dev/sda1"
    volume_type           = var.instance_vol_type
    volume_size           = var.instance_vol_size
    delete_on_termination = true
  }
  tags = {
    "Name" = "ec2-uber-server"
  }
}
