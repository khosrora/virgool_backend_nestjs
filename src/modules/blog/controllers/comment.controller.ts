import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/common/decorator/Pagination.decorator';
import { skipAuth } from 'src/common/decorator/Skip-auth.decorator';
import { AuthDecorator } from 'src/common/decorator/auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { CreateCommentDto } from '../dto/comment.dto';
import { CommentService } from '../services/comment.service';

@Controller('blog/comment')
@ApiTags('blogs/comments')
@AuthDecorator()
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  @ApiConsumes(swaggerConsumes.urlEncoded, swaggerConsumes.Json)
  createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.commentService.createComment(createCommentDto);
  }

  @Get('/list')
  @Pagination()
  @skipAuth()
  listComments(@Query() paginationDto: PaginationDto) {
    return this.commentService.getAll(paginationDto);
  }

  @Put('/accept/:id')
  acceptComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.accept(id);
  }

  @Put('/reject/:id')
  rejectComment(@Param('id', ParseIntPipe) id: number) {
    return this.commentService.reject(id);
  }
}
