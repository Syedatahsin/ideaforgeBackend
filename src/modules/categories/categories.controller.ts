import { Request, Response } from 'express';
import categoryService from './categories.service';
import catchAsync from '../../utils/catchAsync';

class CategoryController {
  // CREATE CATEGORY
  createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result,
    });
  });

  // GET ALL CATEGORIES
  getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await categoryService.getAllCategories(page, limit);

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      ...result,
    });
  });

  // GET CATEGORY BY ID
  getCategoryById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await categoryService.getCategoryById(id);

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    });
  });

  // GET CATEGORY BY SLUG
  getCategoryBySlug = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const result = await categoryService.getCategoryBySlug(slug);

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: result,
    });
  });

  // UPDATE CATEGORY
  updateCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await categoryService.updateCategory(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: result,
    });
  });

  // DELETE CATEGORY
  deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    await categoryService.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  });
}

export default new CategoryController();
