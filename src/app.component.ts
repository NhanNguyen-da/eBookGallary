import { Component, signal, HostListener, computed, inject, ViewChild, ElementRef, Directive, AfterViewInit, OnDestroy, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, Category, Book } from './services/book.service';
import { BookCardComponent } from './components/book-card/book-card.component';

@Directive({
  selector: '[appCarousel]',
  standalone: true,
  exportAs: 'appCarousel'
})
export class CarouselDirective implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private ngZone = inject(NgZone);
  private intervalId: any = null;
  private isPaused = false;
  private scrollStep = 320; // Card width + gap (approx)

  ngAfterViewInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  private startAutoSlide() {
    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        if (!this.isPaused) {
          this.scrollRight();
        }
      }, 3000); // 3 seconds per slide
    });
  }

  private stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  scrollLeft() {
    const element = this.el.nativeElement;
    const currentScroll = element.scrollLeft;
    
    // If at start, jump to end
    if (currentScroll <= 0) {
       element.scrollTo({ left: element.scrollWidth, behavior: 'smooth' });
    } else {
       element.scrollTo({ left: currentScroll - this.scrollStep, behavior: 'smooth' });
    }
  }

  scrollRight() {
    const element = this.el.nativeElement;
    const currentScroll = element.scrollLeft;
    const maxScroll = element.scrollWidth - element.clientWidth;

    // If close to end, jump to start
    if (currentScroll >= maxScroll - 5) {
       element.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
       element.scrollTo({ left: currentScroll + this.scrollStep, behavior: 'smooth' });
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isPaused = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isPaused = false;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookCardComponent, CarouselDirective],
  template: `
    <!-- Search Overlay -->
    @if (showSearch()) {
        <div class="fixed inset-0 z-[90] flex flex-col items-center pt-20 md:pt-32 px-4 animate-fade-in text-slate-900 dark:text-white">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-white/95 dark:bg-black/95 backdrop-blur-md" (click)="closeSearch()"></div>
            
            <!-- Search Container -->
            <div class="relative z-10 w-full max-w-5xl flex flex-col gap-8 animate-scale-up-gentle" (click)="$event.stopPropagation()">
                
                <!-- Search Header -->
                <div class="flex items-center gap-6 border-b border-black/10 dark:border-white/20 pb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-slate-400 dark:text-white/50 shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input 
                        #searchInput
                        type="text" 
                        [value]="searchQuery()"
                        (input)="updateSearch($event)"
                        placeholder="Search by title, author, or tags..." 
                        class="w-full bg-transparent text-2xl md:text-4xl text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-white/30 focus:outline-none font-serif"
                    >
                    <button (click)="closeSearch()" class="text-slate-400 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <!-- Results -->
                <div class="w-full max-h-[65vh] overflow-y-auto custom-scrollbar pr-2">
                    @if (filteredBooks().length > 0) {
                        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 pb-20">
                            @for (book of filteredBooks(); track book.id) {
                                <div class="group relative animate-fade-up" [style.animation-delay]="$index * 50 + 'ms'">
                                    <app-book-card [book]="book" accentColor="#888888"></app-book-card>
                                    <div class="mt-3 opacity-60 text-[10px] uppercase tracking-widest text-slate-900 dark:text-white text-center">{{ book.category }}</div>
                                </div>
                            }
                        </div>
                    } @else if (searchQuery()) {
                        <div class="text-center text-slate-400 dark:text-white/40 py-20">
                            <p class="text-xl serif italic mb-2">No masterpieces found</p>
                            <p class="text-sm">Try searching for "{{ searchQuery() }}" in a different category</p>
                        </div>
                    } @else {
                        <div class="text-center text-slate-300 dark:text-white/20 py-20">
                            <p class="text-sm uppercase tracking-[0.2em]">Begin typing to explore the collection</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    }

    <!-- Side Menu Overlay -->
    @if (showMenu()) {
        <div class="fixed inset-0 z-[80] flex justify-end animate-fade-in">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" (click)="toggleMenu()"></div>
            
            <!-- Menu Panel -->
            <div class="relative z-10 w-80 h-full bg-white dark:bg-[#0a0a0a] border-l border-black/10 dark:border-white/10 shadow-2xl p-8 flex flex-col animate-slide-left">
                <div class="flex justify-between items-center mb-12">
                    <span class="serif font-bold text-xl text-slate-900 dark:text-white">Menu</span>
                    <button (click)="toggleMenu()" class="text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav class="flex flex-col gap-6 text-lg font-light">
                    <button (click)="scrollToSection('hero'); toggleMenu()" class="text-left text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors">Home</button>
                    @for (cat of bookService.categories(); track cat.id) {
                        <button (click)="scrollToSection(cat.id); toggleMenu()" class="text-left text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white transition-colors">
                            {{ cat.name }}
                        </button>
                    }
                </nav>

                <div class="mt-auto pt-8 border-t border-black/10 dark:border-white/10">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-slate-500 dark:text-white/50 uppercase tracking-widest">Theme</span>
                        <!-- Theme Toggle in Menu (kept for mobile/completeness) -->
                        <button (click)="toggleTheme()" class="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors">
                            @if (isDarkMode()) {
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-yellow-400">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                                </svg>
                                <span class="text-xs font-medium text-white">Light</span>
                            } @else {
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-slate-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                                </svg>
                                <span class="text-xs font-medium text-slate-900">Dark</span>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }

    <!-- Header -->
    <header class="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between transition-all duration-300 bg-gradient-to-b from-white/90 via-white/50 to-transparent dark:from-black/80 dark:via-black/50 dark:to-transparent pointer-events-none">
      <div class="flex items-center gap-4 pointer-events-auto">
        <div class="w-8 h-8 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-900 dark:text-white">
            <span class="serif font-bold text-lg">D</span>
        </div>
        <span class="text-slate-900 dark:text-white font-light tracking-widest text-sm uppercase hidden md:block">The Dat Library</span>
      </div>

      <!-- Nav Dots -->
      <nav class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex flex-row gap-4 pointer-events-auto">
        <button 
          (click)="scrollToSection('hero')"
          class="w-2 h-2 rounded-full transition-all duration-300"
          [class.bg-slate-900]="activeSection() === 'hero' && !isDarkMode()"
          [class.bg-white]="activeSection() === 'hero' && isDarkMode()"
          [class.bg-slate-300]="activeSection() !== 'hero' && !isDarkMode()"
          [class.bg-white/20]="activeSection() !== 'hero' && isDarkMode()"
          [class.scale-150]="activeSection() === 'hero'"
        ></button>
        @for (cat of bookService.categories(); track cat.id) {
          <button 
            (click)="scrollToSection(cat.id)"
            class="w-2 h-2 rounded-full transition-all duration-300"
            [class.scale-150]="activeSection() === cat.id"
            [style.background-color]="activeSection() === cat.id ? cat.accentColor : (isDarkMode() ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')"
          ></button>
        }
      </nav>

      <div class="flex items-center gap-6 pointer-events-auto">
        <!-- Search Trigger -->
        <button (click)="openSearch()" class="text-slate-500 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition-colors" title="Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
        </button>

        <!-- Header Theme Toggle -->
        <button (click)="toggleTheme()" class="text-slate-500 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition-colors" [title]="isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
            @if (isDarkMode()) {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                </svg>
            } @else {
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
            }
        </button>
        
        <!-- Menu Trigger -->
        <button (click)="toggleMenu()" class="text-slate-500 hover:text-slate-900 dark:text-white/70 dark:hover:text-white transition-colors" title="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
        </button>
      </div>
    </header>

    <!-- Scroll Progress -->
    <div class="fixed top-0 left-0 h-1 z-50 transition-all duration-300 ease-out" 
         [style.width.%]="scrollProgress()"
         [style.background-color]="currentAccentColor()">
    </div>

    <main class="relative bg-slate-50 dark:bg-black transition-colors duration-500">
      
      <!-- HERO SECTION -->
      <section id="hero" class="min-h-screen relative flex items-center justify-center overflow-hidden">
        <!-- Animated Background Particles -->
        <div class="absolute inset-0 opacity-30 pointer-events-none">
            <div class="absolute top-1/4 left-1/4 w-2 h-2 bg-slate-400 dark:bg-white rounded-full animate-pulse shadow-[0_0_20px_gray] dark:shadow-[0_0_20px_white]"></div>
            <div class="absolute top-3/4 left-1/2 w-1 h-1 bg-yellow-500 dark:bg-gold rounded-full animate-pulse shadow-[0_0_10px_gold]" style="animation-delay: 1s"></div>
            <div class="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse shadow-[0_0_15px_cyan]" style="animation-delay: 2s"></div>
        </div>

        <div class="z-10 text-center flex flex-col items-center">
            <div class="mb-12 relative w-64 h-96 perspective-1000">
                 <!-- 3D Rotating Book -->
                 <div class="w-full h-full relative transform-style-3d animate-[spin-slow_20s_linear_infinite] hover:animation-play-state-paused cursor-pointer group">
                    <!-- Front -->
                    <div class="absolute inset-0 bg-gradient-to-br from-gray-800 to-black rounded-r-md border-l-4 border-l-gray-700 flex items-center justify-center transform translate-z-10 backface-hidden shadow-2xl overflow-hidden border border-white/10">
                         <div class="absolute inset-0 bg-[url('https://picsum.photos/400/600')] bg-cover opacity-50 mix-blend-overlay"></div>
                         <div class="relative z-10 p-6 border-2 border-gold/30 m-4 h-[90%] flex flex-col justify-center items-center">
                            <h2 class="serif text-2xl text-gold font-bold mb-2">Book of the Month</h2>
                            <p class="text-xs tracking-widest uppercase text-white/60">Featured Collection</p>
                         </div>
                    </div>
                    <!-- Back -->
                    <div class="absolute inset-0 bg-gray-900 rounded-l-md border-r-4 border-r-gray-800 transform rotate-y-180 translate-z-10 backface-hidden"></div>
                    <!-- Spine -->
                    <div class="absolute top-0 bottom-0 w-10 bg-gray-800 transform rotate-y-90 translate-x-[-20px] translate-z-[123px] flex items-center justify-center">
                        <span class="rotate-90 text-white/50 text-xs tracking-widest whitespace-nowrap">THE DAT LIBRARY</span>
                    </div>
                    <!-- Pages -->
                    <div class="absolute top-2 bottom-2 right-2 w-[30px] bg-white transform rotate-y-90 translate-x-[-15px] translate-z-[120px]"></div>
                 </div>
                 
                 <!-- Reflection/Shadow -->
                 <div class="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/20 dark:bg-black/50 blur-xl rounded-[100%]"></div>
            </div>

            <h1 class="text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-slate-900 via-slate-800 to-slate-400 dark:from-white dark:via-white dark:to-white/40 font-bold serif mb-6 tracking-tight animate-fade-up">
                Literary<br/>Gallery
            </h1>
            <p class="text-lg md:text-xl text-slate-500 dark:text-white/50 font-light tracking-wide max-w-lg mx-auto mb-12 animate-fade-up" style="animation-delay: 0.2s">
                Where stories meet art. Experience the world's finest digital collection in an immersive environment.
            </p>
            
            <button (click)="scrollToSection(bookService.categories()[0].id)" class="animate-bounce text-slate-400 dark:text-white/30 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">
                <span class="text-xs uppercase tracking-[0.3em]">Explore</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mx-auto mt-2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
        </div>
      </section>

      <!-- CATEGORY SECTIONS -->
      @for (category of bookService.categories(); track category.id) {
        <section [id]="category.id" class="min-h-screen py-32 px-6 md:px-16 flex flex-col justify-center relative border-t border-slate-200 dark:border-white/5 transition-colors duration-500">
            <!-- Background Accent -->
            <div class="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-[var(--accent)]/5 to-transparent blur-[120px] pointer-events-none"
                 [style.--accent]="category.accentColor"></div>
            
            <div class="relative z-10 mb-16 max-w-4xl mx-auto w-full text-center md:text-left flex flex-col md:flex-row items-end justify-between gap-8">
                <div>
                    <h2 class="text-4xl md:text-6xl font-bold serif mb-4" [style.color]="category.accentColor">{{ category.name }}</h2>
                    <p class="text-xl text-slate-500 dark:text-white/60 font-light">{{ category.tagline }}</p>
                </div>
                <div class="hidden md:block w-32 h-[1px] bg-gradient-to-r from-slate-300 to-transparent dark:from-white/20"></div>
            </div>

            <!-- Spotlight Layout -->
            @if (category.layout === 'spotlight') {
                <div class="grid grid-cols-1 md:grid-cols-12 gap-12 max-w-7xl mx-auto w-full items-center">
                    <!-- Featured Large Book -->
                    <div class="md:col-span-5 md:col-start-2">
                       <app-book-card [book]="category.books[0]" [accentColor]="category.accentColor" class="scale-110 md:scale-125 z-10"></app-book-card>
                    </div>
                    <!-- List -->
                    <div class="md:col-span-5 grid grid-cols-2 gap-6">
                       @for (book of category.books.slice(1, 5); track book.id) {
                           <app-book-card [book]="book" [accentColor]="category.accentColor"></app-book-card>
                       }
                    </div>
                </div>
            }

            <!-- Grid Layout -->
            @if (category.layout === 'grid') {
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full">
                    @for (book of category.books; track book.id) {
                        <app-book-card [book]="book" [accentColor]="category.accentColor"
                            [class.translate-y-12]="isEven($index)"
                        ></app-book-card>
                    }
                </div>
            }

            <!-- Carousel Layout -->
            @if (category.layout === 'carousel') {
                <div class="w-full relative group">
                    <!-- Fade Gradients -->
                    <div class="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-slate-50 to-transparent dark:from-black dark:to-transparent z-10 pointer-events-none"></div>
                    <div class="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-slate-50 to-transparent dark:from-black dark:to-transparent z-10 pointer-events-none"></div>

                    <!-- Navigation Arrows -->
                    <button 
                        (click)="carousel.scrollLeft()"
                        class="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 text-slate-900 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    
                    <button 
                        (click)="carousel.scrollRight()"
                        class="absolute right-8 md:right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 text-slate-900 dark:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>

                    <!-- Carousel Container with Directive -->
                    <div 
                        appCarousel #carousel="appCarousel"
                        class="flex overflow-x-auto gap-8 md:gap-12 pb-12 pt-12 px-8 md:px-16 snap-x snap-mandatory hide-scrollbar items-center scroll-smooth"
                    >
                         @for (book of category.books; track book.id) {
                             <div class="snap-center shrink-0 w-[260px] md:w-[320px] transition-all duration-500 hover:-translate-y-2">
                                 <app-book-card [book]="book" [accentColor]="category.accentColor"></app-book-card>
                             </div>
                         }
                         <!-- End padding spacer -->
                         <div class="shrink-0 w-8 md:w-16"></div>
                    </div>
                </div>
            }

        </section>
      }

      <footer class="py-24 border-t border-slate-200 dark:border-white/10 text-center text-slate-400 dark:text-white/30 text-sm">
        <p>&copy; 2026 The Dat Library. All rights reserved.</p>
        <p class="mt-2">Designed by NhanNT.</p>
      </footer>
    </main>

    <!-- Floating Action Button -->
    <button 
        (click)="scrollToSection('hero')"
        class="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg transition-all duration-500 z-40 hover:scale-110"
        [class.translate-y-24]="!showFab()"
        [class.opacity-0]="!showFab()"
    >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
    </button>

    <!-- BOOK DETAIL MODAL -->
    @if (bookService.activeBook()) {
        <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in text-slate-900 dark:text-white">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md" (click)="closeModal()"></div>
            
            <!-- Modal Content -->
            <div class="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-[#0a0a0a] rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-up">
                
                <!-- Close Button -->
                <button (click)="closeModal()" class="absolute top-6 right-6 z-20 text-slate-500 dark:text-white/50 hover:text-slate-900 dark:hover:text-white transition-colors bg-white/20 dark:bg-black/20 p-2 rounded-full backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Left Side: Visuals -->
                <div class="w-full md:w-[55%] h-1/2 md:h-full relative bg-slate-100 dark:bg-[#111] flex items-center justify-center overflow-hidden transition-colors duration-500">
                    <!-- Dynamic Background -->
                    <div class="absolute inset-0 opacity-10 dark:opacity-30" 
                        [style.background]="'radial-gradient(circle at center, ' + activeBook()?.gradient?.split(',')[1] + ', transparent 70%)'">
                    </div>
                    
                    <!-- Large Book Display -->
                    <div class="relative z-10 w-48 md:w-80 aspect-[2/3] shadow-2xl transform transition-transform duration-700 hover:scale-105 hover:rotate-y-[-10deg] perspective-1000">
                         <div class="w-full h-full rounded-lg relative transform-style-3d rotate-y-[-15deg]">
                            <div class="absolute inset-0 rounded-lg shadow-inner" [style.background]="activeBook()?.gradient">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div class="absolute bottom-8 left-8 right-8">
                                    <h1 class="serif text-3xl md:text-4xl font-bold text-white mb-2 leading-tight shadow-black drop-shadow-md">{{ activeBook()?.title }}</h1>
                                    <p class="text-white/80 text-lg">{{ activeBook()?.author }}</p>
                                </div>
                            </div>
                            <!-- Fake Spine -->
                             <div class="absolute top-0 bottom-0 left-0 w-8 bg-white/20 transform -translate-x-full rotate-y-90 origin-right"></div>
                         </div>
                    </div>

                    <!-- Thumbnails (Static for visual) -->
                    <div class="absolute bottom-8 left-0 right-0 flex justify-center gap-4 px-4">
                        <div class="w-16 h-24 rounded border-2 border-slate-400 dark:border-white/50 bg-slate-300 dark:bg-gray-800 opacity-100 cursor-pointer shadow-lg transform scale-110"></div>
                        <div class="w-16 h-24 rounded border border-slate-300 dark:border-white/10 bg-slate-300 dark:bg-gray-800 opacity-50 cursor-pointer hover:opacity-100 transition-opacity"></div>
                        <div class="w-16 h-24 rounded border border-slate-300 dark:border-white/10 bg-slate-300 dark:bg-gray-800 opacity-50 cursor-pointer hover:opacity-100 transition-opacity"></div>
                    </div>
                </div>

                <!-- Right Side: Details -->
                <div class="w-full md:w-[45%] h-1/2 md:h-full overflow-y-auto p-8 md:p-12 custom-scrollbar">
                    
                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2 mb-6">
                        @for (tag of activeBook()?.tags; track tag) {
                            <span class="px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/70 border border-slate-200 dark:border-white/10">{{ tag }}</span>
                        }
                    </div>

                    <h2 class="text-3xl font-bold mb-2 text-slate-900 dark:text-white">{{ activeBook()?.title }}</h2>
                    <p class="text-xl text-slate-500 dark:text-white/50 serif italic mb-8">{{ activeBook()?.category }} Collection, {{ activeBook()?.year }}</p>

                    <div class="space-y-6 text-slate-600 dark:text-white/80 leading-relaxed font-light text-sm md:text-base">
                        <p>{{ activeBook()?.description }}</p>
                        <p>This edition features a completely remastered layout, optimized for high-resolution digital displays. Experience the narrative with unprecedented clarity.</p>
                        
                        <div class="bg-slate-50 dark:bg-white/5 rounded-xl p-6 border border-slate-200 dark:border-white/10 mt-8">
                            <h3 class="text-slate-900 dark:text-white font-bold mb-4 uppercase tracking-widest text-xs">Specifications</h3>
                            <div class="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div>
                                    <span class="block text-slate-400 dark:text-white/40 text-xs mb-1">Length</span>
                                    {{ activeBook()?.specs?.pages }} Pages
                                </div>
                                <div>
                                    <span class="block text-slate-400 dark:text-white/40 text-xs mb-1">Format</span>
                                    {{ activeBook()?.specs?.format }}
                                </div>
                                <div>
                                    <span class="block text-slate-400 dark:text-white/40 text-xs mb-1">Language</span>
                                    {{ activeBook()?.specs?.language }}
                                </div>
                                <div>
                                    <span class="block text-slate-400 dark:text-white/40 text-xs mb-1">File Size</span>
                                    {{ activeBook()?.specs?.fileSize }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-10 flex gap-4">
                        <button class="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black py-4 rounded-lg font-bold tracking-wide hover:bg-slate-800 dark:hover:bg-gray-200 transition-colors">
                            PREVIEW SAMPLE
                        </button>
                        <button class="px-6 py-4 rounded-lg border border-slate-300 dark:border-white/20 hover:border-slate-900 dark:hover:border-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-900 dark:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    }

  `,
  styles: [`
    :host {
      display: block;
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(100,100,100,0.2);
        border-radius: 4px;
    }
    
    .animate-slide-left {
        animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        transform: translateX(100%);
    }
    @keyframes slideLeft {
        to { transform: translateX(0); }
    }
    
    .perspective-1000 {
        perspective: 1000px;
    }
    .transform-style-3d {
        transform-style: preserve-3d;
    }
    .backface-hidden {
        backface-visibility: hidden;
    }
    .rotate-y-180 {
        transform: rotateY(180deg);
    }
    .rotate-y-90 {
        transform: rotateY(90deg);
    }
    .translate-z-10 {
        transform: translateZ(10px);
    }

    @keyframes spin-slow {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
    }
    
    .animate-fade-up {
        animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    @keyframes fadeUp {
        to { opacity: 1; transform: translateY(0); }
    }

    .animate-fade-in {
        animation: fadeIn 0.3s ease-out forwards;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    .animate-scale-up {
        animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        transform: scale(0.95);
    }
    @keyframes scaleUp {
        to { opacity: 1; transform: scale(1); }
    }

    .animate-scale-up-gentle {
        animation: scaleUpGentle 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        opacity: 0;
        transform: scale(0.98) translateY(-10px);
    }
    @keyframes scaleUpGentle {
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class AppComponent implements OnInit {
  bookService = inject(BookService);
  
  activeSection = signal<string>('hero');
  scrollProgress = signal<number>(0);
  showFab = signal<boolean>(false);
  showMenu = signal<boolean>(false);
  isDarkMode = signal<boolean>(true);
  
  showSearch = signal(false);
  searchQuery = signal('');
  
  @ViewChild('searchInput') searchInput?: ElementRef;

  ngOnInit() {
    // Sync signal with current DOM state on init
    this.isDarkMode.set(document.documentElement.classList.contains('dark'));
  }

  // Computed property to get current accent color based on active section
  currentAccentColor = computed(() => {
    const sectionId = this.activeSection();
    if (sectionId === 'hero') return this.isDarkMode() ? '#ffffff' : '#000000';
    const category = this.bookService.categories().find(c => c.id === sectionId);
    return category ? category.accentColor : (this.isDarkMode() ? '#ffffff' : '#000000');
  });
  
  // Computed for active book modal
  activeBook = this.bookService.activeBook;

  // Computed for Search
  allBooks = computed(() => this.bookService.categories().flatMap(c => c.books));
  
  filteredBooks = computed(() => {
      const q = this.searchQuery().toLowerCase().trim();
      if (!q) return [];
      return this.allBooks().filter(b => 
          b.title.toLowerCase().includes(q) || 
          b.author.toLowerCase().includes(q) ||
          b.tags.some(t => t.toLowerCase().includes(q))
      );
  });

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Update progress bar
    if (height > 0) {
      this.scrollProgress.set((scrollY / height) * 100);
    }

    // Toggle FAB
    this.showFab.set(scrollY > window.innerHeight);

    // Detect Active Section
    const sections = ['hero', ...this.bookService.categories().map(c => c.id)];
    
    for (const id of sections) {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        // If top of section is within the middle of the screen
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
          if (this.activeSection() !== id) {
            this.activeSection.set(id);
          }
          break;
        }
      }
    }
  }

  // Close search on escape
  @HostListener('document:keydown.escape')
  onEscape() {
      if (this.showSearch()) {
          this.closeSearch();
      }
      if (this.bookService.activeBook()) {
          this.closeModal();
      }
      if (this.showMenu()) {
          this.toggleMenu();
      }
  }

  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  closeModal() {
    this.bookService.setActiveBook(null);
  }

  isEven(index: number): boolean {
    return index % 2 === 0;
  }

  openSearch() {
    this.showSearch.set(true);
    // Use timeout to allow element to render before focusing
    setTimeout(() => this.searchInput?.nativeElement.focus(), 50);
  }
  
  closeSearch() {
    this.showSearch.set(false);
    this.searchQuery.set('');
  }
  
  updateSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  toggleMenu() {
    this.showMenu.update(v => !v);
  }

  toggleTheme() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
  }
}