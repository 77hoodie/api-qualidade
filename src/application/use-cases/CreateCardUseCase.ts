import type { CreateCardInputDto } from "../dto/requests";
import type { CardRepository } from "../ports/CardRepository";
import type { UserRepository } from "../ports/UserRepository";
import type { IdGenerator } from "../ports/IdGenerator";
import { NotFoundError } from "../../shared/errors/NotFoundError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { Card } from "../../domain/entities/Card";
import { CardStatus } from "../../shared/constants/card-status";
import { MIN_LIMIT_CENTS } from "../../shared/constants/business-rules";

export class CreateCardUseCase {
  private static readonly CARD_NUMBER_PATTERN = /^\d{16}$/;
  private static readonly USER_NOT_FOUND_MESSAGE = "User not found";
  private static readonly INVALID_CARD_NUMBER_MESSAGE = "Card number must have exactly 16 digits";
  private static readonly INVALID_LIMIT_MESSAGE = `Card limit must be at least ${MIN_LIMIT_CENTS} cents`;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly cardRepository: CardRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  public async execute(input: CreateCardInputDto): Promise<Card> {
    await this.validateUserExists(input.userId);
    this.validateCardNumber(input.cardNumber);
    this.validateLimitCents(input.limitCents);

    const card = this.createCard(input);
    await this.cardRepository.save(card);
    return card;
  }

  private async validateUserExists(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError(CreateCardUseCase.USER_NOT_FOUND_MESSAGE);
    }
  }

  private validateCardNumber(cardNumber: string): void {
    if (!CreateCardUseCase.CARD_NUMBER_PATTERN.test(cardNumber)) {
      throw new ValidationError(CreateCardUseCase.INVALID_CARD_NUMBER_MESSAGE);
    }
  }

  private validateLimitCents(limitCents: number): void {
    if (!Number.isInteger(limitCents) || limitCents < MIN_LIMIT_CENTS) {
      throw new ValidationError(CreateCardUseCase.INVALID_LIMIT_MESSAGE);
    }
  }

  private createCard(input: CreateCardInputDto): Card {
    return Card.create({
      id: this.idGenerator.generate(),
      userId: input.userId,
      last4: this.extractLast4Digits(input.cardNumber),
      limitCents: input.limitCents,
      availableLimitCents: input.limitCents,
      status: CardStatus.ACTIVE,
      createdAt: new Date()
    });
  }

  private extractLast4Digits(cardNumber: string): string {
    return cardNumber.slice(-4);
  }
}
