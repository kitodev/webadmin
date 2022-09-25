import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { Country, FieldsOfStudyCategory } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss']
})
export class CountryComponent implements OnInit {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  country: Country[] = [];
  errors: HttpErrorResponse;
  errorMsg: string = '';
  isNew = false;
  countryId: number;

  countryToEdit: Country;

  public countryForm: FormGroup;

  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  
  constructor(private cdr: ChangeDetectorRef,
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
          this.countryId = params.id;
        }
      })
  }

  ngOnInit(): void {
    this.loadListFieldsOfStudyCategory();

    if(!this.isNew) {
      this.loopbackService
        .findCountryById(this.countryId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.countryToEdit = response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const countryFormModel: FormModel<Country> = {
      id: [this.countryToEdit ? this.countryToEdit.id : 0, Validators.required],
      name: [this.countryToEdit ? this.countryToEdit.name : '', Validators.required],
      code: [this.countryToEdit ? this.countryToEdit.code : '', Validators.nullValidator],
      nationality: [this.countryToEdit ? this.countryToEdit.nationality : '', Validators.required],
      isActive: [this.countryToEdit ? this.countryToEdit.isActive : 0, Validators.nullValidator],

  }

    this.countryForm = this.fb.group(countryFormModel);
    this.loadingSubject.next(false);
  }

  loadListFieldsOfStudyCategory(): any {
    this.loopbackService
    .listFieldsOfStudyCategories()
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
        this.countryForm.reset();
        this.buildForm();
        this.router.navigate(['/dictionary/country/list'])
            .then();
      }
    })
  }

  saveSettings(): void {
    if (this.countryForm.value) {
      this.countryForm.controls['isActive'].value == true 
      ? this.countryForm.controls['isActive'].setValue(1) 
      : this.countryForm.controls['isActive'].setValue(0);

      const country: Country = {
        ...this.countryForm.value,
      };  

      this.loopbackService
      .saveCountry(country)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.countryForm.markAllAsTouched();
        this.router.navigate(['/dictionary/country/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.countryForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
