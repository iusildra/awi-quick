import { Test, TestingModule } from '@nestjs/testing';
import { ZoneService } from './zone.service';
import { ZoneModule } from './zone.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { GameZone, Zone } from '../entities';

describe('ZoneService', () => {
  let service: ZoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ZoneModule, SequelizeModule.forFeature([Zone, GameZone])],
      providers: [ZoneService],
    }).compile();

    service = module.get<ZoneService>(ZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a zone', async () => {
    const zone = await service.create({
      name: 'Test Zone',
    });
    expect(zone).toBeDefined();
    expect(zone.name).toEqual('Test Zone');
  });
});
