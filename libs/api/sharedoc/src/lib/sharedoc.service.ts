import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Document } from "./sharedoc.entity";
//THIS PROB HAS TO BE DONE DIFFERENTLY
import { Courses } from '../../../courses/src/lib/courses.entity';

@Injectable()
export class DocumentService {
    constructor(@InjectRepository(Document) private timetableRepository: Repository<Document>, @InjectRepository(Courses) private coursesRepository: Repository<Courses>) {}

    async addNewDocument(courseId:string, content: string, lecture_number: number): Promise<Document> {
        const document = new Document();
        //DOES THIS GENERATE A NEW ID?
        document.content = content;
        document.lecture_number = lecture_number;

        const course = await this.coursesRepository.findOne({where: {id: courseId}});
        document.course = course;
        return await this.timetableRepository.save(document);
    }//end addNewDocument

    async getDocumentById(documentId: string): Promise<Document> {
        return await this.timetableRepository.findOne({where: {id: documentId}});
    }//end getDocumentById

    async getAllDocuments(): Promise<Document[]> {
        return await this.timetableRepository.find();
    }//end getAllDocuments

    async getAllDocumentsByCourseId(courseId: string): Promise<Document[]> {
        return await this.timetableRepository.find({ where: { course: { id: courseId } } });
    }//end getAllDocumentsByCourseId
    
    async updateDocument(documentId: string, content: string, lecture_number: number): Promise<Document> {
        const document = await this.getDocumentById(documentId);
        document.content = content;
        document.lecture_number = lecture_number;
        return await this.timetableRepository.save(document);
    }//end updateDocument

    //CAN ADD MORE OR REMOVE WHAT'S NOT NEEDED ONCE WE KNOW WHAT WE NEED
}//end TimeTableService