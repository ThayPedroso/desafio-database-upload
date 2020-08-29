// import AppError from '../errors/AppError';

import { getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    let category_id;

    const checkCategoryExists = await categoryRepository.findOne({
      where: { category },
    });

    if (!checkCategoryExists) {
      const newCategory = categoryRepository.create({ title: category });

      await categoryRepository.save(newCategory);

      category_id = newCategory.id;
    } else {
      category_id = checkCategoryExists.id;
    }

    const transactionRepository = getRepository(Transaction);

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
