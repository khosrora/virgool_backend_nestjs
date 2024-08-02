import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guards/auth.guards';
import { RoleGuard } from 'src/modules/auth/guards/role.guards';

export function AuthDecorator() {
  return applyDecorators(
    ApiBearerAuth('Authorization'),
    UseGuards(AuthGuard, RoleGuard),
  );
}
