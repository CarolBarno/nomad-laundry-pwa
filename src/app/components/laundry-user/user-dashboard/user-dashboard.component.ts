import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  currentUser: any;
  pendingAction: boolean;

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.currentUser = this.dataService.currentUser;
    this.pendingAction = this.dataService.checkUserActions(this.currentUser);
  }

  navigateToPassword() {
    this.router.navigate(['/profile/change-password']);
  }

}
