import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Country} from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';
@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.scss']
})
export class CountryListComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  countryId: number;
  listCountry: Country[] = [];
  allCountry: Country[];
  isLoading =  true;
  errors: HttpErrorResponse;
  countCountry: number[];
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  listActive: any[] = [];
  cols: any[] = [];

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listCountrys();
    this.countCountrys();
    this.loadStatus();
    this.loadTableColumns();
  }
  
  countCountrys(): any {
    this.loopbackService
    .countCountry()
    .subscribe((response) => {
      this.countCountry = response.count;
      this.cdr.detectChanges();
    });
  }
  
  loadTableColumns(): any {
    this.cols = [
      { field: 'nationality', header: 'Megnevezés' },
      { field: 'name', header: 'Ország' },
      { field: 'isActive', header: '' },
      { field: 'actions', header: 'Műveletek' }        
    ];
  }

  loadStatus() {
    const active = 
      { id: 0, name: 'aktív', value: 1 };
    const inactive = 
      { id: 1, name: 'inaktív', value: 0 };
  
      this.listActive.push(active);
      this.listActive.push(inactive);
      this.loadingSubject.next(false);
  }

  listCountrys(): any {
    this.loopbackService
    .listCountries()
    .subscribe((response) => {
      this.listCountry = response;
      this.cdr.detectChanges();
    });
  }
  
  delete(countryId: number): void {
      Swal.fire({
        title: 'Biztos törlöd ezt az elemet?',
        text: "Utána nem tudod visszaállítani!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Igen',
        cancelButtonText: 'Nem'
      }).then((result) => {
        if (result.value) {
            this.loopbackService
              .deleteCountry(countryId)
              .pipe(
                this.toastService.observe({
                loading: 'Folyamantban...',
                success: 'Sikeres törlés',
                error: 'Hiba történt'
              }),
                takeUntil(this.unsubscribe)
              )
              .subscribe(
              () => {
                this.listCountrys();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(countryId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.COUNTRY}/detail/${countryId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
