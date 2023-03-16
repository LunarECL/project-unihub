import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Courses } from "./courses.entity";

@Injectable()
export class CoursesService {
    constructor(@InjectRepository(Courses) private timetableRepository: Repository<Courses>) {}

    async getAllCourses(): Promise<Courses[]> {
        return await this.timetableRepository.find();
    }//end getAllCourses

    async getCourseById(id: string): Promise<Courses> {
        return await this.timetableRepository.findOne({
            where: {
                id: id
            }
        });
    }//end getCourseById

    // async addNewDocumentToCourse(id: string, documentId: string): Promise<Courses> {
    //     const course = await this.getCourseById(id);
    //     course.course_shareDB_docs.push(documentId);
    //     return await this.timetableRepository.save(course);
    // }//end addNewDocumentToCourse

    // async getAllDocuments(id: string): Promise<Courses> {
    //     return await this.timetableRepository.findOne({
    //         where: {
    //             id: id
    //         },
    //         select: ["course_shareDB_docs"]
    //     });
    // }//end getAllDocuments

    
}//end TimeTableService