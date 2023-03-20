import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses, Lecture, Section } from '@unihub/api/courses';
import { Repository } from 'typeorm';
import { ShareDoc } from './sharedoc.entity';
// import { CoursesController } from '@unihub/api/courses';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(ShareDoc) private documentRepo: Repository<ShareDoc>
  ) {}

  async getAllDocuments(lectureId: number): Promise<ShareDoc[]> {
    //Check if there are any documents in the database
    const document = await this.documentRepo.find({
      where: { lecture: { id: lectureId } },
    });
    if (document.length === 0) {
      //Create all the documents for every lecture

      //Get the sec_cd
      const section = await this.documentRepo.manager
        .getRepository(Section)
        .findOne({ where: { lectures: { id: lectureId } } });
      const course = await this.documentRepo.manager
        .getRepository(Courses)
        .findOne({ where: { sections: { id: section.id } } });

      const sec_cd = course.sec_cd;

      //Could be issues here with summer bc they use a different system
      //Summer:
      // Y - May to August
      // F - May to June
      // S - June to August\
      //Winter/Fall:
      // F - September to December
      // Y - September to April
      // S - January to April

      const startDateF = new Date(2022, 8, 6);
      const endDateF = new Date(2022, 11, 5);

      const startDateY = new Date(2022, 8, 6);
      const endDateY = new Date(2023, 3, 11);

      const startDateS = new Date(2023, 0, 9);
      const endDateS = new Date(2023, 3, 11);

      let currentDate = new Date();
      let startDate = new Date();

      //Make a new document for every week between the start date and the current date
      if (sec_cd === 'F') {
        startDate = startDateF;
        if (currentDate < startDateF) {
          return;
        } else if (currentDate > endDateF) {
          currentDate = endDateF;
        }
      } else if (sec_cd === 'Y') {
        startDate = startDateY;
        if (currentDate < startDateY) {
          return;
        } else if (currentDate > endDateY) {
          currentDate = endDateY;
        }
      } else if (sec_cd === 'S') {
        startDate = startDateS;
        if (currentDate < startDateS) {
          return;
        } else if (currentDate > endDateS) {
          currentDate = endDateS;
        }
      } else {
        return;
      }

      let counter = 1;
      for (let i = startDate; i <= currentDate; i.setDate(i.getDate() + 7)) {
        const newDoc = new ShareDoc();
        newDoc.lecture = { id: lectureId } as Lecture;
        newDoc.lectureNumber = 'lecture' + counter;
        newDoc.content = '';
        await this.documentRepo.save(newDoc);
        counter++;
      }
    } //end if

    //Return all the documents for the lecture
    return await this.documentRepo.find({
      where: { lecture: { id: lectureId } },
    });
  }
} //end TimeTableService
