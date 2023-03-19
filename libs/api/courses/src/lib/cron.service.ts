import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Courses } from './entities/courses.entity';
import { Lecture } from './entities/lecture.entity';
import { Section } from './entities/section.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CronService implements OnModuleInit {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Courses)
    private readonly coursesRepository: Repository<Courses>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>
  ) {}

  async onModuleInit() {
    await this.runScheduledTask(); // Run the task when the server starts up
  }

  @Cron('0 0 * * * *') // run at midnight every day
  async runScheduledTask() {
    // Add your function to be run here
    console.log('scheduleCourse:  Crawling start');
    await this.task();
  }

  async task() {
    const url = process.env.COURSE_SCHEDULE_URL as string;
    const body2 = 'coursecode=&instructor=&courseTitle=';
    let body: string = '';
    for (let i = 1; i < 56; i++) {
      body += `departments%5B%5D=${i}&`;
    }
    body += body2;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });
    const rawData = await response.json();
    const data = rawData[0];

    console.log('scheduleCourse:  Crawling end');

    console.log('scheduleCourse:  Data start');

    for (let key in data) {
      // Course part
      const course = data[key];
      const programCode = course.course_cd.substring(0, 3);
      const courseLevel = course.course_cd.substring(3, 4);
      const courseNumber = course.course_cd.substring(4, 6);
      const title = course.title;
      const sec_cd = course.sec_cd;
      const session = course.session;

      const courseData = {
        programCode,
        courseLevel,
        courseNumber,
        title,
        sec_cd,
        session,
      };
      const courses = this.coursesRepository.create(courseData);
      await this.coursesRepository
        .createQueryBuilder()
        .insert()
        .into(Courses)
        .values(courses)
        .orUpdate([
          'programCode',
          'courseLevel',
          'courseNumber',
          'title',
          'sec_cd',
          'session',
        ])
        .execute();

      const sections = new Array();

      for (let i in course.sections) {
        const rawSection = course.sections[i];
        const sectionData = {
          sectionType: rawSection.method,
          sectionNumber: rawSection.sec_num,
          currentEnrollment: rawSection.curr_tot,
          maxEnrollment: rawSection.max,
          instructor: rawSection.instructor,
          delivery_mode: rawSection.delivery_mode,
          course: courses,
        };

        var check: boolean = false;
        for (let j in sections) {
          if (
            sections[j].sectionNumber === sectionData.sectionNumber &&
            sections[j].sectionType === sectionData.sectionType
          ) {
            check = true;
            break;
          }
        }
        if (check) continue;

        const section = this.sectionRepository.create(sectionData);
        await this.sectionRepository
          .createQueryBuilder()
          .insert()
          .into(Section)
          .values(section)
          .orUpdate([
            'sectionType',
            'sectionNumber',
            'currentEnrollment',
            'maxEnrollment',
            'instructor',
            'delivery_mode',
          ])
          .execute();

        for (let j = 1; j < 6; j++) {
          const rawDay = rawSection[`day${j}`];
          if (rawDay === '') {
            break;
          }

          let day = 4;
          if (rawDay === 'MO') {
            day = 0;
          } else if (rawDay === 'TU') {
            day = 1;
          } else if (rawDay === 'WE') {
            day = 2;
          } else if (rawDay === 'TH') {
            day = 3;
          }

          const [hour, minute] = rawSection[`start${j}`].split(':');
          const startTime = new Date();
          startTime.setHours(parseInt(hour));
          startTime.setMinutes(parseInt(minute));

          const [hour2, minute2] = rawSection[`end${j}`].split(':');
          const endTime = new Date();
          endTime.setHours(parseInt(hour2));
          endTime.setMinutes(parseInt(minute2));

          const diff = endTime.getTime() - startTime.getTime();
          const totalMinutes = Math.round(diff / 1000 / 60);

          const building = rawSection[`rm${j}`].substring(0, 2) as string;
          const rawRoom = rawSection[`rm${j}`].substring(2).split(' ');
          const room = rawRoom[rawRoom.length - 1] as string;

          const lectureData = {
            day,
            startTime,
            totalMinutes,
            building,
            room,
            section,
          };
          const lecture = this.lectureRepository.create(lectureData);
          await this.lectureRepository
            .createQueryBuilder()
            .insert()
            .into(Lecture)
            .values(lecture)
            .orUpdate(['day', 'startTime', 'totalMinutes', 'building', 'room'])
            .execute();
        }
        sections.push(section);
      }
    }

    console.log('scheduleCourse:  Data end');

    console.log('scheduleCourse:  Filter start');

    await this.updateCourse();

    console.log('scheduleCourse:  Filter end');
  }

  async updateCourse() {
    const courses = await this.coursesRepository
      .createQueryBuilder('course')
      .leftJoin('course.sections', 'section')
      .leftJoin('section.lectures', 'lecture')
      .getMany();

    const today = new Date();
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      const updated = course.updated;
      if (
        updated.getFullYear() !== today.getFullYear() ||
        updated.getMonth() !== today.getMonth() ||
        updated.getDate() !== today.getDate()
      ) {
        await this.dataSource.transaction(
          async (transactionalEntityManager) => {
            await transactionalEntityManager.remove(
              Lecture,
              course.sections.map((section) => section.lectures).flat()
            );
            await transactionalEntityManager.remove(Section, course.sections);
            await transactionalEntityManager.remove(Courses, course);
          }
        );
      }
    }

    return courses;
  }
}
