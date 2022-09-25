import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { UserHc, Users } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-user-hc',
  templateUrl: './user-hc.component.html',
  styleUrls: ['./user-hc.component.scss']
})
export class UserHcComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  userHcId: number;
  userId: number;
  listUserHcToEdit: Users;
  listUserHcsToEdit: UserHc;
  listUserHc: Users[] = [];
  editMode = false;
  isNew = false;

  public userHcForm: FormGroup;
  public userHcsForm: FormGroup;

  public nationality: any = [];
  public sex: any = [];
  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  constructor(
    private cdr: ChangeDetectorRef,
    private loopbackService: LoopbackService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastService: HotToastService,
    private router: Router
  ) {
    this.loadingSubject.next(true);

    this.route.params
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((params) => {
      if(params.id == 'new') {
        this.isNew = true;
      } else {
        this.userId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadListUserHc();

    if(!this.isNew) {
      this.loopbackService
        .findUserById(this.userId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listUserHcToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const userHcFormModel: FormModel<Users> = {
      id: [this.listUserHcToEdit ? this.listUserHcToEdit.id : 1, Validators.required],
      email: [this.listUserHcToEdit ? this.listUserHcToEdit.email : '', Validators.required],
      firstName: [this.listUserHcToEdit ? this.listUserHcToEdit.firstName : '', Validators.required],
      lastName: [this.listUserHcToEdit ? this.listUserHcToEdit.lastName : '', Validators.required],
      sex: [this.listUserHcToEdit ? this.listUserHcToEdit.sex : 0, Validators.required],
      status: [this.listUserHcToEdit ? this.listUserHcToEdit.status : 0, Validators.required],
      birthDate: [this.listUserHcToEdit ? this.listUserHcToEdit.birthDate : '', Validators.required],
      picture: [this.listUserHcToEdit ? this.listUserHcToEdit.picture : '', Validators.nullValidator],
    }

    this.userHcForm = this.fb.group(userHcFormModel);

    const man = {
      id: 1,
      value: 'm',
      name: 'Férfi'
    }

    const woman = {
      id: 2,
      value: 'w',
      name: 'Nő'
    }

    this.sex.push(man);
    this.sex.push(woman);

    this.loadingSubject.next(false);
  }

  loadListUserHc(): any {
    this.loopbackService
    .listUser()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      this.cdr.detectChanges();
    });
  }

  reset(): void {
    Swal.fire({
      title: 'Biztos elveted a műveletet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Igen',
      cancelButtonText: 'Nem'
    }).then((result) => {
      if (result.value) {
        this.userHcForm.reset();
        this.router.navigate(['/workers/user-hc/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.userHcForm.value) {
      const userHc: Users = {
        ...this.userHcForm.value,
      };

      userHc.sex = (userHc.sex
        ? parseInt(userHc.sex.toString(), 1) : 0);
  
      this.loopbackService
      .saveUser(userHc)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.userHcForm.markAllAsTouched();
        this.router.navigate(['/workers/user-hc/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.userHcForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
