import { Controller, Get, Query } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller('search')
export class SearchController {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Get('search')
  async search(@Query('keyword') keyword: string): Promise<any> {
    const response = (await this.elasticsearchService.search({
      index: 'video_games',
      body: {
        size: 10, // TODO: param, not more than 50
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
                      rating: 0, // Avoiding bad games
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
              order: 'desc', // Make sure the game we got are in the top reviews
            },
            reviews_count: {
              order: 'desc',
            },
          },
        ],
      },
    })) as unknown as { body: { hits: { hits: { _source: any }[] } } };

    return response;
  }
}
