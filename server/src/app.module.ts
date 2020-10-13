
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { CourseModule } from './modules/course.module';
import { StudentModule } from './student/student.module';
import { LecturerModule } from './modules/lecturer.module'; import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AesGcmModule } from '@nestrx/aes-gcm';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // AuthModule,
    LecturerModule,
    StudentModule,
    CourseModule,
    MongooseModule.forRoot(
      'mongodb+srv://m001-student:m001-mongodb-basics@sandbox-cehti.azure.mongodb.net/regopid?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),

  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpErrorFilter,
    // },
    AppService]
})
export class AppModule { }
