/*
 * @Date: 2023-12-30 10:49:03
 * @LastEditors: zhumanyao
 * @LastEditTime: 2024-01-05 16:56:37
 * @FilePath: \server-web\node-server\nestjs-server\src\main.ts
 */

import { NestFactory } from '@nestjs/core'; // nestJs 的创建工厂
import { AppModule } from './app.module'; // nestJs 的入口模块文件 类似于 vue 的 App.vue
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';
import * as session from 'express-session';
const hostname = '192.168.31.27';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.use(
    session({
      secret: 'manyao',
      rolling: true,
      name: 'manyao.sid',
      cookie: { maxAge: 99999 },
    }),
  );

  await app.listen(8383, hostname, () => {
    console.log(`http://${hostname}:8383`);
  });
}
bootstrap();
