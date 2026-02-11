import { Component, input, signal, computed, effect, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book, BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styles: [`
    :host {
      display: block;
      perspective: 1000px;
    }
  `]
})
export class BookCardComponent {
  book = input.required<Book>();
  accentColor = input.required<string>();

  cardElement = viewChild<ElementRef>('card');

  isHovered = signal(false);
  rotationX = signal(0);
  rotationY = signal(0);
  
  // 0: Cover, 1: Angled, 2: Spine, 3: Back, 4: Interior 1, 5: Interior 2
  activeImageIndex = signal(0);
  
  // Computed transform for the 3D tilt
  cardTransform = computed(() => {
    return `rotateX(${this.rotationX()}deg) rotateY(${this.rotationY()}deg) scale(${this.isHovered() ? 1.05 : 1})`;
  });

  // Derived gradients for "different views"
  coverGradient = computed(() => this.book().gradient);
  // Slightly darken or shift hue for other views to simulate lighting/material
  spineGradient = computed(() => {
    const base = this.book().gradient;
    return `linear-gradient(90deg, #111 0%, transparent 20%, transparent 80%, #111 100%), ${base}`;
  });
  backGradient = computed(() => {
    return `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.6)), ${this.book().gradient}`;
  });
  interiorGradient = computed(() => {
    return `linear-gradient(to right, #fcfaf5 0%, #fff 5%, #fff 95%, #ddd 100%)`; // Paper look
  });

  constructor(private bookService: BookService) {
    effect((onCleanup) => {
      let interval: any;
      if (this.isHovered()) {
        // Reset to 0 immediately on hover enter? Or keep existing logic.
        // Requirement: "Auto-cycle... on hover"
        interval = setInterval(() => {
          this.activeImageIndex.update(idx => (idx + 1) % 6);
        }, 800);
      } else {
        this.activeImageIndex.set(0);
        this.rotationX.set(0);
        this.rotationY.set(0);
      }
      onCleanup(() => clearInterval(interval));
    });
  }

  onMouseMove(e: MouseEvent) {
    if (!this.cardElement()) return;
    
    const card = this.cardElement()!.nativeElement;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-15 to 15 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateY = ((x - centerX) / centerX) * 15;
    const rotateX = -((y - centerY) / centerY) * 15;

    this.rotationY.set(rotateY);
    this.rotationX.set(rotateX);
  }

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }

  openDetails() {
    this.bookService.setActiveBook(this.book());
  }
}