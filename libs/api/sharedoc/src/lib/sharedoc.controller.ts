import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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
    if (!lectureId) {
      throw new Error('Invalid parameters');
    }
    return await this.shareDocService.getAllDocuments(Number(lectureId));
  }//end getAllDocuments

  @Get('document/content')
  @UseGuards(AuthGuard('jwt'))
  async getDocumentContent(
    @Query('documentId') documentId: string
  ): Promise<string> {
    if (!documentId) {
      throw new Error('Invalid parameters');
    }
    return await this.shareDocService.getDocumentContent(Number(documentId));
  }//end getDocumentContent

  @Post('document/content/')
  @UseGuards(AuthGuard('jwt'))
  async postDocumentContent(
    @Query('documentId') documentId: string,
    @Query('content') content: string
  ): Promise<void> {
    if (!documentId || !content) {
      throw new Error('Invalid parameters');
    }
    return await this.shareDocService.postDocumentContent(
      Number(documentId),
      content
    );
  }//end postDocumentContent
}
