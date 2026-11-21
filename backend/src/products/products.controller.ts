import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { imageUploadOptions, publicUrlFor, requireFile } from '../common/upload';
import { AdminProductQuery, CreateProductDto, CreateStyleDto, UpdateProductDto, UpdateStyleDto } from './dto/products.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
  constructor(private readonly products: ProductsService) {}
  @Get('styles') styles() { return this.products.publicStyles(); }
  @Get('products') list() { return this.products.list(); }
  @Get('products/featured') featured() { return this.products.featured(5); }
  @Get('products/:slug') get(@Param('slug') slug: string) { return this.products.bySlug(slug); }
}

@Controller('admin/styles')
@UseGuards(JwtAuthGuard)
export class StylesAdminController {
  constructor(private readonly products: ProductsService) {}
  @Get() list(@Query('search') search?: string) { return this.products.listStyles(search); }
  @Get(':id') get(@Param('id', ParseIntPipe) id: number) { return this.products.findStyle(id); }
  @Post() create(@Body() dto: CreateStyleDto) { return this.products.createStyle(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStyleDto) { return this.products.updateStyle(id, dto); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.products.removeStyle(id); }
}

@Controller('admin/products')
@UseGuards(JwtAuthGuard)
export class ProductsAdminController {
  constructor(private readonly products: ProductsService) {}
  @Get() list(@Query() q: AdminProductQuery) { return this.products.listProducts(q); }
  @Get('counts') counts() { return this.products.counts(); }
  @Get(':id') get(@Param('id', ParseIntPipe) id: number) { return this.products.findProduct(id); }
  @Post() create(@Body() dto: CreateProductDto) { return this.products.createProduct(dto); }
  @Patch(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) { return this.products.updateProduct(id, dto); }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions()))
  upload(@Param('id', ParseIntPipe) id: number, @UploadedFile() file?: Express.Multer.File) {
    return this.products.setImage(id, publicUrlFor(requireFile(file).filename));
  }

  @Delete(':id/image') clearImage(@Param('id', ParseIntPipe) id: number) { return this.products.setImage(id, null); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.products.removeProduct(id); }
}
