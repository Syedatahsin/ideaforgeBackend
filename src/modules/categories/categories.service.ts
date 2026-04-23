import { prisma } from '../../lib/prisma';
import { ICreateCategory, IUpdateCategory, ICategoryResponse } from './categories.interface';
import AppError from '../../errors/AppError';

class CategoryService {
  // CREATE CATEGORY
  async createCategory(payload: ICreateCategory): Promise<ICategoryResponse> {
    // Check if category with same slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: payload.slug },
    });

    if (existingCategory) {
      throw new AppError(409, 'Category with this slug already exists');
    }

    const category = await prisma.category.create({
      data: {
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
      },
    });

    return category as ICategoryResponse;
  }

  // GET ALL CATEGORIES WITH PAGINATION
  async getAllCategories(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.category.count(),
    ]);

    return {
      data: categories as ICategoryResponse[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // GET CATEGORY BY ID
  async getCategoryById(id: string): Promise<ICategoryResponse> {
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    return category as ICategoryResponse;
  }

  // GET CATEGORY BY SLUG
  async getCategoryBySlug(slug: string): Promise<ICategoryResponse> {
    const category = await prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    return category as ICategoryResponse;
  }

  // UPDATE CATEGORY
  async updateCategory(id: string, payload: IUpdateCategory): Promise<ICategoryResponse> {
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new AppError(404, 'Category not found');
    }

    // If slug is being updated, check for uniqueness
    if (payload.slug && payload.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: payload.slug },
      });

      if (slugExists) {
        throw new AppError(409, 'Category with this slug already exists');
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: payload.name ?? existingCategory.name,
        slug: payload.slug ?? existingCategory.slug,
        description: payload.description ?? existingCategory.description,
      },
    });

    return updatedCategory as ICategoryResponse;
  }

  // DELETE CATEGORY
  async deleteCategory(id: string): Promise<void> {
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new AppError(404, 'Category not found');
    }

    // Check if category has associated ideas
    const ideasCount = await prisma.idea.count({
      where: { categoryId: id },
    });

    if (ideasCount > 0) {
      throw new AppError(
        409,
        `Cannot delete category with ${ideasCount} associated idea(s). Please reassign or delete the ideas first.`
      );
    }

    await prisma.category.delete({
      where: { id },
    });
  }
}

export default new CategoryService();
