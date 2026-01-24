import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.component.html',
  styleUrl: './hero-section.component.css'
})
export class HeroSectionComponent { 
  visibleCount = 3;
  currentSlide = 0;

  slides = [
    {
      text: 'Save and organize research instantly',
      icon: 'assets/undraw_add-file_lf11.svg',
    },
    {
      text: 'Ask AI questions across your notes',
      icon: 'assets/undraw_audiobook_0h9f.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_continuous-learning_a1ld.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_document-analysis_3c0y.svg',
    },
    {
      text: 'Save and organize research instantly',
      icon: 'assets/undraw_document-search_2o7x.svg',
    },
    {
      text: 'Ask AI questions across your notes',
      icon: 'assets/undraw_idea_hz8b.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_image-upload_7b3b.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_document-analysis_3c0y.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_my-workspace_5961.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_notebook_jy1h.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_organizing-data_uns9.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_private-files_m2bw.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_product-explainer_b7ft.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_search-app_cpm0.svg',
    },
    {
      text: 'Build ideas with structured workspaces',
      icon: 'assets/undraw_to-do-list_eoia.svg',
    },
  ];
  
  
   // % to move per slide
   slideWidth = 100 / this.visibleCount;

   // number of dots/pages
   get dots() {
     return Array(this.slides.length - this.visibleCount + 1);
   }
 
   goToSlide(index: number) {
     this.currentSlide = index;
   }
 
   ngOnInit() {
     setInterval(() => {
       if (this.currentSlide < this.slides.length - this.visibleCount) {
         this.currentSlide++;
       } else {
         this.currentSlide = 0;
       }
     }, 6000); // slow & smooth
   }
}
