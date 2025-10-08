import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './accounts/account.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.model';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/role.guard';
import { UserModule } from './users/user.module';
import { MuscleGroupModule } from './muscleGroup/muscleGroup.module';
import { PlanModule } from './plans/plan.module';
import { ProcessModule } from './processes/process.module';
import { WorkoutModule } from './workouts/workout.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/exercise',
    ),
    AccountModule,
    AuthModule,
    UserModule,
    MuscleGroupModule,
    WorkoutModule,
    PlanModule,
    ProcessModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
