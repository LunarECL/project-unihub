import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
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

    //Search for courses based on the specifications
    async searchCourses(searchBarContent: string, searchSpecifications: string){
        if(searchSpecifications == "courseName"){
            return await this.timetableRepository.find({
                where: { course_name: Like(`${searchBarContent}%`) }
            });
        }//end if
        else if(searchSpecifications == "courseCode"){
            return await this.timetableRepository.find({
                where: { course_code: Like(`${searchBarContent}%`) }
            });
        }//end else if
        else{
            //Return that the specifications are not valid
            return "Invalid specifications";
        }//end else
    }//end searchCourses
    
}//end TimeTableService