import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friends } from './entities.ts/friends.entity';
import { Connection, Repository } from 'typeorm';
import { User } from '@unihub/api/auth';
import { Location } from '@unihub/api/map';

interface FriendLocation {
  latitute: string;
  longitude: string;
  name: string;
  time: string;
}

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

    //Check if the friend is already added
    const friend = await this.friendRepository.findOne({
      where: { userId: currentUserId, friendId: newUserId.userId },
    });

    if (friend) {
      return { error: 'Friend already added' };
    }

    // check if user is trying to add themselves
    if (currentUserId === newUserId.userId) {
      return { error: 'Cannot add yourself as a friend' };
    }

    //Add the friend
    const newFriend = new Friends();
    newFriend.userId = currentUserId;
    newFriend.friendId = newUserId.userId;
    newFriend.isRequested = true;
    await this.friendRepository.save(newFriend);

    return newFriend;
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
      where: { userId: userId, isAccepted: true },
      select: ['friendId'],
    });

    //Get the friends of the user from the user table
    const userRepository = this.connection.getRepository(User);
    const friendsList = [];
    for (let i = 0; i < friends.length; i++) {
      friendsList[i] = await userRepository.findOne({
        where: { userId: friends[i].friendId },
      });
    }

    return friendsList;
  } //end getUserLocation

  async deleteFriend(currentUserId: string, friendId: string) {
    //Check if the user exists in the database
    this.friendRepository
      .findOne({ where: { userId: currentUserId } })
      .then((friend) => {
        if (!friend) {
          return { error: 'User does not exist' };
        }
      });

    //Check if the friend is a friend of the user
    const friend = await this.friendRepository.findOne({
      where: { userId: currentUserId, friendId: friendId },
    });

    if (!friend) {
      return { error: 'Friend is not a friend of the user' };
    }

    //Delete the friend, return the deleted friend
    const deletedFriend = await this.friendRepository.delete({
      userId: currentUserId,
      friendId: friendId,
    });

    // also delete the current user as a friend of the new user
    await this.friendRepository.delete({
      userId: friendId,
      friendId: currentUserId,
    });

    return deletedFriend;
  }

  async getFriendsLocation(userId: string): Promise<any> {
    //Get the friends of the user
    const friends = await this.friendRepository.find({
      where: { userId: userId, isAccepted: true },
    });

    // make array of friendLocation objects
    const friendsLocation: FriendLocation[] = [];
    // loop through friends

    const locationRepository = this.connection.getRepository(Location);
    for (let i = 0; i < friends.length; i++) {
      const friendLocation = await locationRepository.findOne({
        where: { userId: friends[i].friendId },
      });

      let lat, long, time;

      if (!friendLocation) {
        // lat or lon can never be exactly 360, will use this as a flag for either no location or not in range of University
        // 360 for out of range, -360 for no location
        lat = '-360';
        long = '-360';
        time = '-1';
      } else {
        // if the location is not in the range of the university, set the lat and long to 360
        if (
          parseFloat(friendLocation.latitude) < 43.78 ||
          parseFloat(friendLocation.latitude) > 43.7944 ||
          parseFloat(friendLocation.longitude) < -79.1951 ||
          parseFloat(friendLocation.longitude) > -79.1751
        ) {
          lat = '360';
          long = '360';
          time = '0';
        } else {
          lat = friendLocation.latitude;
          long = friendLocation.longitude;
          time = friendLocation.updated + '';
        }
      }

      const friendUserObject = await this.connection
        .getRepository(User)
        .findOne({
          where: { userId: friends[i].friendId },
        });

      // make new friendLocation object
      const newFriendLocationObject: FriendLocation = {
        latitute: lat,
        longitude: long,
        name: friendUserObject.email,
        time: time,
      };

      friendsLocation.push(newFriendLocationObject as FriendLocation);
    }

    return friendsLocation;
  }

  async getFriendRequests(userId: string): Promise<any> {
    //Search through the friendId's and if isRequested is true, return the user
    const friends = await this.friendRepository.find({
      where: { friendId: userId, isRequested: true },
    });

    //Get the friends of the user from the user table
    const userRepository = this.connection.getRepository(User);
    const friendsList = [];
    for (let i = 0; i < friends.length; i++) {
      friendsList[i] = await userRepository.findOne({
        where: { userId: friends[i].userId },
        select: ['email'],
      });
    }

    return friendsList;
  }

  async acceptFriendRequest(userId: string, friendEmail: string) {
    //Get the friendId from the email
    const userRepository = this.connection.getRepository(User);
    const friendId = await userRepository.findOne({
      where: { email: friendEmail },
    });

    //Check if the user exists in the database
    this.friendRepository
      .findOne({ where: { userId: userId } })
      .then((friend) => {
        if (!friend) {
          return { error: 'User does not exist' };
        }
      });

    //get the id of the friendship
    const friendship = await this.friendRepository.findOne({
      where: { userId: friendId.userId, friendId: userId },
    });

    //Update the friend, return the updated friend
    const updatedFriend = await this.friendRepository.update(friendship.id, {
      isAccepted: true,
      isRequested: false,
    });

    //Also create a friendship for the other user
    const newFriend = new Friends();
    newFriend.userId = userId;
    newFriend.friendId = friendId.userId;
    newFriend.isAccepted = true;
    newFriend.isRequested = false;
    await this.friendRepository.save(newFriend);

    return updatedFriend;
  }
}
