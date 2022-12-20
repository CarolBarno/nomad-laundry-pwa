import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { title } from 'process';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: CurrentUser;
  thisYear: any;
  items: NbMenuItem[] = [
    {
      title: 'Manage Account',
      icon: 'edit',
      children: [
        {
          title: 'Edit Profile',
          link: '/profile/edit-profile',
        },
        {
          title: 'Change Password',
          link: '/profile/change-password'
        },
        {
          title: 'Verification',
          link: '/profile/verification'
        },
        {
          title: 'Security',
          link: '/profile/security'
        }
      ]
    }
  ];

  sideToggle: boolean;

  constructor(private authService: AuthService, private sidebarService: NbSidebarService, private dataService: DataService) {
    this.getCurrentUser();
    this.thisYear = new Date().getFullYear();
  }

  toggleSidebar(): boolean {
    this.sideToggle = !this.sideToggle;
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getUserFromStorage().subscribe({
      next: user => this.currentUser = user,
      error: error => this.dataService.logError(error)
    });
  }

  async getCurrentUser() {
    this.dataService.currentUser = await this.authService.getCurrentUser().then(
      async response => {
        const { user } = response;
        return user;
      }
    ).catch(err => {
      this.dataService.logError(err);
      return;
    });
  }

}
