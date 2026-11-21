import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RateLimiter, fingerprintOf, makeReference, toCsv } from '../common/rate-limit';
import { fieldErrors } from '../common/validation';
import { CreateInquiryDto, ListInquiriesQuery, UpdateInquiryDto } from './dto/inquiry.dto';
import { Inquiry } from './inquiry.entity';
import { validateEnquiry } from './inquiry-rules';

const DUPLICATE_WINDOW_MS = 10 * 60_000;

@Injectable()
export class InquiriesService {
  private readonly limiter: RateLimiter;

  constructor(
    @InjectRepository(Inquiry) private readonly repo: Repository<Inquiry>,
    config: ConfigService,
  ) {
    this.limiter = new RateLimiter(() => Number(config.get('INQUIRY_RATE_LIMIT')) || 5,
      'You’ve sent several messages in a short time. Please wait a few minutes, or email the brewery.');
  }

  private async newReference() {
    for (;;) {
      const ref = makeReference('TCB');
      if ((await this.repo.count({ where: { reference: ref } })) === 0) return ref;
    }
  }

  async create(dto: CreateInquiryDto, ip: string) {
    // Honeypot filled → a bot. Reject without saving; never report success.
    if (String(dto.website ?? '').trim()) throw new HttpException({ statusCode: 400, message: 'Your message could not be sent.' }, HttpStatus.BAD_REQUEST);

    const { errors, clean } = validateEnquiry(dto);
    if (Object.keys(errors).length) {
      const n = Object.keys(errors).length;
      throw fieldErrors(errors, n === 1 ? 'Please check 1 field before sending.' : `Please check ${n} fields before sending.`);
    }

    const fingerprint = fingerprintOf([clean.email, clean.enquiryType, clean.message]);
    const last = await this.repo.findOne({ where: { fingerprint }, order: { createdAt: 'DESC' } });
    if (last && Date.now() - new Date(last.createdAt).getTime() < DUPLICATE_WINDOW_MS) {
      throw new ConflictException({ statusCode: 409, message: 'This exact message was just sent, so it wasn’t sent again. Change a detail, or call us if you need to follow up.' });
    }

    this.limiter.check(ip);
    const saved = await this.repo.save(this.repo.create({
      ...clean,
      consentAt: new Date(),
      fingerprint, status: 'new', reference: await this.newReference(),
    }));
    return { received: true, reference: saved.reference, name: saved.name, email: saved.email, enquiryType: saved.enquiryType, createdAt: saved.createdAt };
  }

  async list(q: ListInquiriesQuery) {
    const page = Math.max(1, parseInt(q.page || '1', 10) || 1);
    const pageSize = Math.min(100000, Math.max(5, parseInt(q.pageSize || '20', 10) || 20));
    const qb = this.repo.createQueryBuilder('i');
    if (q.status && q.status !== 'all') qb.andWhere('i.status = :status', { status: q.status });
    if (q.enquiryType?.trim()) qb.andWhere('i.enquiryType = :t', { t: q.enquiryType.trim() });
    if (q.search?.trim()) {
      qb.andWhere('(LOWER(i.name) LIKE :s OR LOWER(i.email) LIKE :s OR LOWER(i.reference) LIKE :s OR LOWER(i.enquiryType) LIKE :s OR i.phone LIKE :s OR LOWER(i.message) LIKE :s)', { s: `%${q.search.trim().toLowerCase()}%` });
    }
    const dir = q.sort === 'oldest' ? 'ASC' : 'DESC';
    qb.orderBy('i.createdAt', dir).addOrderBy('i.id', dir).skip((page - 1) * pageSize).take(pageSize);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, pageSize, pages: Math.max(1, Math.ceil(total / pageSize)) };
  }

  async stats() {
    const rows = await this.repo.createQueryBuilder('i').select('i.status', 'status').addSelect('COUNT(*)', 'count').groupBy('i.status').getRawMany<{ status: string; count: string }>();
    const by = Object.fromEntries(rows.map((r) => [r.status, Number(r.count)]));
    return { new: by.new ?? 0, responded: by.responded ?? 0, archived: by.archived ?? 0, total: rows.reduce((a, r) => a + Number(r.count), 0) };
  }

  async findOne(id: number) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) throw new NotFoundException('Message not found.');
    return row;
  }

  async update(id: number, dto: UpdateInquiryDto) {
    const row = await this.findOne(id);
    if (dto.status) row.status = dto.status;
    if (dto.adminNotes !== undefined) row.adminNotes = dto.adminNotes?.trim() || null;
    return this.repo.save(row);
  }

  async remove(id: number) {
    await this.repo.remove(await this.findOne(id));
    return { ok: true };
  }

  async exportCsv(q: ListInquiriesQuery) {
    const { items } = await this.list({ ...q, page: '1', pageSize: '100000' });
    return toCsv(items, ['reference', 'status', 'createdAt', 'name', 'email', 'phone', 'enquiryType', 'message', 'consentAt', 'adminNotes']);
  }
}
