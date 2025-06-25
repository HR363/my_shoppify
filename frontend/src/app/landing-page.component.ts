import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  categories = [
    {
      title: 'Clothes',
      img: '/assets/collections_clothing.jpg',
      desc: 'Trendy outfits for every occasion.'
    },
    {
      title: 'Shoes',
      img: '/assets/collections_shoes.jpg',
      desc: 'Step up your style with our latest shoes.'
    },
    {
      title: 'Fragrances',
      img: '/assets/fragrance_collections.jpg',
      desc: 'Captivating scents for everyone.'
    },
    {
      title: 'Jewellery',
      img: '/assets/collections_jewellery.jpg',
      desc: 'Elegant pieces to complete your look.'
    }
  ];

  featuredProducts = [
    {
      name: 'Classic Denim Jacket',
      img: '/assets/denim_jacket.jpg',
      desc: 'A timeless piece for your wardrobe.'
    },
    {
      name: 'Luxury Leather Boots',
      img: '/assets/leather_boots.jpg',
      desc: 'Premium quality and comfort.'
    },
    {
      name: 'Signature Eau de Parfum',
      img: '/assets/perfume.jpg',
      desc: 'Make a statement with every scent.'
    },
    {
      name: 'Gold Hoop Earrings',
      img: '/assets/earings.jpg',
      desc: 'Chic and versatile for any style.'
    }
  ];

  valueProps = [
    { icon: 'fa-truck', title: 'Free Shipping', desc: 'On all orders over $50.' },
    { icon: 'fa-undo', title: 'Easy Returns', desc: '30-day hassle-free returns.' },
    { icon: 'fa-certificate', title: '100% Authentic', desc: 'Guaranteed genuine products.' },
    { icon: 'fa-star', title: 'New Arrivals', desc: 'Fresh styles every week.' }
  ];
} 