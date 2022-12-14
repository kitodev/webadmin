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
      { field: 'name', header: 'Megnevez??s' },
      { field: 'zip', header: 'Ir??ny??t??sz??m' },
      { field: 'countyId', header: 'Megye' },
      { field: 'isActive', header: '' },
      { field: 'actions', header: 'M??veletek' }        
    ];
  }
  
  loadStatus() {
    const active = 
      { id: 0, name: 'akt??v', value: 1 };
    const inactive = 
      { id: 1, name: 'inakt??v', value: 0 };
  
      this.listActive.push(active);
      this.listActive.push(inactive);
      this.loadingSubject.next(false);
  }

  delete(countyId: number): void {
      Swal.fire({
        title: 'Biztos t??rl??d ezt az elemet?',
        text: "Ut??na nem tudod vissza??ll??tani!",
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
                success: 'Sikeres t??rl??s',
                error: 'Hiba t??rt??nt'
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
