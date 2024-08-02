import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guards';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/comment.dto';
import { swaggerConsumes } from 'src/common/enums/swagger-consume.enum';
import { Pagination } from 'src/common/decorator/Pagination.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { skipAuth } from 'src/common/decorator/Skip-auth.decorator';

@Controller('blog/comment')
@ApiTags('blogs/comments')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
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
