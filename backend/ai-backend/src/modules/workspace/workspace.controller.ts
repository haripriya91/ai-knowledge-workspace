import { Controller, Get, Param } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/get-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createWorkspace(@GetUser() user: JwtPayload, @Body() dto: { name: string }) {
    return this.workspaceService.create(user.userId, dto.name);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getMyWorkspaces(@GetUser() user: JwtPayload) {
    return this.workspaceService.getUserWorkspaces(user.userId);
  }

  @Post(':id/join')
  @UseGuards(JwtAuthGuard)
  joinWorkspace(@GetUser() user: JwtPayload, @Param('id') workspaceId: string) {
    return this.workspaceService.joinWorkspace(user.userId, workspaceId);
  }
}
