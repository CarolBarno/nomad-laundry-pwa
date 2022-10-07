import { Component, OnInit } from '@angular/core';
import { CurrentUser } from 'src/app/interface/user-interface';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  currentTime = new Date();
  currentUser: CurrentUser | any;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.currentUser = this.dataService.authUser;
  }

}
