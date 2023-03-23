import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Courses, Lecture, Section } from '@unihub/api/courses';
import { Repository } from 'typeorm';
import { ShareDoc } from './entities/sharedoc.entity';
import { Op } from './entities/ops.entity';
import { Attribute } from './entities/attributes.entity';
// import { CoursesController } from '@unihub/api/courses';

@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(ShareDoc) private documentRepo: Repository<ShareDoc>,
    @InjectRepository(Op) private opsRepo: Repository<Op>,
    @InjectRepository(Attribute) private attributesRepo: Repository<Attribute>
  ) {}

  async getAllDocuments(lectureId: number): Promise<ShareDoc[]> {
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

    //Check if there are any documents in the database
    const document = await this.documentRepo.find({
      where: { lecture: { id: lectureId } },
    });

    if (document.length === 0) {
      //Create all the documents for every lecture

      //Make a new document for every week between the start date and the current date
      let counter = 1;
      for (let i = startDate; i <= currentDate; i.setDate(i.getDate() + 7)) {
        const newDoc = new ShareDoc();
        newDoc.lecture = { id: lectureId } as Lecture;
        newDoc.lectureNumber = 'lecture' + counter;
        await this.documentRepo.save(newDoc);
        counter++;
      }
    } //end if

    //If we should add another document we add it here
    const lastDoc = await this.documentRepo.findOne({
      where: { lecture: { id: lectureId } },
      order: { id: 'DESC' },
    });

    if (lastDoc) {
      //Get the lecture week
      const lastLecNumber = lastDoc.lectureNumber.substring(7);

      //Get the current week
      const currentWeek = Math.floor(
        (currentDate.getTime() - startDate.getTime()) /
          (1000 * 60 * 60 * 24 * 7)
      );

      const lecture = await this.documentRepo.manager
        .getRepository(Lecture)
        .findOne({ where: { id: lectureId } });

      //If the current week is greater than the last lecture week we add a new document and the current time is greater the start time and the day is at least the current day
      if (
        currentWeek > Number(lastLecNumber) &&
        currentDate.getDay() >= lecture.day &&
        currentDate >= lecture.startTime
      ) {
        const newDoc = new ShareDoc();
        newDoc.lecture = { id: lectureId } as Lecture;
        newDoc.lectureNumber = 'lecture' + (Number(lastLecNumber) + 1);
        await this.documentRepo.save(newDoc);
      }
    }

    //Return all the documents for the lecture
    return await this.documentRepo.find({
      where: { lecture: { id: lectureId } },
    });
  } //end getAllDocuments

  async getDocumentContent(documentId: number): Promise<Object[]> {
    //Get all the ops for this document
    const ops = await this.opsRepo.find({
      where: { document: { id: documentId } },
    });

    //Create the ops array
    const opsArray = [];
    for (let i = 0; i < ops.length; i++) {
      const op = {};
      if (ops[i].retain) {
        op['retain'] = ops[i].retain;
      }
      if (ops[i].insert) {
        op['insert'] = ops[i].insert;
      }
      const count = await this.attributesRepo.count();

      if (count === 0) {
        opsArray.push(op);
        continue;
      }

      const attribute = await this.attributesRepo.findOne({
        where: {
          op: { id: ops[i].id },
        },
      });

      if (attribute) {
        const attributeObject = {};
        for (const [key, value] of Object.entries(attribute)) {
          if (key !== 'id' && key !== 'op') {
            //if the value is null we don't add it
            if (value !== null) {
              attributeObject[key] = value;
            }
          }
        }
        op['attributes'] = attributeObject;
      }

      opsArray.push(op);
    }

    return opsArray;
  } //end getDocumentContent

  async postDocumentContent(documentId: number, ops: any): Promise<void> {
    //Check if there are already ops for this document
    const opsInDb = await this.opsRepo.find({
      where: { document: { id: documentId } },
    });

    //If there are ops we delete them and their attributes
    if (opsInDb.length > 0) {
      const count = await this.attributesRepo.count();
      if (count > 0) {
        const subquery = this.attributesRepo
          .createQueryBuilder('attribute')
          .leftJoin('attribute.op', 'op')
          .leftJoin('op.document', 'document')
          .select('attribute.id')
          .where('document.id = :documentId', { documentId });

        await this.attributesRepo
          .createQueryBuilder()
          .delete()
          .from(Attribute)
          .where(`id IN (${subquery.getQuery()})`)
          .setParameters(subquery.getParameters())
          .execute();
      }

      await this.opsRepo.delete({ document: { id: documentId } });
    }

    //Add the ops to the database
    for (let i = 0; i < ops.ops.length; i++) {
      const op = new Op();
      op.document = { id: documentId } as ShareDoc;
      if (ops.ops[i]['retain']) {
        op.retain = ops.ops[i]['retain'];
      }
      if (ops.ops[i]['insert']) {
        op.insert = ops.ops[i]['insert'];
      }

      await this.opsRepo.save(op);

      //Now set the attributes for this op
      if (ops.ops[i]['attributes']) {
        const attribute = new Attribute();
        attribute.op = { id: op.id } as Op;
        for (const [key, value] of Object.entries(ops.ops[i]['attributes'])) {
          attribute[key] = value;
        } //end for attribute
        await this.attributesRepo
          .createQueryBuilder()
          .insert()
          .into(Attribute)
          .values(attribute)
          .execute();
      } //end if attributes
    } //end for each attribute
  } //end postDocumentContent
} //end TimeTableService