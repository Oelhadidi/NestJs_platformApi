import { SetMetadata } from '@nestjs/common';

export const Role = (role: 'admin' | 'entrepreneur' | 'investor') => SetMetadata('role', role);
