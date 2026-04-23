import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { FavoriteServiceInstance } from './favorites.service';
import httpStatus from 'http-status';

const addFavorite = catchAsync(async (req: Request, res: Response) => {
  const result = await FavoriteServiceInstance.addFavorite(req.user?.id as string, req.params.ideaId as string);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Added to favorites successfully',
    data: result,
  });
});

const removeFavorite = catchAsync(async (req: Request, res: Response) => {
  await FavoriteServiceInstance.removeFavorite(req.user?.id as string, req.params.ideaId as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Removed from favorites successfully',
    data: null,
  });
});

const getMyFavorites = catchAsync(async (req: Request, res: Response) => {
  const result = await FavoriteServiceInstance.getMyFavorites(req.user?.id as string);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Favorites retrieved successfully',
    data: result,
  });
});

export const FavoriteController = {
  addFavorite,
  removeFavorite,
  getMyFavorites,
};
