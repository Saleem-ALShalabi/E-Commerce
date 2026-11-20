import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;

  const user = {
    id: 'u1',
    email: 'jane@example.com',
    name: 'Jane',
    role: 'CUSTOMER' as const,
    passwordHash: bcrypt.hashSync('correct-password', 4),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const usersMock = {
    findByEmail: vi.fn(),
    create: vi.fn(),
    toPublic: vi.fn(({ passwordHash: _ignored, ...rest }) => rest),
  };
  const jwtMock = { signAsync: vi.fn().mockResolvedValue('signed.jwt.token') };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersMock },
        { provide: JwtService, useValue: jwtMock },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  it('logs in with the correct password and never returns the hash', async () => {
    usersMock.findByEmail.mockResolvedValue(user);

    const result = await service.login({ email: user.email, password: 'correct-password' });

    expect(result.accessToken).toBe('signed.jwt.token');
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(jwtMock.signAsync).toHaveBeenCalledWith({
      sub: 'u1',
      email: user.email,
      role: 'CUSTOMER',
    });
  });

  it('rejects a wrong password', async () => {
    usersMock.findByEmail.mockResolvedValue(user);

    await expect(
      service.login({ email: user.email, password: 'wrong-password' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects an unknown email', async () => {
    usersMock.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nobody@example.com', password: 'whatever' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('hashes the password on register', async () => {
    usersMock.create.mockImplementation(async (data) => ({ ...user, ...data }));

    await service.register({ email: 'new@example.com', name: 'New', password: 'plain-text-pw' });

    const saved = usersMock.create.mock.calls[0][0];
    expect(saved.passwordHash).not.toBe('plain-text-pw');
    expect(await bcrypt.compare('plain-text-pw', saved.passwordHash)).toBe(true);
  });
});
