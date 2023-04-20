import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { getConfigFromEnv } from './common/dtos/configuration.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Commnity chat API')
    .setDescription(' An API that features endpoints that enables users to join their favorite artist communities and interact with other fans and even their idols')
    .setVersion('1.0')
    .addTag('communityChatAPI')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(getConfigFromEnv().appPort, listenCallback);
}
function listenCallback() {
  Logger.log(
    `*** Application running on port [${getConfigFromEnv().appPort}] ***`,
  );
};

bootstrap();
