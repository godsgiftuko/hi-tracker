import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  healthCheck() {
    console.log('Health check');
    return { status: 'ok' };
  }
}
