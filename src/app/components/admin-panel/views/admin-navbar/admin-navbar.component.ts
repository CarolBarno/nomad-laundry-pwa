import { Component, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {

  userPictureOnly: boolean = false;
  user: any;
  userMenu = [{ data: { action: 'logout' }, title: 'Log Out' }]
  constructor(private sidebarService: NbSidebarService, private menu: NbMenuService,
    private authService: AuthService) {
    this.logoutUser();
  }

  ngOnInit(): void {
    this.getAdmin();
  }

  getAdmin() {
    this.authService.getCurrentUser().then(
      ({ user }) => {
        this.user = this.joinUserName(user);
      }
    ).catch(e => e);
  }

  joinUserName(user: CurrentUser) {
    let name = `${user.first_name} ${user.last_name}`;
    return { name };
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  logOut() {
    this.authService.logOut();
  }

  logoutUser() {
    this.menu.onItemClick().subscribe(action => {
      try {
        const { item } = action;
        if (item.data.action === 'logout') {
          this.logOut();
        }
      } catch (error) {
        return;
      }
    });
  }

}
