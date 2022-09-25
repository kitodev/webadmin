import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { DriverLicense, DrivingLicence } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-driving-licence',
  templateUrl: './driving-licence.component.html',
  styleUrls: ['./driving-licence.component.scss']
})
export class DrivingLicenceComponent implements OnInit {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  drivingLicenceId: number;
  listDrivingLicenceToEdit: DrivingLicence;
  listDrivingLicence: DrivingLicence[] = [];
  editMode = false;
  isNew = false;
  public drivingLicenceForm: FormGroup;

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
        this.drivingLicenceId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadDrivingLicences();

    if(!this.isNew) {
      this.loopbackService
        .findDrivingLicenceById(this.drivingLicenceId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listDrivingLicenceToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const drivingLicenceFormModel: FormModel<DriverLicense> = {
      id: [this.listDrivingLicenceToEdit ? this.listDrivingLicenceToEdit.id : 1, Validators.required],
      name: [this.listDrivingLicenceToEdit ? this.listDrivingLicenceToEdit.name : '', Validators.required],
      isActive: [this.listDrivingLicenceToEdit ? this.listDrivingLicenceToEdit.isActive : 0, Validators.required],
    }

    this.drivingLicenceForm = this.fb.group(drivingLicenceFormModel);
    
    this.loadingSubject.next(false);
  }

  loadDrivingLicences(): any {
    this.loopbackService
    .listDrivingLicences()
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
        this.drivingLicenceForm.reset();
        this.router.navigate(['/dictionary/driving-licences/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.drivingLicenceForm.value) {

      this.drivingLicenceForm.controls['isActive'].value == true 
      ? this.drivingLicenceForm.controls['isActive'].setValue(1) 
      : this.drivingLicenceForm.controls['isActive'].setValue(0);

      const drivingLicence: DrivingLicence = {
        ...this.drivingLicenceForm.value,
      };

      this.loopbackService
      .saveDrivingLicence(drivingLicence)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.drivingLicenceForm.markAllAsTouched();
        this.router.navigate(['/dictionary/driving-licences/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.drivingLicenceForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
