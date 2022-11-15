import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appProgressColor]'
})
export class ProgressColorDirective {

  static counter = 0;
  @Input() color: any;
  styleEl: HTMLStyleElement = document.createElement('style');
  uniqueAttr = `app-progress-bar-color-${ProgressColorDirective.counter++}`;

  constructor(private element: ElementRef) {
    const nativeEl: HTMLElement = this.element.nativeElement;
    nativeEl.setAttribute(this.uniqueAttr, '');
    nativeEl.appendChild(this.styleEl);
  }

  ngOnChanges(): void {
    this.updateColor();
  }

  updateColor(): void {
    this.styleEl.innerText = `[${this.uniqueAttr}] .mat-progress-bar-fill::after {background-color: ${this.color};}`;
  }

}
