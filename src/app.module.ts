import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dotenv from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

dotenv.config();

@Module({
  imports: [MongooseModule.forRoot(process.env.MONGO_URI), ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
