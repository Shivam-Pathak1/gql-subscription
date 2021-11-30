import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { VideoModule } from './videos/video.module';

@Module({
  imports: [
    VideoModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
    }),
  ],
})
export class AppModule {}
