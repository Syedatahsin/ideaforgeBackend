import { Router } from 'express';
import categoryController from './categories.controller';

const router = Router();

// Create a new category
router.post('/', categoryController.createCategory);

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by slug
router.get('/slug/:slug', categoryController.getCategoryBySlug);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Update category
router.patch('/:id', categoryController.updateCategory);

// Delete category
router.delete('/:id', categoryController.deleteCategory);

export default router;
