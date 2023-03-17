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

    //Add to user courses (either done here or in some user service)

    
}//end TimeTableService