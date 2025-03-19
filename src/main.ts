import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotFoundExceptionFilter } from './filters/notfound.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 // Get the port from environment variable or use default
 const port = process.env.PORT || 3000;

 // Enable CORS
 app.enableCors({
   origin: '*', 
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
   allowedHeaders: 'Content-Type, Accept', 
 });
 
 app.useGlobalFilters(app.get(NotFoundExceptionFilter));

 await app.listen(port);
}
bootstrap();
