# SmileMart(Order Service)

[SmileMart-Order-Url](https://smilemart-order-service.onrender.com)

## Project Overview
SmileMart(Order Service) is a core microservice in an E-commerce platform designed to manage customer orders. Built with **Node.js**, **NestJS**, **Docker**, **RabbitMQ**, **Elasticsearch**, **Mongoose**, and **MongoDB**, it follows Domain-Driven Design (DDD) principles. The service communicates with the Inventory microservice through event-based messaging using RabbitMQ. It ensures seamless order processing, real-time stock validation, and reliable logging of inventory updates. The application is containerized using Docker for easy deployment and scalability, with comprehensive API documentation accessible through Swagger by appending `/documentationView` to the base URL.

## Features
- **Order Management**: Create, update, and retrieve order details.
- **Event-Based Communication**: Listens for stock update events from the Inventory service via RabbitMQ.
- **Elasticsearch Integration**: Maintains a log table for tracking stock updates and operational events.

## Table of Contents
Installation<br />
Environment Variables<br />
Project Structure<br />
API Routes<br />
Technologies Used<br />


## Installation
To install and run the project locally:

#### Clone the repository:

``` 
git clone https://github.com/EddieBenn/Order-Service.git
```
#### Navigate into the project directory:

```
cd Order-Service
```

#### Install dependencies:

```
npm install
```

#### Create a .env file in the root directory and add the necessary environment variables (see the Environment Variables section).


#### Build the project

```
npm run build
```

#### Running the app

```
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

#### Test

```
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# Environment Variables
Create a .env file in the root directory with the following variables:

```
# DEVELOPMENT KEYS
PORT = YOUR PORT
MONGO_URI = YOUR MONGO_URI
RABBITMQ_URI = YOUR RABBITMQ_URI
ELASTICSEARCH_URL = YOUR ELASTICSEARCH_URL
ELASTIC_PASSWORD = YOUR ELASTIC_PASSWORD
INVENTORY_BASE_URL = YOUR INVENTORY_BASE_URL

```


# Project Structure

```
├── src
│   ├── common
│   ├── customers
│   ├── orders
│   ├── utils
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest.e2e.json
├── .dockerignore
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.build.json
```


## API Routes
#### Customer Routes


<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/customers</td>
      <td>Create customer</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/customers</td>
      <td>Get all customers</td>
    </tr>
    <tr>
      <td>PUT</td>
      <td>/customers/:id</td>
      <td>Update customer</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/customers/:id</td>
      <td>Delete customer</td>
    </tr>
  </tbody>
</table>

#### Order Routes


<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/orders</td>
      <td>Create order</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/orders/:id</td>
      <td>Get one order</td>
    </tr>
    <tr>
      <td>DELETE</td>
      <td>/orders/:id</td>
      <td>Delete order</td>
    </tr>
  </tbody>
</table>


## Technologies Used

<ul>
<li>
Node.js
</li>
<li>
NestJS
</li>
<li>
TypeScript
</li>
<li>
Docker
</li>
<li>
RabbitMQ (for event-based communication)
</li>
<li>
Elasticsearch (for stock update logs)
</li>
<li>
Mongoose (for ODM)
</li>
<li>
MongoDB
</li>
<li>
Jest (for unit testing)
</li>
<li>
Swagger (for API documentation and testing)
</li>
<li>
Class-validator & Class-transformer (for input validation)
</li>
</ul>
