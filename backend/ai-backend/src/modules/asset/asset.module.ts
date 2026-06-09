import { Module } from '@nestjs/common';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { StorageModule } from '../../common/storage/storage.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [StorageModule, AiModule],
  controllers: [AssetController],
  providers: [AssetService],
})
export class AssetModule {}
