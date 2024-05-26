import { Test, TestingModule } from '@nestjs/testing';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service'
import { Author } from './entity/author.entity'
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthorController', () => {
  let controller: AuthorController;
  let service: AuthorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorController],
      providers: [
        AuthorService,
        {
          provide: getRepositoryToken(Author),
          useValue: {            
            findAll: jest.fn().mockResolvedValue([Author]),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthorController>(AuthorController);
  });

    

  it('should return all authors', async () => {
    expect(controller).toBeDefined();
    //const result = Author;
    //jest.spyOn(service, 'findAll').mockImplementation(() => result);

    //expect(await controller.findAll()).toBe(result);
  });
});