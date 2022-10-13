# Etap Wallet

## Description

A REST API basic wallet system

## Installation

```bash
$ yarn
```

## Setup

Provide requested variables in example.env.

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

### Base url

```http
    http://localhost:{{port}}/api/v1/
```

## Authorization

All API requests require the use of a generated API key. Generate a new one, by navigating to the /auth endpoint, or checkout APIs in the root directory.

To authenticate an API request, you should provide your ACCESS TOKEN in the `Authorization` header.

```http
POST /auth
```

```javascript
Content-Type: application/json
Authorization: Bearer {{ACCESS_TOKEN}}

{
  "phone" : string,
  "password" : string
}
```

## Responses

Many API endpoints return the JSON representation of the resources created or edited. However, if an invalid request is submitted, or some other error occurs, Gophish returns a JSON response in the following format:

### Success

```javascript
{
  {
  "statusCode": 200,
  "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIxZCIsInBob25lIjoiMDkwMzAwMDAwMDAiLCJzdWIiOjMsImlhdCI6MTY2NTY1NTQ3NywiZXhwIjoxNjY1NzQxODc3fQ.sgUA64oCjhUYfU7P5_qugiLukzKj9R_rDvmLXkimdZO"
      }
    }
}
```

### Denied

```javascript
{
  "statusCode": 401,
  "message": "Incorrect login credentials",
  "error": "Unauthorized"
}
```

### Unauthorized

```javascript
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## User Endpoint

This endpoint manages user creation.

```http
POST /user/new
```

## Responses

### Success

```javascript
{
  "statusCode": 201,
  "user": {
    "phone": string,
    "id": number,
    "createdAt": date,
    "updatedAt": date,
    "role": string
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIxZCIsInBob25lIjoiMDkwMzAwMDAwMDAiLCJzdWIiOjMsImlhdCI6MTY2NTY1NTQ3NywiZXhwIjoxNjY1NzQxODc3fQ.sgUA64oCjhUYfU7P5_qugiLukzKj9R_rDvmLXkimdZO"
}
```

### Duplicate

```javascript
{
  "statusCode": 409,
  "message": "Sorry! This mobile number is already registered",
  "error": "Conflict"
}

```

## Wallet Endpoint

This endpoint manages wallet activities.

```http
POST /wallet/new
```

### Success

```javascript
 "statusCode": 201,
  "wallet": {
    "curr": string,
    "user": number,
    "id": number,
    "amount": number,
    "createdAt": date,
    "updatedAt": date
  }
}
```

### Duplicate

```javascript
{
  "statusCode": 409,
  "message": "Sorry! A wallet with this currency exist on your account",
  "error": "Conflict"
}
```

## Status Codes

Etap returns the following status codes in its API:

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 201         | `CREATED`               |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 401         | `UNAUTHORIZED`          |
| 409         | `CONFILICT`             |
| 500         | `INTERNAL SERVER ERROR` |
