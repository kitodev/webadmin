import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { DriverLicense, DrivingLicence, WorkTypeMd } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-work-type-md',
  templateUrl: './work-type-md.component.html',
  styleUrls: ['./work-type-md.component.scss']
})
export class WorkTypeMdComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  workTypeMdId: number;
  listworkTypeMdToEdit: WorkTypeMd;
  listworkTypeMd: WorkTypeMd[] = [];
  editMode = false;
  isNew = false;
  public workTypeMdForm: FormGroup;

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
        this.workTypeMdId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadlistWorkTypeMd();

    if(!this.isNew) {
      this.loopbackService
        .findWorkTypeMdById(this.workTypeMdId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listworkTypeMdToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const workTypeMdFormModel: FormModel<DriverLicense> = {
      id: [this.listworkTypeMdToEdit ? this.listworkTypeMdToEdit.id : 1, Validators.required],
      name: [this.listworkTypeMdToEdit ? this.listworkTypeMdToEdit.name : '', Validators.required],
      isActive: [this.listworkTypeMdToEdit ? this.listworkTypeMdToEdit.isActive : 0, Validators.required],
    }

    this.workTypeMdForm = this.fb.group(workTypeMdFormModel);
    
    this.loadingSubject.next(false);
  }

  loadlistWorkTypeMd(): any {
    this.loopbackService
    .listWorkTypeMds()
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
      this.workTypeMdForm.reset();
      this.router.navigate(['/dictionary/work-type-mds/list'])
      .then();
      this.buildForm();
    }
  })
  }

  saveSettings(): void {
    if (this.workTypeMdForm.value) {

      this.workTypeMdForm.controls['isActive'].value == true 
      ? this.workTypeMdForm.controls['isActive'].setValue(1) 
      : this.workTypeMdForm.controls['isActive'].setValue(0);

      const workTypeMd: WorkTypeMd = {
        ...this.workTypeMdForm.value,
      };

      this.loopbackService
      .saveWorkTypeMd(workTypeMd)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.workTypeMdForm.markAllAsTouched();
        this.router.navigate(['/dictionary/work-type-mds/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.workTypeMdForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
