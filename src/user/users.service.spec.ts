import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Users from './entity/users.entity';
import CreateUsersDto from './dto/createUsers.dto';

describe('UserService', () => {
  let service: UserService;
  let usersRepository: Repository<Users>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));

    usersRepository.findOneBy = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getUserByUsername', () => {
    it('should return user when found', async () => {
      const mockUser: Users = {
        user_id: '1',
        username: 'testuser',
        password: 'test',
        user_level: '1',
      };
      jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(mockUser);

      const result = await service.getUserByUsername('testuser');

      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(result.data).toEqual(mockUser);
      expect(result.statusCode).toBe(200);
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser: CreateUsersDto = {
        username: 'testuser',
        password: 'test',
        user_level: '1',
      };

      const mockCreatedUser = {
        identifiers: [{ user_id: 1 }],
        generatedMaps: [{ user_id: 1 }],
        raw: [{ user_id: 1 }],
      };

      jest
        .spyOn(service, 'cerateUserInDatabase')
        .mockResolvedValue(mockCreatedUser);
      const result = await service.createUser(mockUser);
      expect(result.statusCode).toBe(200);
    });
  });
});
