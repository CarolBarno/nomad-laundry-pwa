import { Component } from "@angular/core";
import { MenuItems } from "./pages";

@Component({
    selector: 'ngx-one-column-layout',
    template: `
    <nb-layout>
      <nb-layout-header fixed>
      <app-admin-navbar></app-admin-navbar>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer fixed>
      <footer> Nomad Laundry ©  {{year}}, All rights reserved</footer>
      </nb-layout-footer>
    </nb-layout>
    `,
})
export class OneColumnLayoutComponent {
    menu = new MenuItems([]).MENU_ITEMS;
    year = new Date().getFullYear();
}