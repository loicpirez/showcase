import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export default class SearchService {
  index = 'video_games';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(keyword: string) {
    const response: any = await this.elasticsearchService.search({
      index: 'video_games', // Replace with your actual index name
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  name: keyword,
                },
              },
              {
                bool: {
                  must_not: {
                    term: {
                      rating: 0,
                    },
                  },
                },
              },
            ],
          },
        },
        sort: [
          {
            rating: {
              order: 'desc',
            },
            rating_top: {
              order: 'desc',
            },
            reviews_count: {
              order: 'desc',
            },
          },
        ],
        size: 10000,
      },
    });

    return response.body.hits.hits.map((hit: any) => hit._source);
  }
}
