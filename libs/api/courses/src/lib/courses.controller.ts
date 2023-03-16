import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { CoursesService } from "./courses.service";
import { Courses } from "./courses.entity";

@Controller("courses")
export class CoursesController {
    constructor(private coursesService: CoursesService) {}

    @Get()
    async getAllCourses(): Promise<Courses[]> {
        return await this.coursesService.getAllCourses();
    }//end getAllCourses

    @Get(":id")
    async getCourseById(@Param("id") id: string): Promise<Courses> {
        return await this.coursesService.getCourseById(id);
    }//end getCourseById

}//end CoursesController