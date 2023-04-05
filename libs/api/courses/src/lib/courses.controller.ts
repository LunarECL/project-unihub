import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../../auth/src/lib/current-user.decorator';
import { CoursesService } from './courses.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('courses')
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get('')
  async getAllCourses(): Promise<any> {
    return await this.coursesService.getAllCourses();
  } //end getAllCourses

  @Get('/user/lectures')
  async getUserCourses(@CurrentUser() { userId }): Promise<any> {
    return await this.coursesService.getUserLectures(userId);
  }

  @Post('/user/lecture')
  async addUserLecture(@CurrentUser() { userId }, @Body() body): Promise<any> {
    //Check the body
    if (!body.sectionId) {
      return { error: 'No sectionId provided', status: 400 };
    }
    return await this.coursesService.addToUserLecture(userId, body.sectionId);
  }

  @Delete('/user/section/:sectionId')
  async deleteUserLecture(
    @CurrentUser() { userId },
    @Param('sectionId') sectionId: string
  ): Promise<any> {
    if (!sectionId) {
      return { error: 'No sectionId provided', status: 400 };
    }
    return await this.coursesService.removeFromUserLecture(userId, sectionId);
  }
} //end CoursesController
