import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AlertService } from 'src/app/service/alert.service';
import { DataService } from 'src/app/service/data.service';
import { OnlineCheckService } from 'src/app/service/online-check.service';
import { OtpService } from 'src/app/service/otp.service';
import { SharedService } from 'src/app/service/shared.service';
import { UtilsService } from 'src/app/service/utils.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  user: any = {
    email: null,
    first_name: null,
    last_name: null,
    id: null,
    phone_number: null,
    id_number: null,
    id_upload: null,
    isVerified: null
  };

  userCopy: any;
  currentUser: CurrentUser;
  destroy: Subject<any> = new Subject<any>();
  idImageUrl: { uri: any; }[] = [];
  uploading: boolean;
  onlineStatus: boolean;
  submitName: boolean;
  upLoadId: boolean;
  idFileName: string;
  isIdPdf: boolean = false;
  editIdNumberVisible: boolean;

  constructor(private internetService: OnlineCheckService, private snackbar: MatSnackBar, private dialog: MatDialog,
    private utilsService: UtilsService, private alert: AlertService, private dataService: DataService) { }

  ngOnInit(): void {
    this.currentUser = this.dataService.currentUser;
    this.userCopy = { ...this.currentUser };
    this.getUser();
    this.checkInternetStatus();
  }

  checkInternetStatus(): void {
    this.internetService.checkOfflineStatus().subscribe(status => {
      this.onlineStatus = status;
    });
  }

  onSubmitName(form: NgForm) {
    if (form.valid) {
      if (!this.onlineStatus) {
        this.snackbar.open('Action could not be completed', 'Internet status' + 'Offline', {
          duration: 5000
        });
        return;
      }

      this.submitName = true;
      const compareData = {
        first_name: this.userCopy.first_name,
        last_name: this.userCopy.last_name
      };
      if (JSON.stringify(form.value) === JSON.stringify(compareData)) {
        this.submitName = false;
        this.alert.info('No change was detected');
        return;
      }
      this.updateUserProfile(form.value);
    }
  }

  idUpload(form: NgForm) {
    if (form.valid) {
      this.upLoadId = true;
      if (this.idImageUrl.length) {
        this.uploadImage(this.idImageUrl, 'idUpload').then(
          res => {
            const compareData: any = {
              id_number: this.userCopy.id_number
            };
            const userData: any = {
              id_upload: res.id
            };
            if (JSON.stringify(form.value) !== JSON.stringify(compareData)) {
              userData.id_number = form.value.id_number;
            }

            if (res.id) {
              this.user.id_upload = res.id;
            }

            this.updateUserProfile(userData);
            return res;
          }
        ).catch(error => {
          this.upLoadId = false;
          if (error.code === 408) {
            this.alert.error('Uploading ID document failed. Please try again later', 'ID Upload');
          } else if (error.code === 401) {
            this.alert.info('Your session has expired');
          } else {
            this.alert.info('An error occured and your request could not be complated at the moment');
          }
        });
      } else {
        const comparedData = {
          id_number: this.userCopy.id_number
        };
        if (JSON.stringify(form.value) === JSON.stringify(comparedData)) {
          this.alert.info('No change was detected');
          this.upLoadId = false;
          return;
        }
        this.updateUserProfile(form.value);
      }
    }
  }

  updateUserProfile(useData: any) {
    this.dataService.updateProfile(useData, this.currentUser.id).pipe(
      takeUntil(this.destroy)
    ).subscribe(response => {
      this.upLoadId = false;
      this.submitName = false;
      if (response) {
        this.user = response;
        this.userCopy = response;
      }
      this.destroy.next();
      this.destroy.complete();
    });
  }

  removeIdImage() {
    this.idImageUrl.length = 0;
    this.isIdPdf = false;
  }

  uploadImage(imageUrl, action): Promise<any> {
    const imageData: any = { uri: imageUrl[0].url, action };
    return;
  }

  checkFileSize(bytes: number) {
    let kb: number = bytes / 1000;
    if (kb > 2000) {
      return false;
    } else {
      return true;
    }
  }

  uploadId(files: FileList) {
    const file = files.item(0);
    const valid = this.utilsService.validateFileUploadType(file.name);

    if (!valid) return this.alert.error('Please choose another file type. Images, Pdf and Docs are allowed.');

    const size = this.checkFileSize(file.size);
    if (size === false) return this.alert.error('Please choose anothe file. Max of 2MB in size is allowed.');

    this.idFileName = file.name;
    this.isIdPdf = this.checkFileFormat(this.idFileName);
  }

  deleteIdImageUrl() {
    this.user.id_upload = null;
    this.isIdPdf = false;
  }

  checkFileFormat(file: string) {
    let extn = file.split('.');
    let lastItem = extn[extn.length - 1];
    if (lastItem.toLowerCase() === 'pdf') {
      return true;
    } else {
      return false;
    }
  }

  getUser() {
    this.dataService.getUser(this.currentUser.id).subscribe({
      next: res => {
        this.user = res;
      },
      error: error => this.dataService.logError(error)
    });
  }

  editIdNumber() {
    this.editIdNumberVisible = true;
  }

  openDialog(action: string) {
    this.dialog.open(EditPhoneEmailDialog, {
      width: '500px',
      data: { action, user: this.user }
    });
  }

}

@Component({
  selector: 'app-email-edit',
  templateUrl: 'email-phone-popup.component.html',
  styleUrls: ['edit-profile.component.css']
})
export class EditPhoneEmailDialog {
  user: any;
  userData: any = {
    email: null,
    otp: null
  };

  phoneData: any = {
    phone_number: null,
    otp: null
  };
  showOtp: boolean;
  sendingOtp: boolean;
  updatingEmail: boolean;
  action: string;
  hidePhoneField: boolean;
  phoneOtp: boolean;
  updatingPhone: boolean;

  constructor(public dialogRef: MatDialogRef<EditPhoneEmailDialog>, private dataService: DataService,
    private otpService: OtpService, private alert: AlertService, @Inject(MAT_DIALOG_DATA) data: any) {
    this.user = data.user;
    this.action = data.action;
  }

  onNoClick() {
    this.dialogRef.close();
  }

  sendOtp() {
    this.sendingOtp = true;
    this.user.newEmail = this.userData.email;
    this.user.action = 'UserUpdateEmail';
    this.otpService.createHashedOtp(this.user).then(
      res => {
        this.sendingOtp = true;
        this.showOtp = true;
        this.otpService.setItem(res.otp);
      }
    ).catch(
      error => {
        this.alert.error(error.message);
        this.sendingOtp = false;
      }
    );
  }

  sendPhoneOtp() {
    this.phoneOtp = true;
    this.phoneData.action = 'UserUpdatePhone';
    this.phoneData.first_name = this.user.first_name;
    this.otpService.createHashedOtp(this.phoneData).then(
      res => {
        this.hidePhoneField = true;
        this.phoneOtp = false;
        this.otpService.setItem(res.otp);
      }
    ).catch(
      error => {
        this.alert.error(error.message);
        this.phoneOtp = false;
      }
    );
  }

  changeEmail(form: NgForm) {
    if (form.valid) {
      this.updatingEmail = true;
      this.otpService.decryptOtp().then(
        res => {
          if (Number(res.otp) === Number(form.value.otp)) {
            const userData = {
              email: form.value.email,
              action: 'UserUpdateEmail'
            };
            this.updateUserProfile(userData);
          } else {
            this.updatingEmail = false;
            this.alert.error('Wrong OTP provided');
          }
        }
      ).catch(
        error => {
          this.updatingEmail = false;
          this.alert.error('Your request could not be completed at the moment. Please try again later');
        }
      )
    }
  }

  changePhoneNumber(form: NgForm) {
    if (form.valid) {
      this.updatingPhone = true;
      this.otpService.decryptOtp().then(
        res => {
          if (Number(res.otp) === Number(form.value.otp)) {
            const userData = {
              email: form.value.phone_number
            };
            this.updateUserProfile(userData);
          } else {
            this.updatingPhone = false;
            this.alert.error('Wrong OTP provided');
          }
        }
      ).catch(
        error => {
          this.updatingPhone = false;
          this.alert.error('Your request could not be completed at the moment. Please try again later');
        }
      )
    }
  }

  updateUserProfile(userData: any) {
    if (!this.user.id) return;
    this.dataService.updateProfile(userData, this.user.id).pipe().subscribe(
      response => {
        this.updatingEmail = false;
        this.updatingPhone = false;
        if (response) {
          this.user = response;
          this.dialogRef.close();
        }
      }
    );
  }

}
