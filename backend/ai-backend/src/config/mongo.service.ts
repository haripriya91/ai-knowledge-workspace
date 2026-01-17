// src/config/mongo.service.ts
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongoConfig = (): MongooseModuleOptions => ({
  uri: process.env.MONGODB_URI,
});
