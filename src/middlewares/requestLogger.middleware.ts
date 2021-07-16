import { Injectable, NestMiddleware, Logger } from "@nestjs/common";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger();

  use(request, response, next): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get("user-agent") || "";

    response.on("finish", () => {
      const { statusCode } = response;
      const contentLength = response.get("content-length");

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    next();
  }
}
