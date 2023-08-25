import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        node: 'http://localhost:9200', // @TODO: Change this to env and config
      }),
      inject: [],
    }),
  ],
  exports: [ElasticsearchModule],
})
export class SearchModule {}
