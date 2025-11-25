import { createParamDecorator, ExecutionContext } from "@nestjs/common";



export const RawHeaders = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // Implement your logic here
    return req.rawHeaders;
  },
);