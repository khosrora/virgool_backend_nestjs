import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { isDate } from 'class-validator';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { PublicMessage } from '../auth/enums/message.enum';
import { ProfileDto } from './dto/profile.dto';
import { ProfileEntity } from './entities/profile.entities';
import { UserEntity } from './entities/user.entities';
import { Gender } from './enum/gender.enum';
import { ProfileImages } from './types/files';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepositry: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private profileRepositry: Repository<ProfileEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async changeProfile(profileDto: ProfileDto, files: ProfileImages) {
    if (files?.image_profile?.length > 0) {
      let [image] = files.image_profile;
      profileDto.image_profile = image.path.slice(7);
    }
    if (files?.bg_profile?.length > 0) {
      let [image] = files?.bg_profile;
      profileDto.bg_profile = image.path.slice(7);
    }

    const { id: userId, profileId } = this.request.user;
    let profile = await this.profileRepositry.findOneBy({ id: userId });
    const {
      bio,
      birthday,
      gender,
      linkdin_profile,
      nick_name,
      image_profile,
      bg_profile,
    } = profileDto;
    if (profile) {
      if (bio) profile.bio = bio;
      if (birthday && isDate(new Date(birthday))) profile.birthday = birthday;
      if (gender && Object.values(Gender).includes(gender))
        profile.gender = gender;
      if (linkdin_profile) profile.linkdin_profile = linkdin_profile;
      if (nick_name) profile.nick_name = nick_name;
      if (image_profile) profile.image_profile = image_profile;
      if (bg_profile) profile.bg_profile = bg_profile;
    } else {
      profile = this.profileRepositry.create({
        bio,
        birthday,
        gender,
        linkdin_profile,
        nick_name,
        userId,
      });
    }
    await this.profileRepositry.save(profile);
    if (!profileId) {
      await this.userRepositry.update(
        { id: userId },
        { profileId: profile.id },
      );
    }
    return {
      message: PublicMessage.updated,
    };
  }

  async profile() {
    const { id } = this.request.user;
    return this.userRepositry.findOne({
      where: { id },
      relations: ['profile'],
    });
  }
}
