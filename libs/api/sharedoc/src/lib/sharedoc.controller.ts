import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DocumentService } from './sharedoc.service';
import { Document } from './sharedoc.entity';

@Controller()
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  async getAllDocuments(): Promise<Document[]> {
    return await this.documentService.getAllDocuments();
  }

  @Get(':id')
  async getDocumentById(@Param('id') id: string): Promise<Document> {
    return await this.documentService.getDocumentById(id);
  }

  @Get(':courseId')
  async getAllDocumentsByCourseId(@Param('courseId') courseId: string): Promise<Document[]> {
    return await this.documentService.getAllDocumentsByCourseId(courseId);
  }

  @Post()
  async addNewDocument(@Body() body: any): Promise<Document> {
    return await this.documentService.addNewDocument(body.courseId, body.content, body.lecture_number);
  }

  @Post(':id')
  async updateDocument(@Param('id') id: string, @Body() body: any): Promise<Document> {
    return await this.documentService.updateDocument(id, body.content, body.lecture_number);
  }
  
}