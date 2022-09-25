import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { City } from 'src/app/core/models/loopback.model';
import { FormModel } from 'src/app/shared/FormModel';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe = new Subject<void>();
  error = false;
  hasError: boolean;
  errors: HttpErrorResponse;
  errorMsg: string = '';
  cityId: number;
  listCityToEdit: City;
  listCity: City[] = [];
  editMode = false;
  isNew = false;
  public cityForm: FormGroup;
  public countys: any[] = [];

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
        this.cityId = params.id;
      }
    })
  }

  ngOnInit(): void {
    this.loadlistCity();

    if(!this.isNew) {
      this.loopbackService
        .findCityById(this.cityId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((response) => {
          this.listCityToEdit= response;
          this.buildForm();
        });
    } else {
        this.buildForm();
    }
  }

  buildForm() {
    const cityFormModel: FormModel<City> = {
      id: [this.listCityToEdit ? this.listCityToEdit.id : 1, Validators.required],
      countyId: [this.listCityToEdit ? this.listCityToEdit.countyId : 1, Validators.required],
      name: [this.listCityToEdit ? this.listCityToEdit.name : '', Validators.required],
      zip: [this.listCityToEdit ? this.listCityToEdit.zip : '', Validators.required],

      isActive: [this.listCityToEdit ? this.listCityToEdit.isActive : 0, Validators.required],
    }

    this.cityForm = this.fb.group(cityFormModel);
    
    this.loopbackService
    .listCounties()
    .subscribe((res: any) => {
      res.forEach((element: any) => {
        this.countys.push(element);

        if(res && element) {
          this.loadingSubject.next(false);
        }
      });
    });
  }

  loadlistCity(): any {
    this.loopbackService
    .listCities()
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
        this.cityForm.reset();
        this.router.navigate(['dictionary/city/list'])
            .then();
        this.buildForm();
      }
    })
  }

  saveSettings(): void {
    if (this.cityForm.value) {

      this.cityForm.controls['isActive'].value == true 
      ? this.cityForm.controls['isActive'].setValue(1) 
      : this.cityForm.controls['isActive'].setValue(0);

      const city: City = {
        ...this.cityForm.value,
      };

      this.loopbackService
      .saveCity(city)
      .pipe(
        this.toastService.observe({
          loading: 'Folyamantban...',
          success: 'Sikeres mentés',
          error: 'Hiba történt'
       }),takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.cityForm.markAllAsTouched();
        this.router.navigate(['/dictionary/city/list'])
        .then();
      },
      (error: HttpErrorResponse) => {
        this.errors = error;
      });
    } else {
      this.toastService.error('Error');
      this.cityForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
