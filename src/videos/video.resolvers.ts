import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Video } from '../graphql';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { PubSub } from 'graphql-subscriptions';
@Resolver('Video')
export class VideoResolvers {
  private pubSub: PubSub;
  constructor(private readonly videoService: VideoService) {
    this.pubSub = new PubSub();
  }

  @Query()
  async videos() {
    return this.videoService.findAll();
  }

  @Mutation('createVideo')
  async create(@Args('input') args: CreateVideoDto): Promise<Video> {
    const videoAdded = await this.videoService.create(args);
    this.pubSub.publish('videoAdded', { videoAdded: videoAdded });
    return videoAdded;
  }

  @Subscription(returns => Video, {
    name: 'videoAdded',
    filter: (payload, variables) =>
      payload.videoAdded.title === variables.titile,
  })
  videoAdded() {
    this.pubSub.asyncIterator('videoAdded');
  }
}
