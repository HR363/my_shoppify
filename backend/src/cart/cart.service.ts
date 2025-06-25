import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.stockQuantity < dto.quantity) throw new BadRequestException('Not enough stock');

    // Check if the user already has this product in their cart
    const cartItem = await this.prisma.cart.upsert({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
      update: {
        quantity: { increment: dto.quantity },
      },
      create: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
    });

    // Reduce product stock
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: { stockQuantity: { decrement: dto.quantity } },
    });

    return cartItem;
  }

  async getCart(userId: string) {
    return this.prisma.cart.findMany({
      where: { userId },
      include: {
        product: {
          select: { id: true, name: true, price: true, imageUrl: true },
        },
      },
    });
  }

  async updateCartItem(userId: string, cartItemId: string, dto: UpdateCartDto) {
    const cartItem = await this.prisma.cart.findUnique({ where: { id: cartItemId } });
    if (!cartItem || cartItem.userId !== userId) throw new NotFoundException('Cart item not found');
    // Optionally: adjust product stock if quantity changes
    return this.prisma.cart.update({ where: { id: cartItemId }, data: { quantity: dto.quantity } });
  }

  async removeCartItem(userId: string, cartItemId: string) {
    const cartItem = await this.prisma.cart.findUnique({ where: { id: cartItemId } });
    if (!cartItem || cartItem.userId !== userId) throw new NotFoundException('Cart item not found');
    // Restore product stock
    await this.prisma.product.update({
      where: { id: cartItem.productId },
      data: { stockQuantity: { increment: cartItem.quantity } },
    });
    return this.prisma.cart.delete({ where: { id: cartItemId } });
  }
}
