import { ZoneService } from './zone.service';
import {
  Game,
  Timeslot,
  VolunteerAssignment,
  Volunteer,
  Zone,
  GameZone,
} from '../entities';
import { createMemDB } from '../utils/createMemDb';
import { Sequelize } from 'sequelize';
import { GameType } from '../game/dto/create-game.dto';
import { GameService } from '../game/game.service';

const dummyZone = {
  name: 'test',
} as Zone;

describe('VolunteerService', () => {
  let service: ZoneService;
  let gameService: GameService;
  let memDb: Sequelize;

  beforeAll(async () => {
    memDb = await createMemDB([
      Timeslot,
      VolunteerAssignment,
      Volunteer,
      Zone,
      GameZone,
      Game,
    ]);

    service = new ZoneService(Zone, GameZone);
    gameService = new GameService(Game, Zone);
  });

  afterEach(async () => {
    await memDb.truncate({ truncate: true, cascade: true });
  });

  afterAll(async () => {
    memDb.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all zones', async () => {
    await service.create(dummyZone);
    expect(await service.findAll()).toHaveLength(1);
  });

  it('should find a zone by id', async () => {
    const zone = await service.create(dummyZone);
    expect(service.findOne(zone.id)).toBeDefined();
  });

  it('should create a zone', async () => {
    expect(
      service.create({
        name: 'test',
      }),
    ).toBeDefined();
  });

  // it('should add a space to a zone', async () => {
  //   const zone = await service.create(dummyZone);
  //   const newSpace = await service.append(zone.id, dummyZone);
  //   expect(newSpace.name).toBe(dummyZone.name);
  //   expect(newSpace.num).toBe(zone.num + 1);
  // });

  it('should update a zone', async () => {
    const zone = await service.create(dummyZone);
    const updatedZone = await service.update(zone.id, {
      name: 'updated',
    });
    expect(updatedZone).toHaveLength(1);
  });

  it('should delete a zone', async () => {
    const zone = await service.create(dummyZone);
    const deletedZone = await service.remove(zone.id);
    expect(deletedZone).toBe(1);
  });

  describe('Game Assignments', () => {
    it('should assign multiple games to a zone', async () => {
      const zone = await service.create(dummyZone);
      const game = await gameService.create({
        name: 'test',
        type: GameType.CHILD,
      });
      const assignments = await service.assignGames(zone.id, [game.id]);
      expect(assignments).toBe(1);
    });
    it('should assign only non-duplicate games to a zone', async () => {
      const zone = await service.create(dummyZone);
      const game = await gameService.create({
        name: 'test',
        type: GameType.CHILD,
      });
      const game2 = await gameService.create({
        name: 'test2',
        type: GameType.CHILD,
      });
      const assignments = await service.assignGames(zone.id, [
        game.id,
        game2.id,
      ]);
      expect(assignments).toBe(2);
      const assignments2 = await service.assignGames(zone.id, [
        game.id,
        game2.id,
      ]);
      expect(assignments2).toBe(0);
    });
    it('should remove multiple games from a zone', async () => {
      const zone = await service.create(dummyZone);
      const game = await gameService.create({
        name: 'test',
        type: GameType.CHILD,
      });
      const game2 = await gameService.create({
        name: 'test2',
        type: GameType.CHILD,
      });
      const assignments = await service.assignGames(zone.id, [
        game.id,
        game2.id,
      ]);
      expect(assignments).toBe(2);
      const assignments2 = await service.unassignGames(zone.id, [
        game.id,
        game2.id,
      ]);
      expect(assignments2).toBe(2);
    });
  });
});
