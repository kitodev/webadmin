import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { City, County } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  cityId: number;
  listCities: City[] = [];
  countyId: number;
  listCounty: County[] = [];
  defaultSalesUserId: City[] = [];
  allCity: City[];
  isLoading = true;
  errors: HttpErrorResponse;
  countCitys: number[];
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  cols: any[] = [];
  listActive: any[] = [];

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.loadCitiesData();
    this.loadStatus();
    this.loadTableColumns();
  }
  
  loadCitiesData() {
    this.loopbackService
    .listCityCount()
    .subscribe((response) => {
      this.countCitys = response.count;
      this.cdr.detectChanges();
    });

    this.loopbackService
    .listCities(this.countyId)
    .subscribe((response) => {
      this.listCities = response;
      this.cdr.detectChanges();
    });

    this.loopbackService
    .listCounties()
    .subscribe(response => {
      this.listCounty = response;
      this.cdr.detectChanges();
  });

  }
  
  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Megnevezés' },
      { field: 'zip', header: 'Irányítószám' },
      { field: 'countyId', header: 'Megye' },
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

  delete(countyId: number): void {
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
              .deleteCity(countyId)
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
                this.loadCitiesData();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(countyId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.CITY}/detail/${countyId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
