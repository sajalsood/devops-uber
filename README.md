# devops-uber

# Team 1

| Name            | Email Address                |
| --------------- | ---------------------------- |
| mary namratha   | vatti.m@northeastern.edu     |
| sajal sood      | sood.sa@northeastern.edu     |

## Introduction:

Uber-app is an the modern service that allows users to book a bus between source location and destination location. Users can view the bookings tab.

Terraform scripts create this scalable microservices application and deploy it on AWS CLoud Infrastructure.

## Scope:

The deployment scripts would automate the creation of VPC,subnets,ip-gateway,route tables,rds using Terraform scripts. All routing is managed internally by Service Names, so no IP's needs to be edited.

## Features

Application Features

1. Login into the Uber-app
2. Web application where user can book a bus
3. User can view all bookings. 

## Infrastructure:

The project has the following components:

### Components:

    - Frontend:
    -   1. React JS
    -   2. Apache server
    - Middleware:
    -   1. Express JS
    -   2. Daemon service running a node server
    - Backend:
    -   1. PostgreSQL

    	
Application Deployment

1. Terraform to provision infrastructure

## PreReq tools that you need

1. `aws-cli`
2. `git`
3. `terraform`
4. `aws-iam-authenticator`

## Dependancies

We need [Terraform](https://www.terraform.io/downloads.html)

## Initial set up

Clone the project, and open the Terminal(Linux/Mac) or Git bash(Windows) into the infrastructure directory of the project and run the command:

1. `Terraform init`
2. `Terraform plan`
3. `Terraform apply`

Access the `ec2_public_ip` to view the uber-app

