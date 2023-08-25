import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}
}
