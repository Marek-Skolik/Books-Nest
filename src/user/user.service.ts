import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Password } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public getAll() {
    return this.prismaService.user.findMany();
  }

  public async getById(id: User['id']): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if(!user) {
      throw new NotFoundException('User not found')
    }
    return user;
  }

  public async getByEmail(email: User['email']): Promise<(User & { password: Password }) | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      include: { password: true },
    });

    if(!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  public async create(password: string, userData: Omit<User, 'id' | 'role'>): Promise<User> {
    try {
        return await this.prismaService.user.create({
          data: {
            ...userData,
            password: {
              create: {
                hashedPassword: password,
              },
            },
          },
        });
    }
    catch(error) {
      if(error.code === 'P2002') {
        throw new ConflictException('User email already exist');
      }
      throw error; 
    }
  }

  public async update(userId: User['id'], userData: Omit<User, 'id' | 'role'>, password: string | undefined): Promise<User> {
    try {
      if(password === 'undefined') {
        return await this.prismaService.user.update({
          where: { id: userId },
          data: userData,
        });
      }
      else {
        return await this.prismaService.user.update({
          where: { id: userId },
          data: {
            ...userData,
            password: {
              update: {
                hashedPassword: password,
              },
            },
          },
        });
      }
    }
    catch(error) { 
      if(error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  public async deleteById(id: User['id']): Promise<User> {
    const user = this.prismaService.user.findUnique({
      where: { id },
    });
    if(!user) {
      throw new NotFoundException('User not found');
    }
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
