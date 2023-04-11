import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Book } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public getAll() {
    return this.prismaService.book.findMany();
  }

  public async getById(id: Book['id']): Promise<Book> {
    const book = await this.prismaService.book.findUnique({
      where: { id },
    });
    if(!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  public async create(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    try {
      return await this.prismaService.book.create({
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      })
    }
    catch (error) {
      if(error.code === 'P2025') {
        throw new BadRequestException("Book doesn't exist");
      }
      throw error;
    }
  }

  public async updateById(id: Book['id'], bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    const book = await this.prismaService.book.findUnique({
      where: { id },
    });
    if(!book) {
      throw new NotFoundException('Book not found');
    }
    return await this.prismaService.book.update({
      where: { id }, 
      data: {
        ...otherData,
        author: {
          connect: { id: authorId }
        }
      }
    });
  }
}