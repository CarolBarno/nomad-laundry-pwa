import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { MenuItems } from './pages';

@Component({
  selector: 'app-ngx-pages',
  templateUrl: './pages.component.html',
  // styleUrls: ['./pages.component.css']
})
export class PagesComponent {
  menu: any;
  constructor(private dataService: DataService, private authService: AuthService) {
    this.getAdmin();
    this.menu = new MenuItems(['']).MENU_ITEMS;
    // this.getUserRoles();
  }

  async getAdmin() {
    this.dataService.authUser = await this.authService.getCurrentUser().then(
      async admin => {
        const { user } = admin;
        return user;
      }
    ).catch(error => this.dataService.logError(error));
  }

  getUserRoles() {
    this.dataService.getUserPermissions().subscribe(response => {
      this.dataService.userRoles = response;
      const perms = response.map(elm => elm['action.name']);
      this.menu = new MenuItems(perms).MENU_ITEMS;
    }, error => {
      this.menu = new MenuItems(['']).MENU_ITEMS;
    });
  }

}
