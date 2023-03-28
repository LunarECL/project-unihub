import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { User } from '@unihub/api/auth';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Attribute, ShareDoc } from '@unihub/api/sharedoc';
import { Repository, Connection, In } from 'typeorm';
import { Courses } from './entities/courses.entity';
import { Lecture } from './entities/lecture.entity';
import { Section } from './entities/section.entity';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
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

    //Get the section
    const section = await this.sectionRepository.findOne({
      where: { id: numSecId },
      relations: ['users'],
    });

    const userRepository = this.connection.getRepository(User);

    //Get the user
    const user = await userRepository.findOne({
      where: { userId: userId },
    });

    //If the user is already in the section, return
    if (section.users.some((u) => u.userId === user.userId)) {
      return;
    }

    section.users.push(user);

    //Save the section
    await this.sectionRepository.save(section);
  } //end addToUserLecture

  async removeFromUserLecture(
    userId: string,
    sectionId: string
  ): Promise<void> {
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

    for (const lecture of lectures) {
      const documents = await documentRepository.find({
        where: {
          lecture: {
            id: lecture.id,
          },
          users: {
            userId: user.userId,
          },
        },
        select: ['id', 'users'],
        relations: ['users'],
      });

      const documentsToRemove: ShareDoc[] = [];

      if (documents.length > 0) {
        //Find the ops with the document id
        const ops = await this.connection.getRepository(Op);

        for (const document of documents) {
          if (document.users.length > 0) {
            document.users = document.users.filter(
              (u) => u.userId !== user.userId
            );
            await documentRepository.save(document);
          } else {
            const opsToDelete = await ops.find({
              where: {
                document: {
                  id: document.id,
                },
              },
            });

            if (opsToDelete.length > 0) {
              for (const op of opsToDelete) {
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
            documentsToRemove.push(document);
          }
        }

        await documentRepository.remove(documentsToRemove);
      }
    }
    //Save the section

    await this.sectionRepository.save(section);
  } //end removeFromUserLecture
} //end TimeTableService
