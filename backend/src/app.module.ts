
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host:  'localhost',
      port: 5438,
      username: 'unicourt_user',
      password: 'admin',
      database: 'uc_master',
      autoLoadEntities: true,
      synchronize: true,
    }),

    TasksModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

