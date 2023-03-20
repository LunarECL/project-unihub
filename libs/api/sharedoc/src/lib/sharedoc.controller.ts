import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShareDoc } from './sharedoc.entity';
import { DocumentService } from './sharedoc.service';

@Controller('sharedoc')
export class AppController {
  constructor(private shareDocService: DocumentService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('documents')
  @UseGuards(AuthGuard('jwt'))
  async getAllDocuments(
    @Query('lectureId') lectureId: string
  ): Promise<ShareDoc[]> {
    console.log('Getting all documents\n');
    //Check that the parameters are valid
    if (!lectureId) {
      throw new Error('Invalid parameters');
    }
    return await this.shareDocService.getAllDocuments(Number(lectureId));
  }
}
