import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from 'src/common/storage/storage.module';

@Module({
  imports: [MulterModule.register({ dest: './uploads' }), StorageModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService], // export so other modules can use it
})
export class AiModule {}
