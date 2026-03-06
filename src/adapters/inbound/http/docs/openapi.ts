export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Mini Fintech API",
    version: "1.0.0",
    description: "API para processamento de transacoes financeiras com arquitetura hexagonal"
  },
  servers: [
    {
      url: "/api",
      description: "Base path local"
    }
  ],
  tags: [
    { name: "Users" },
    { name: "Cards" },
    { name: "Transactions" },
    { name: "Invoices" }
  ],
  components: {
    parameters: {
      TransactionIdPath: {
        name: "transactionId",
        in: "path",
        required: true,
        schema: { $ref: "#/components/schemas/StringType" }
      },
      CardIdPath: {
        name: "cardId",
        in: "path",
        required: true,
        schema: { $ref: "#/components/schemas/StringType" }
      },
      ReferenceMonthQuery: {
        name: "referenceMonth",
        in: "query",
        required: true,
        schema: { $ref: "#/components/schemas/ReferenceMonthType" }
      }
    },
    responses: {
      Created: {
        description: "Recurso criado com sucesso"
      },
      Success: {
        description: "Operacao realizada com sucesso"
      },
      UserCreated: {
        allOf: [
          { $ref: "#/components/responses/Created" },
          {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" }
              }
            }
          }
        ]
      },
      CardCreated: {
        allOf: [
          { $ref: "#/components/responses/Created" },
          {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CardResponse" }
              }
            }
          }
        ]
      },
      TransactionCreated: {
        allOf: [
          { $ref: "#/components/responses/Created" },
          {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" }
              }
            }
          }
        ]
      },
      TransactionUpdated: {
        allOf: [
          { $ref: "#/components/responses/Success" },
          {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" }
              }
            }
          }
        ]
      },
      InvoiceRetrieved: {
        allOf: [
          { $ref: "#/components/responses/Success" },
          {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/InvoiceResponse" }
              }
            }
          }
        ]
      },
      ValidationError: {
        description: "Erro de validacao",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      },
      NotFound: {
        description: "Recurso nao encontrado",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      }
    },
    requestBodies: {
      CreateUser: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateUserRequest" }
          }
        }
      },
      CreateCard: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateCardRequest" }
          }
        }
      },
      ProcessTransaction: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ProcessTransactionRequest" }
          }
        }
      }
    },
    schemas: {
      StringType: {
        type: "string"
      },
      IntegerType: {
        type: "integer"
      },
      DateTimeType: {
        type: "string",
        format: "date-time"
      },
      EmailType: {
        type: "string",
        format: "email"
      },
      ReferenceMonthType: {
        type: "string",
        example: "2026-03"
      },
      IdField: {
        allOf: [{ $ref: "#/components/schemas/StringType" }]
      },
      UserIdField: {
        allOf: [
          { $ref: "#/components/schemas/StringType" },
          { example: "user-id" }
        ]
      },
      CardIdField: {
        allOf: [
          { $ref: "#/components/schemas/StringType" },
          { example: "card-id" }
        ]
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              code: {
                allOf: [
                  { $ref: "#/components/schemas/StringType" },
                  { example: "VALIDATION_ERROR" }
                ]
              },
              message: {
                allOf: [
                  { $ref: "#/components/schemas/StringType" },
                  { example: "Invalid input" }
                ]
              }
            },
            required: ["code", "message"]
          }
        },
        required: ["error"]
      },
      CreateUserRequest: {
        type: "object",
        properties: {
          name: {
            allOf: [
              { $ref: "#/components/schemas/StringType" },
              { example: "Alice" }
            ]
          },
          email: {
            allOf: [
              { $ref: "#/components/schemas/EmailType" },
              { example: "alice@mail.com" }
            ]
          },
          password: {
            allOf: [
              { $ref: "#/components/schemas/StringType" },
              { minLength: 8, example: "12345678" }
            ]
          }
        },
        required: ["name", "email", "password"]
      },
      UserResponse: {
        type: "object",
        properties: {
          id: { $ref: "#/components/schemas/IdField" },
          name: { $ref: "#/components/schemas/StringType" },
          email: { $ref: "#/components/schemas/StringType" },
          createdAt: { $ref: "#/components/schemas/DateTimeType" }
        },
        required: ["id", "name", "email", "createdAt"]
      },
      CreateCardRequest: {
        type: "object",
        properties: {
          userId: { $ref: "#/components/schemas/UserIdField" },
          cardNumber: {
            allOf: [
              { $ref: "#/components/schemas/StringType" },
              { pattern: String.raw`^\d{16}$`, example: "1234123412341234" }
            ]
          },
          limitCents: {
            allOf: [
              { $ref: "#/components/schemas/IntegerType" },
              { minimum: 100, example: 500000 }
            ]
          }
        },
        required: ["userId", "cardNumber", "limitCents"]
      },
      CardResponse: {
        type: "object",
        properties: {
          id: { $ref: "#/components/schemas/IdField" },
          userId: { $ref: "#/components/schemas/StringType" },
          last4: {
            allOf: [
              { $ref: "#/components/schemas/StringType" },
              { example: "1234" }
            ]
          },
          limitCents: { $ref: "#/components/schemas/IntegerType" },
          availableLimitCents: { $ref: "#/components/schemas/IntegerType" },
          status: {
            allOf: [
              { $ref: "#/components/schemas/StringType" },
              { enum: ["ACTIVE", "BLOCKED"] }
            ]
          },
          createdAt: { $ref: "#/components/schemas/DateTimeType" }
        },
        required: ["id", "userId", "last4", "limitCents", "availableLimitCents", "status", "createdAt"]
      },
      ProcessTransactionRequest: {
        type: "object",
        properties: {
          userId: { $ref: "#/components/schemas/UserIdField" },
          cardId: { $ref: "#/components/schemas/CardIdField" },
          amountCents: {
            allOf: [
              { $ref: "#/components/schemas/IntegerType" },
              { minimum: 1, example: 10000 }
            ]
          },
          description: {
            allOf: [
              { $ref: "#/components/schemas/StringType" },
              { example: "Compra mercado" }
            ]
          }
        },
        required: ["userId", "cardId", "amountCents", "description"]
      },
      TransactionResponse: {
        type: "object",
        properties: {
          id: { $ref: "#/components/schemas/IdField" },
          cardId: { $ref: "#/components/schemas/StringType" },
          userId: { $ref: "#/components/schemas/StringType" },
          amountCents: { $ref: "#/components/schemas/IntegerType" },
          description: { $ref: "#/components/schemas/StringType" },
          status: {
            allOf: [
              { $ref: "#/components/schemas/StringType" },
              { enum: ["PENDING", "APPROVED", "DECLINED", "CANCELLED", "CHARGEBACK"] }
            ]
          },
          referenceMonth: { $ref: "#/components/schemas/ReferenceMonthType" },
          createdAt: { $ref: "#/components/schemas/DateTimeType" },
          cancelledAt: {
            allOf: [
              { $ref: "#/components/schemas/DateTimeType" },
              { nullable: true }
            ]
          },
          chargebackAt: {
            allOf: [
              { $ref: "#/components/schemas/DateTimeType" },
              { nullable: true }
            ]
          }
        },
        required: [
          "id",
          "cardId",
          "userId",
          "amountCents",
          "description",
          "status",
          "referenceMonth",
          "createdAt"
        ]
      },
      InvoiceResponse: {
        type: "object",
        properties: {
          id: { $ref: "#/components/schemas/IdField" },
          cardId: { $ref: "#/components/schemas/StringType" },
          userId: { $ref: "#/components/schemas/StringType" },
          referenceMonth: { $ref: "#/components/schemas/ReferenceMonthType" },
          totalCents: { $ref: "#/components/schemas/IntegerType" },
          transactionIds: {
            type: "array",
            items: { $ref: "#/components/schemas/StringType" }
          },
          generatedAt: { $ref: "#/components/schemas/DateTimeType" }
        },
        required: ["id", "cardId", "userId", "referenceMonth", "totalCents", "transactionIds", "generatedAt"]
      }
    }
  },
  paths: {
    "/users": {
      post: {
        tags: ["Users"],
        summary: "Criar usuario",
        requestBody: { $ref: "#/components/requestBodies/CreateUser" },
        responses: {
          "201": { $ref: "#/components/responses/UserCreated" },
          "400": { $ref: "#/components/responses/ValidationError" }
        }
      }
    },
    "/cards": {
      post: {
        tags: ["Cards"],
        summary: "Criar cartao",
        requestBody: { $ref: "#/components/requestBodies/CreateCard" },
        responses: {
          "201": { $ref: "#/components/responses/CardCreated" },
          "404": { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/transactions": {
      post: {
        tags: ["Transactions"],
        summary: "Processar transacao",
        requestBody: { $ref: "#/components/requestBodies/ProcessTransaction" },
        responses: {
          "201": { $ref: "#/components/responses/TransactionCreated" }
        }
      }
    },
    "/transactions/{transactionId}/cancel": {
      post: {
        tags: ["Transactions"],
        summary: "Cancelar transacao",
        parameters: [
          { $ref: "#/components/parameters/TransactionIdPath" }
        ],
        responses: {
          "200": { $ref: "#/components/responses/TransactionUpdated" }
        }
      }
    },
    "/transactions/{transactionId}/chargeback": {
      post: {
        tags: ["Transactions"],
        summary: "Simular chargeback",
        parameters: [
          { $ref: "#/components/parameters/TransactionIdPath" }
        ],
        responses: {
          "200": { $ref: "#/components/responses/TransactionUpdated" }
        }
      }
    },
    "/cards/{cardId}/invoice": {
      get: {
        tags: ["Invoices"],
        summary: "Gerar ou consultar fatura mensal",
        parameters: [
          { $ref: "#/components/parameters/CardIdPath" },
          { $ref: "#/components/parameters/ReferenceMonthQuery" }
        ],
        responses: {
          "200": { $ref: "#/components/responses/InvoiceRetrieved" }
        }
      }
    }
  }
} as const;
