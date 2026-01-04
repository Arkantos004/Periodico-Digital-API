import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { RolEnum } from '../entities/rol.entity';

@ApiTags('Usuarios')
@ApiBearerAuth('JWT-auth')
@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles(RolEnum.ADMINISTRADOR)
  @ApiOperation({ summary: 'Obtener todos los usuarios (Solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios',
    schema: {
      example: [
        {
          id: 1,
          email: 'juan@ejemplo.com',
          nombre: 'Juan',
          apellido: 'Pérez',
          activo: true,
          rol: {
            id: 2,
            nombre: 'PERIODISTA',
          },
          createdAt: '2025-12-20T10:00:00.000Z',
          updatedAt: '2025-12-20T10:00:00.000Z',
        },
        {
          id: 2,
          email: 'maria@ejemplo.com',
          nombre: 'María',
          apellido: 'García',
          activo: true,
          rol: {
            id: 3,
            nombre: 'LECTOR',
          },
          createdAt: '2025-12-21T11:00:00.000Z',
          updatedAt: '2025-12-21T11:00:00.000Z',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Requiere rol ADMINISTRADOR' })
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles(RolEnum.ADMINISTRADOR)
  @ApiOperation({ summary: 'Obtener usuario por ID (Solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado',
    schema: {
      example: {
        id: 1,
        email: 'juan@ejemplo.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        activo: true,
        rol: {
          id: 2,
          nombre: 'PERIODISTA',
        },
        createdAt: '2025-12-20T10:00:00.000Z',
        updatedAt: '2025-12-20T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @Roles(RolEnum.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar usuario (Solo admin)' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado',
    schema: {
      example: {
        id: 1,
        email: 'juannuevo@ejemplo.com',
        nombre: 'Juan Carlos',
        apellido: 'Pérez López',
        activo: true,
        rol: {
          id: 2,
          nombre: 'PERIODISTA',
        },
        createdAt: '2025-12-20T10:00:00.000Z',
        updatedAt: '2025-12-25T13:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @Roles(RolEnum.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar usuario (Solo admin)' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado',
    schema: {
      example: {
        message: 'Usuario eliminado exitosamente',
        id: 1,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}
