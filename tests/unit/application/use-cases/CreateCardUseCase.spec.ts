import { describe, expect, it, vi } from "vitest";
import { CreateCardUseCase } from "../../../../src/application/use-cases/CreateCardUseCase";
import type { UserRepository } from "../../../../src/application/ports/UserRepository";
import type { CardRepository } from "../../../../src/application/ports/CardRepository";
import type { IdGenerator } from "../../../../src/application/ports/IdGenerator";
import { User } from "../../../../src/domain/entities/User";
import { NotFoundError } from "../../../../src/shared/errors/NotFoundError";
import { ValidationError } from "../../../../src/shared/errors/ValidationError";

describe("CreateCardUseCase", () => {
  const TEST_USER_ID = "user-1";
  const TEST_CARD_ID = "card-1";
  const TEST_CARD_NUMBER = "1234123412341234";
  const TEST_LIMIT_CENTS = 1000;
  const INVALID_CARD_NUMBER = "1234";
  
  const TEST_USER_DATA = {
    id: TEST_USER_ID,
    name: "Alice",
    email: "alice@mail.com",
    passwordHash: "hash",
    createdAt: new Date()
  };

  const TEST_INPUT = {
    userId: TEST_USER_ID,
    cardNumber: TEST_CARD_NUMBER,
    limitCents: TEST_LIMIT_CENTS
  };

  const createMockUserRepository = (findByIdResult: User | null = null): UserRepository => ({
    findById: vi.fn().mockResolvedValue(findByIdResult),
    findByEmail: vi.fn(),
    save: vi.fn()
  });

  const createMockCardRepository = (): CardRepository => ({
    findById: vi.fn(),
    findByUserId: vi.fn(),
    save: vi.fn()
  });

  const createMockIdGenerator = (id: string = TEST_CARD_ID): IdGenerator => ({
    generate: vi.fn().mockReturnValue(id)
  });

  const createTestUser = () => User.create(TEST_USER_DATA);

  const createUseCase = (
    userRepository: UserRepository,
    cardRepository: CardRepository,
    idGenerator: IdGenerator
  ) => new CreateCardUseCase(userRepository, cardRepository, idGenerator);

  it("should create card for existing user", async () => {
    const userRepository = createMockUserRepository(createTestUser());
    const cardRepository = createMockCardRepository();
    const idGenerator = createMockIdGenerator();
    const useCase = createUseCase(userRepository, cardRepository, idGenerator);

    const card = await useCase.execute(TEST_INPUT);

    expect(card.id).toBe(TEST_CARD_ID);
    expect(card.toJSON().last4).toBe("1234");
    expect(cardRepository.save).toHaveBeenCalledOnce();
  });

  it("should fail when user does not exist", async () => {
    const userRepository = createMockUserRepository(null);
    const cardRepository = createMockCardRepository();
    const idGenerator = createMockIdGenerator();
    const useCase = createUseCase(userRepository, cardRepository, idGenerator);

    await expect(useCase.execute(TEST_INPUT)).rejects.toThrow(NotFoundError);
  });

  it("should fail when card number is invalid", async () => {
    const userRepository = createMockUserRepository(createTestUser());
    const cardRepository = createMockCardRepository();
    const idGenerator = createMockIdGenerator();
    const useCase = createUseCase(userRepository, cardRepository, idGenerator);

    await expect(
      useCase.execute({
        ...TEST_INPUT,
        cardNumber: INVALID_CARD_NUMBER
      })
    ).rejects.toThrow(ValidationError);
  });
});
