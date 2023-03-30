import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './entities.ts/friends.entity';
import { Connection, Repository } from 'typeorm';
import { User } from '@unihub/api/auth';
import { Location } from '@unihub/api/map';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friends) private friendRepository: Repository<Friends>,
    private connection: Connection
  ) {}

  async addFriend(currentUserId: string, newUserEmail: string) {
    const userRepository = this.connection.getRepository(User);
    //get the users id from the email
    const newUserId = await userRepository.findOne({
      where: { email: newUserEmail },
    });

    if (!newUserId) {
      return { error: 'User does not exist' };
    }

    //Check if the user is already a friend
    this.friendRepository
      .findOne({ where: { userId: currentUserId, friendId: newUserId.userId } })
      .then(async (friend) => {
        if (friend) {
          return { error: 'User is already a friend' };
        }
      });

    //Add the friend
    const newFriend = new Friends();
    newFriend.userId = currentUserId;
    newFriend.friendId = newUserId.userId;
    return await this.friendRepository.save(newFriend);
  } //end add Location

  async getFriends(userId: string): Promise<any> {
    //Check if the user exists in the database
    this.friendRepository
      .findOne({ where: { userId: userId } })
      .then((friend) => {
        if (!friend) {
          return { error: 'User does not exist' };
        }
      });
    const friends = await this.friendRepository.find({
      where: { userId: userId },
      select: ['friendId'],
    });

    //Get the friends of the user from the user table
    const userRepository = this.connection.getRepository(User);
    let friendsList = [];
    for (let i = 0; i < friends.length; i++) {
      friendsList[i] = await userRepository.findOne({
        where: { userId: friends[i].friendId },
      });
    }

    return friendsList;
  } //end getUserLocation

  async getFriendsLocation(userId: string): Promise<any> {
    //Get the friends of the user
    const friends = await this.friendRepository.find({
      where: { userId: userId },
    });

    let friendsLocation = [];
    //Get the location of the friends
    const locationRepository = this.connection.getRepository(Location);
    for (let i = 0; i < friends.length; i++) {
      friendsLocation[i] = await locationRepository.findOne({
        where: { userId: friends[i].friendId },
      });
    }

    return friendsLocation;
  }
}
