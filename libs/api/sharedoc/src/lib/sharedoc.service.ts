import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Document } from "./sharedoc.entity";
import { CoursesController } from '@unihub/api/courses';

@Injectable()
export class DocumentService {
    constructor(@InjectRepository(Document) private timetableRepository: Repository<Document>, private courseController: CoursesController) {}

    async addNewDocument(courseId:string, content: string, lecture_number: number): Promise<Document> {
        const document = new Document();
        //DOES THIS GENERATE A NEW ID?
        document.content = content;
        document.lecture_number = lecture_number;

        //Use coursescontroller to get the course
        this.courseController.getCourseById(courseId).then((course) => {
            document.course = course;
        });
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