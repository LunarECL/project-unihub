import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../auth/src/lib/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { MapService } from './map.service';

@UseGuards(AuthGuard('jwt'))
@Controller('map')
export class MapController {
  constructor(private mapService: MapService) {}

  @Get('/user/location')
  async getUserLocation(@CurrentUser() { userId }): Promise<any> {
    return await this.mapService.getUserLocation(userId);
  }

  @Post('/user/location')
  async addUserLocation(@CurrentUser() { userId }, @Body() body): Promise<any> {
    //Check the body
    if (!body.latitude || !body.longitude) {
      return { error: 'Missing latitude or longitude' };
    }
    return await this.mapService.addLocation(
      userId,
      body.latitude,
      body.longitude
    );
  }
} //end CoursesController
