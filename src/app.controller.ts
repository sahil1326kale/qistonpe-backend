import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getRoot() {
    return {
      message: 'QistonPe Backend API is running 🚀',
      status: 'OK',
      environment: 'production',
    };
  }
}
