import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('SearchController', () => {
  let controller: SearchController;
  let elasticsearchService: ElasticsearchService;

  const mockElasticsearchService = {
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: ElasticsearchService,
          useValue: mockElasticsearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('search', () => {
    it('should return search results', async () => {
      const keyword = 'example_keyword';
      const searchResponse = {
        body: {
          hits: {
            hits: [
              {
                _source: { id: 1, name: 'Game 1' },
              },
              {
                _source: { id: 2, name: 'Game 2' },
              },
            ],
          },
        },
      };

      mockElasticsearchService.search.mockResolvedValue(searchResponse);

      const result = await controller.search(keyword);

      expect(result).toEqual({
        body: {
          hits: {
            hits: [
              { _source: { id: 1, name: 'Game 1' } },
              { _source: { id: 2, name: 'Game 2' } },
            ],
          },
        },
      });
      expect(mockElasticsearchService.search).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });
  });
});
