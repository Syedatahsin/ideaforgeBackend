import { Prisma } from '../generated/prisma/client';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handlePrismaClientError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  let message = 'Prisma Client Request Error';
  let path = '';

  if (err.code === 'P2002') {
    message = 'Duplicate Key Violation';
    // 'target' is often an array or string mentioning the exact combination of duplicated columns
    path = err.meta?.target ? (err.meta.target as string) : '';
  } else if (err.code === 'P2025') {
    message = 'Record Not Found';
  }

  const errorSources: TErrorSources = [
    {
      path,
      message: err.message,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaClientError;
