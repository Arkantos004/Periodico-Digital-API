import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LiveStream } from '../entities/live-stream.entity';
import { CreateLiveStreamDto } from './dto/create-live-stream.dto';
import { UpdateLiveStreamDto } from './dto/update-live-stream.dto';

@Injectable()
export class LiveStreamService {
  constructor(
    @InjectRepository(LiveStream)
    private repo: Repository<LiveStream>,
  ) {}

  async create(dto: CreateLiveStreamDto): Promise<LiveStream> {
    return this.repo.save(this.repo.create(dto));
  }

  async findActive(): Promise<LiveStream | null> {
    return this.repo.findOne({ where: { activo: true } });
  }

  async findOne(id: number): Promise<LiveStream> {
    const stream = await this.repo.findOne({ where: { id } });
    if (!stream) {
      throw new NotFoundException(`Transmisión ${id} no encontrada`);
    }
    return stream;
  }

  async findAll(): Promise<LiveStream[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: number, dto: UpdateLiveStreamDto): Promise<LiveStream> {
    const stream = await this.findOne(id);
    Object.assign(stream, dto);
    return this.repo.save(stream);
  }

  async remove(id: number): Promise<void> {
    const stream = await this.findOne(id);
    await this.repo.remove(stream);
  }
}

