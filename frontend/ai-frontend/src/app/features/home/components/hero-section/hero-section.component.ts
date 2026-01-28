import { Component, AfterViewInit, ViewChild,  CUSTOM_ELEMENTS_SCHEMA, OnDestroy  } from '@angular/core';
import { register } from 'swiper/element/bundle';
@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HeroSectionComponent implements AfterViewInit {
 // Use ElementRef with proper typing instead of 'any'
 @ViewChild('swiper', { static: true }) swiperEl!: any;

  
  // Make public for template access
  readonly AUTO_SLIDE_DELAY = 3000; // 3 seconds
  
  private autoSlideInterval: any;
  public isPaused = false;
  slides = [
    {
      icon: 'assets/undraw_add-file_lf11.svg',
      text: 'Save files, links, and notes in one place'
    },
    {
      icon: 'assets/undraw_document-search_2o7x.svg',
      text: 'Search instantly across all your knowledge'
    },
    {
      icon: 'assets/undraw_notebook_jy1h.svg',
      text: 'Organize content into smart workspaces'
    },
    {
      icon: 'assets/undraw_audiobook_0h9f.svg',
      text: 'Ask AI questions across your saved notes'
    },
    {
      icon: 'assets/undraw_document-analysis_3c0y.svg',
      text: 'Get summaries and insights automatically'
    },
    {
      icon: 'assets/undraw_image-upload_7b3b.svg',
      text: 'Upload PDFs, images, and documents easily'
    },
    {
      icon: 'assets/undraw_my-workspace_5961.svg',
      text: 'Build ideas step by step inside workspaces'
    },
    {
      icon: 'assets/undraw_private-files_m2bw.svg',
      text: 'Keep your research private and secure'
    }
  ];

 swiperParams = {
  slidesPerView: 3,
  spaceBetween: 30,
  centeredSlides: true,
  loop: true,
  pagination: {
    clickable: true,
  },
  breakpoints: {
    320: { slidesPerView: 1, spaceBetween: 20 },
    640: { slidesPerView: 2, spaceBetween: 20 },
    1024: { slidesPerView: 3, spaceBetween: 30 }
  },
  on: {
    init: () => this.startAutoSlide(),
    slideChange: () => this.resetAutoSlide(),
    touchStart: () => this.pauseAutoSlide(),
    touchEnd: () => this.resumeAutoSlide(),
    mouseEnter: () => this.pauseAutoSlide(),
    mouseLeave: () => this.resumeAutoSlide(),
  }
};

constructor() {
  register();
}

ngAfterViewInit() {
  setTimeout(() => {
    if (this.swiperEl?.nativeElement) {
      Object.assign(this.swiperEl.nativeElement, this.swiperParams);
    }
  }, 0);
}

ngOnDestroy() {
  this.stopAutoSlide();
}

private startAutoSlide(): void {
  this.stopAutoSlide();
  
  this.autoSlideInterval = setInterval(() => {
    if (!this.isPaused && this.swiperEl?.nativeElement?.swiper) {
      this.swiperEl.nativeElement.swiper.slideNext();
    }
  }, this.AUTO_SLIDE_DELAY);
}

private stopAutoSlide(): void {
  if (this.autoSlideInterval) {
    clearInterval(this.autoSlideInterval);
    this.autoSlideInterval = null;
  }
}

private pauseAutoSlide(): void {
  this.isPaused = true;
}

private resumeAutoSlide(): void {
  this.isPaused = false;
}

private resetAutoSlide(): void {
  this.stopAutoSlide();
  this.startAutoSlide();
}

nextSlide(): void {
  this.pauseAutoSlide();
  this.swiperEl?.nativeElement?.swiper?.slideNext();
  
  setTimeout(() => {
    this.resumeAutoSlide();
    this.resetAutoSlide();
  }, 100);
}

prevSlide(): void {
  this.pauseAutoSlide();
  this.swiperEl?.nativeElement?.swiper?.slidePrev();
  
  setTimeout(() => {
    this.resumeAutoSlide();
    this.resetAutoSlide();
  }, 100);
}

// Public methods for template
playSlides(): void {
  this.resumeAutoSlide();
  this.startAutoSlide();
}

pauseSlides(): void {
  this.pauseAutoSlide();
  this.stopAutoSlide();
}
 
}