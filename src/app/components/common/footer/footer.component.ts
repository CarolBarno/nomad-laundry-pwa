import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  thisYear!: number;
  constructor() { }

  ngOnInit(): void {
    this.displayDate();
  }

  // display date footer
  displayDate() {
    this.thisYear = new Date().getFullYear();
  }

  getinTouchDialog(): void {

  }

  termsDialog(): void {

  }

}
