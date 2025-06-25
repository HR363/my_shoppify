import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addToCart(@Request() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Get()
  async getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Patch(':id')
  async updateCartItem(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateCartDto) {
    return this.cartService.updateCartItem(req.user.id, id, dto);
  }

  @Delete(':id')
  async removeCartItem(@Request() req: any, @Param('id') id: string) {
    return this.cartService.removeCartItem(req.user.id, id);
  }
}
