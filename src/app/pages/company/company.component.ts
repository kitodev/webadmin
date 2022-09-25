import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Company, FieldsOfWorkCategory } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../core/services/loopback.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  companyId: number;
  companyOfFieldsCategoryId: number;
  companyCategoryId: number;
  fieldsOfWorkCategory: FieldsOfWorkCategory[] = [];
  listCompanyToEdit: Company;
  listTag: Company[] = [];
  editMode = false;
  isNew = false;
  public companyForm: FormGroup;

  public countries: any[] = [];
  public counties: any[] = [];

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
        this.companyId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadCompany();
    this.listCompanyFieldsOfWorkCategories();
    //this.listCountries();
    
    if(!this.isNew) {
      this.loopbackService
        .findCompanyById(this.companyId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this. listCompanyToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const companyFormModel: FormModel<Company> = {
      id: [this.listCompanyToEdit ? this.listCompanyToEdit.id : 0, Validators.required],
      name: [this.listCompanyToEdit ? this.listCompanyToEdit.name : '', Validators.required],
      phone: [this.listCompanyToEdit ? this.listCompanyToEdit.phone : '', Validators.required],
      fax: [this.listCompanyToEdit ? this.listCompanyToEdit.fax : '', Validators.nullValidator],
      email: [this.listCompanyToEdit ? this.listCompanyToEdit.email : '', Validators.nullValidator],
      website: [this.listCompanyToEdit ? this.listCompanyToEdit.website : '', Validators.nullValidator],
      countryId: [this.listCompanyToEdit ? this.listCompanyToEdit.countryId : 0, Validators.nullValidator],
      countyId: [this.listCompanyToEdit ? this.listCompanyToEdit.countyId : 0, Validators.nullValidator],
      zip: [this. listCompanyToEdit ? this.listCompanyToEdit.zip : '', Validators.nullValidator],
      isActive: [this.listCompanyToEdit ? this.listCompanyToEdit.isActive : 0, Validators.nullValidator],
      city: [this.listCompanyToEdit ? this.listCompanyToEdit.city : '', Validators.required],
      address: [this.listCompanyToEdit ? this.listCompanyToEdit.address : '', Validators.nullValidator],
      registrationNumber: [this.listCompanyToEdit ? this.listCompanyToEdit.registrationNumber : '', Validators.nullValidator],
      taxNumber: [this.listCompanyToEdit ? this.listCompanyToEdit.taxNumber : '', Validators.nullValidator],
      bankAccountNumber: [this.listCompanyToEdit ? this.listCompanyToEdit.bankAccountNumber : '', Validators.nullValidator],
      phone_1: [this.listCompanyToEdit ? this.listCompanyToEdit.phone_1 : '', Validators.nullValidator],
    }

    this.companyForm = this.fb.group(companyFormModel);
    
    this.loopbackService
    .listCountries()
    .subscribe((res: any) => {
      res.forEach((element: any) => {
        this.countries.push(element);
        if(res && element) {
          this.loadingSubject.next(false);
        }
      });
    });

    this.loopbackService
    .listCounties()
    .subscribe((res: any) => {
      res.forEach((element: any) => {
        this.counties.push(element);
        if(res && element) {
          this.loadingSubject.next(false);
        }
      });
    });
  }

  // listCountries() {
  //   this.loopbackService
  //   .listCountries()
  //   .pipe(takeUntil(this.unsubscribe))
  //   .subscribe((response) => {
  //     console.log(response);
  //     this.cdr.detectChanges();
  //   });
  // }

  listCompanyFieldsOfWorkCategories(): any {
    this.loopbackService
    .listCompanyFieldsOfWorkCategories(this.companyId)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe((response) => {
      console.log(response);
      this.cdr.detectChanges();
    });
  }

  loadCompany(): any {
    this.loopbackService
    .listCompany()
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
        this.companyForm.reset();
        this.router.navigate(['/company/list'])
        .then()
        this.buildForm();
        }
    })
  }

  saveSettings(): void {
    if (this.companyForm.value) {
      this.companyForm.controls['isActive'].value == true 
      ? this.companyForm.controls['isActive'].setValue(1) 
      : this.companyForm.controls['isActive'].setValue(0);

      const company: Company = {
        ...this.companyForm.value,
      };


      this.loopbackService
      .saveCompany(company)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.companyForm.markAllAsTouched();
        this.router.navigate(['/company/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.companyForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
