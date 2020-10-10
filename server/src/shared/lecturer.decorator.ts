import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Lecturer = createParamDecorator(
  (data, req) => {
    return data
      ? req.user[data]
      : req.user;
  });