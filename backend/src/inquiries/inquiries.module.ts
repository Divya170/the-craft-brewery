import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InquiriesAdminController, InquiriesController } from './inquiries.controller';
import { InquiriesService } from './inquiries.service';
import { Inquiry } from './inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry])],
  controllers: [InquiriesController, InquiriesAdminController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
