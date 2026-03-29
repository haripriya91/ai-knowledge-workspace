import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { MailModule } from './modules/mail/mail.module';
import { WorkspaceModule } from './modules/workspace/workspace.module';
import { AssetModule } from './modules/asset/asset.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    PrismaModule,
    MailModule,
    WorkspaceModule,
    AssetModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
