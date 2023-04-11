import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma.service';
import { Author } from '@prisma/client';

@Injectable()
export class AuthorsService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Author[]> {
    return this.prismaService.author.findMany();
  }

  public async getById(id: Author['id']): Promise<Author | null> {
    const author = await this.prismaService.author.findUnique({
      where: { id },
    });

    if(!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  public async create(authorData: Omit<Author, 'id'>): Promise<Author> {
    try {
      return await this.prismaService.author.create({
        data: authorData,
      });
    }
    catch (error) {
      if(error.code === 'P2002') {
        throw new ConflictException('Name is already taken')
      }
      throw error
    }
  }

  public async updateById(id: Author['id'], authorData: Omit<Author, 'id'>): Promise<Author> {
    try {
      const author = await this.prismaService.author.findUnique({
        where: { id }, 
      })
      if(!author) {
        throw new NotFoundException('Author not found');
      }
      return await this.prismaService.author.update({
        where: { id }, 
        data: authorData,
      });
    }
    catch (error) {
      if(error.code === 'P2002') {
        throw new ConflictException('Author not found');
      }
      throw error;
    }
  }

  public async deleteById(id: Author['id']): Promise<Author> {
    const author = await this.prismaService.author.findUnique({
      where: { id },
    });
    if(!author) {
      throw new ConflictException('Author not found');
    }
    return this.prismaService.author.delete({
      where: { id },
    });
  }
}
