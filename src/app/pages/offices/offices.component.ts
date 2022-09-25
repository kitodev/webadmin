import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Office, OfficeUserEmployee } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../core/services/loopback.service';

@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss']
})
export class OfficesComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  officesId: number;
  tagCategoryId: number;
  listOfficeId: number;
  listOfficesToEdit: Office;
  listOffices: Office[] = [];
  editMode = false;
  isNew = false;
  listTagCategoryToEdit: OfficeUserEmployee;
  public officeForm: FormGroup;
  public offices: any[] = [];

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
        console.log(params.id);
        this.isNew = true;
      } else {
        this.officesId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadListOffice();

    if(!this.isNew) {
      this.loopbackService
        .findOfficeById(this.officesId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listOfficesToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const officeFormModel: FormModel<Office> = {
      id: [this.listOfficesToEdit ? this.listOfficesToEdit.id : 0, Validators.required],
      isFeatured: [this.listOfficesToEdit ? this.listOfficesToEdit.isFeatured : 0, Validators.required],
      slug: [this.listOfficesToEdit ? this.listOfficesToEdit.slug : '', Validators.nullValidator],
      name: [this.listOfficesToEdit ? this.listOfficesToEdit.name : '', Validators.required],
      address: [this.listOfficesToEdit ? this.listOfficesToEdit.address : '', Validators.nullValidator],
      phone: [this.listOfficesToEdit ? this.listOfficesToEdit.phone : '', Validators.nullValidator],
      openTime: [this.listOfficesToEdit ? this.listOfficesToEdit.openTime : '', Validators.nullValidator],
      emailHc: [this.listOfficesToEdit ? this.listOfficesToEdit.emailHc : '', Validators.email],
      emailMd: [this.listOfficesToEdit ? this.listOfficesToEdit.emailMd : '', Validators.email],
      isActive: [this.listOfficesToEdit ? this.listOfficesToEdit.isActive : 1, Validators.required],
      isHc: [this.listOfficesToEdit ? this.listOfficesToEdit.isHc : 1, Validators.required],
      isMd: [this.listOfficesToEdit ? this.listOfficesToEdit.isMd : 1, Validators.required],

      type: [this.listOfficesToEdit ? this.listOfficesToEdit.type : 0, Validators.required],
    }

    this.officeForm = this.fb.group(officeFormModel);
    
    const firstOfficeType = {
      id: 20,
      value: 'központi iroda',
      name: 'központi iroda'
    }
    const secondOfficeType = {
      id: 10,
      value: 'iroda',
      name: 'iroda'
    }
    const thirdOfficeType = {
      id: 30,
      value: 'képviselet',
      name: 'képviselet'
    }

    this.offices.push(firstOfficeType);
    this.offices.push(secondOfficeType);
    this.offices.push(thirdOfficeType);

    this.loadingSubject.next(false);

  }

  loadListOffice(): any {
    this.loopbackService
    .listOffice()
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      console.log(response);
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
        this.officeForm.reset();
        this.router.navigate(['/offices/list'])
        .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.officeForm.value) {

      this.officeForm.controls['isActive'].value == true 
      ? this.officeForm.controls['isActive'].setValue(1) 
      : this.officeForm.controls['isActive'].setValue(0);

      this.officeForm.controls['isHc'].value == true 
      ? this.officeForm.controls['isHc'].setValue(1) 
      : this.officeForm.controls['isHc'].setValue(0);
      
      this.officeForm.controls['isMd'].value == true 
      ? this.officeForm.controls['isMd'].setValue(1) 
      : this.officeForm.controls['isMd'].setValue(0);

      const office: Office = {
        ...this.officeForm.value,
      };

      office.type = (office.type
      ? parseInt(office.type.toString(), 10) : 0);

      this.loopbackService
      .saveOffice(office)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.officeForm.markAllAsTouched();
        this.router.navigate(['/offices/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.officeForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
