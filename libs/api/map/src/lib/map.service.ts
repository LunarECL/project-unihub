import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthModule } from '@unihub/api/auth';
// import dataSource from 'typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MapService {
  constructor(
    @InjectRepository(Location) private locationRepository: Repository<Location>
  ) {}

  async addLocation(newUserId: string, latitude: string, longitude: string) {
    this.locationRepository
      .findOne({ where: { userId: newUserId } })
      .then(async (location) => {
        if (location) {
          //update the location
          location.latitude = latitude;
          location.longitude = longitude;
          //Update the date
          location.updated = new Date();
          await this.locationRepository.save(location);
        } else {
          //create a new location
          const newLocation = new Location();
          newLocation.latitude = latitude;
          newLocation.longitude = longitude;
          newLocation.userId = newUserId;
          newLocation.updated = new Date();
          await this.locationRepository.save(newLocation);
        }
      });
  } //end add Location

  async getUserLocation(userId: string): Promise<any> {
    //Check if the user exists in the database
    this.locationRepository
      .findOne({ where: { userId: userId } })
      .then((location) => {
        if (!location) {
          return { error: 'User does not exist' };
        }
      });
    return await this.locationRepository.findOne({ where: { userId: userId } });
  } //end getUserLocation
}
