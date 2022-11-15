import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html'
})
export class TermsAndConditionsComponent implements OnInit {
  termsAndConditions: string;

  constructor(public dialogRef: MatDialogRef<TermsAndConditionsComponent>,
    private dataService: DataService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.termsAndConditions = this.data;
  }

  ngOnInit(): void {
    if (!this.termsAndConditions) {
      this.getSiteSettings();
    }
  }

  getSiteSettings() {
    this.dataService.getSiteSettings().subscribe({
      next: response => {
        if (response) {
          const [{ terms_conditions }] = response;
          this.termsAndConditions = terms_conditions;
        }
      },
      error: error => {
        return null;
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
