variable "profile" {
  description = "AWS profile name for CLI"
  default     = "root"
}

variable "region" {
  description = "AWS region for infrastructure."
  default     = "us-east-1"
}

variable "ami_name" {
  description = "Name of AMI"
  type        = string
}

variable "vpc_name" {
  description = "VPC name tag value."
  default     = "vpc"
}

variable "cidr_block" {
  description = "CIDR block for VPC."
  default     = "10.0.0.0/16"
}

variable "cidrs" {
  description = "CIDR blocks for subnets."
  default     = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "azs" {
  description = "Availability zones for subnets."
  default     = ["a", "b"]
}

variable "db_storage_size" {
  description = "Availability zones for subnets."
  type        = number
  default     = 20
}

variable "db_instance_class" {
  description = "Instance class for RDS"
  default     = "db.t3.micro"
}

variable "db_engine" {
  description = "DB engine for RDS"
  default     = "postgres"
}

variable "db_engine_version" {
  description = "DB engine version for RDS"
  default     = "12"
}

variable "db_name" {
  description = "DB name"
  default     = "csye7220_uber"
}

variable "db_username" {
  description = "DB username"
  default     = "postgres"
}

variable "db_password" {
  description = "DB password"
  default     = "postgres"
}

variable "db_public_access" {
  description = "DB public accessibility"
  type        = bool
  default     = false
}

variable "db_multiaz" {
  description = "DB multi AZ"
  type        = bool
  default     = false
}

variable "ec2_server_port" {
  description = "EC2 server instance port"
  type        = string
  default     = "4444"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "instance_vol_type" {
  description = "EC2 volume type"
  type        = string
  default     = "gp2"
}

variable "instance_vol_size" {
  description = "EC2 volume size"
  type        = number
  default     = 20
}

variable "instance_subnet" {
  description = "EC2 subnet serial"
  type        = number
  default     = 2
}

variable "key_name" {
  description = "Name of key"
  type        = string
}

variable "key_path" {
  description = "Path of the key"
  type        = string
}

