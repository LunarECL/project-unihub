import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShareDoc } from './entities/sharedoc.entity';
import { DocumentService } from './sharedoc.service';
import { CurrentUser } from '../../../auth/src/lib/current-user.decorator';

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
    @Query('lectureId') lectureId: string,
    @CurrentUser() { userId },
  ): Promise<ShareDoc[]> {
    if (!lectureId) {
      throw new Error('Invalid parameters');
    }
    return await this.shareDocService.getAllDocuments(Number(lectureId), userId);
  } //end getAllDocuments

  @Post('document/content/')
  @UseGuards(AuthGuard('jwt'))
  async postDocumentContent(
    @Body() body: { documentId: string; ops: Object[] }
  ): Promise<void> {
    if (!body.documentId || !body.ops) {
      throw new Error('Invalid parameters');
    }
    return await this.shareDocService.postDocumentContent(
      Number(body.documentId),
      body.ops
    );
  }

  @Post('document/user/create')
  @UseGuards(AuthGuard('jwt'))
  async createDocument(
    @Body() body: { lectureId: string; documentName: string },
    @CurrentUser() { userId },
  ): Promise<void> {
    if (!body.lectureId || !body.documentName) {
      throw new Error('Invalid parameters');
    }
    return await this.shareDocService.createUserDocument(
      Number(body.lectureId),
      body.documentName,
      userId
    );
  }
}
