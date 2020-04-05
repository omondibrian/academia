import { Module } from '@nestjs/common';
import { Auth } from './auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
const MONGODB_URL = process.env.MONGODB_URL
@Module({
  imports: [Auth,MongooseModule.forRoot(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
