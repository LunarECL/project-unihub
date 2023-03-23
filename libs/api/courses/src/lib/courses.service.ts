import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthModule } from '@unihub/api/auth';
import { User } from '@unihub/api/auth';
import { Attribute, ShareDoc } from '@unihub/api/sharedoc';
import { Repository, Connection, In } from 'typeorm';
import { Courses } from './entities/courses.entity';
import { Lecture } from './entities/lecture.entity';
import { Section } from './entities/section.entity';
import { Op } from '@unihub/api/sharedoc';
import { FindOperator } from 'typeorm';
// import dataSource from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Courses) private timetableRepository: Repository<Courses>,
    @InjectRepository(Lecture) private lectureRepository: Repository<Lecture>,
    @InjectRepository(Section) private sectionRepository: Repository<Section>,
    private connection: Connection
  ) {}

  //Get all the courses and their sections
  async getAllCourses(): Promise<Section[]> {
    return await this.sectionRepository.find({
      select: [
        'id',
        'sectionType',
        'sectionNumber',
        'instructor',
        'delivery_mode',
        'course',
        'lectures',
      ],
      relations: ['course', 'lectures'],
    });
  } //end getAllCourses

  //Get all the users courses
  async getUserLectures(userId: string): Promise<any[]> {
    //Want to return the course code, lecture start time and total minutes

    const sections = await this.sectionRepository.find({
      where: { users: { userId: userId } },
      select: [
        'id',
        'sectionType',
        'sectionNumber',
        'instructor',
        'delivery_mode',
        'course',
        'lectures',
      ],
      relations: ['course', 'lectures'],
    });

    return sections;
  } //end getUserLectures

  async addToUserLecture(userId: string, sectionId: string): Promise<void> {
    const numSecId = Number(sectionId);
    console.log(numSecId);

    //Get the section
    const section = await this.sectionRepository.findOne({
      where: { id: numSecId },
    });

    const userRepository = this.connection.getRepository(User);

    //Get the user
    const user = await userRepository.findOne({
      where: { userId: userId },
    });

    //Add the user to the section
    let newUsers = section.users || [];

    //If the user is already in the section, return
    if (newUsers.some((u) => u.userId === user.userId)) {
      return;
    }

    newUsers.push(user);

    section.users = newUsers;

    //Save the section
    await this.sectionRepository.save(section);
  } //end addToUserLecture

  async removeFromUserLecture(
    userId: string,
    sectionId: string
  ): Promise<void> {
    console.log('sectionId', sectionId);
    const numSecId = Number(sectionId);
    //Get the lecture
    const section = await this.sectionRepository.findOne({
      where: { id: numSecId },
      relations: ['users'],
    });

    const userRepository = this.connection.getRepository(User);

    //Get the user
    const user = await userRepository.findOne({
      where: { userId: userId },
    });

    //Remove the user from the section
    section.users = section.users.filter((u) => u.userId !== user.userId);

    const documentRepository = this.connection.getRepository(ShareDoc);

    //Get the lectures in the section
    const lectures = await this.lectureRepository.find({
      where: { section: { id: section.id } },
      relations: ['section'],
    });

    for (let lecture of lectures) {
      const documents = await documentRepository.find({
        where: {
          lecture: {
            id: lecture.id,
          },
          users: {
            userId: user.userId,
          },
        },
        relations: ['users'],
      });

      if (documents.length > 0) {
        //Find the ops with the document id
        const ops = await this.connection.getRepository(Op);

        for (let document of documents) {
          const opsToDelete = await ops.find({
            where: {
              document: {
                id: document.id,
              },
            },
          });

          if (opsToDelete.length > 0) {
            for (let op of opsToDelete) {
              const attributes = this.connection.getRepository(Attribute);

              const attributesToDelete = await attributes.find({
                where: {
                  op: {
                    id: op.id,
                  },
                },
              });

              await attributes.remove(attributesToDelete);
            }

            await ops.remove(opsToDelete);
          }
        }

        await documentRepository.remove(documents);
      }
    }
    //Save the section
    
    await this.sectionRepository.save(section);
  } //end removeFromUserLecture
} //end TimeTableService
