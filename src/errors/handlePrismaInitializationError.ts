import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handlePrismaInitializationError = (
  err: Prisma.PrismaClientInitializationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: '',
      message: err.message,
    },
  ];

  const statusCode = 500;

  return {
    statusCode,
    message: 'Prisma Initialization Error',
    errorSources,
  };
};

export default handlePrismaInitializationError;
