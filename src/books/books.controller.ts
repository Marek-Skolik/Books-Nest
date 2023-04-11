import { Controller, Get, Post, ParseUUIDPipe, Param, Body, Put, UseGuards } from '@nestjs/common';
import { CreateBookDTO } from './create-book.dto';
import { BooksService } from './books.service';
import { UpdateBookDTO } from './update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/')
  getAll() {
    return this.booksService.getAll();
  }

  @Get('/:id')
  getById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.booksService.getById(id);
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }

  @Put('/:id') 
  @UseGuards(JwtAuthGuard)
  update(@Param('id', new ParseUUIDPipe()) id: string, @Body() bookData: UpdateBookDTO) {
    return this.booksService.updateById(id, bookData);
  }
}
