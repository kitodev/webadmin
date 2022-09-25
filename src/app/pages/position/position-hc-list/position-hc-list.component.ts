import { Status } from './../../../core/models/loopback.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Company, County, Positions, Office } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-position-hc-list',
  templateUrl: './position-hc-list.component.html',
  styleUrls: ['./position-hc-list.component.scss']
})
export class PositionHcListComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();

  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  positionId: number;
  countyId: number;
  listPositions: Positions[] = [];
  positionsData: Positions[] = [];
  listCity: County[] = [];
  isLoading =  true;
  loading: boolean;
  errors: HttpErrorResponse;
  countPosition: number[];
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  cols: any[];
  listCompany: Company[] = [];
  listOffice: Office[] = [];
  public status: Status[] = [
    { id: 10, name: 'szerkesztett', value: 10 },
    { id: 20, name: 'rögzített', value: 20 },
    { id: 30, name: 'jóváhagyott', value: 30 },
    { id: 40, name: 'megvalósult', value: 40 },
    { id: 50, name: 'lezárult', value: 50 },
    { id: 60, name: 'törölt',value: 60 },
  ];
  constructor(
    private cdr: ChangeDetectorRef,
    private loopbackService: LoopbackService,
    private router: Router,
    private toastService: HotToastService,
    private route: ActivatedRoute,
) { }

ngOnInit(): void {
  this.listPosition();
  this.loadPositionDatas();
  this.loadTableColumns();
}

loadTableColumns(): any {
  this.cols = [
    { field: 'id', header: 'Azonosító' },
    { field: 'name', header: 'Név' },
    { field: 'companyId', header: 'Cég' },
    { field: 'countyId', header: 'Mv.helye' },
    // { field: 'offices', header: '' },
    { field: 'status', header: 'Státusz' },
    // { field: 'ownerUserId', header: 'Pozíció gazda' },
    { field: 'actions', header: 'Műveletek' }        
  ];
}

// listTagCategories(): any {
//   this.loopbackService
//     .listTagCategories()
//     .subscribe(response => {
//       this.listTagCategory = response;
//       this.cdr.detectChanges();
//   });
// }

loadPositionDatas(): any {
  this.loopbackService
    .listCompany()
    .subscribe(response => {
      this.listCompany = response;
      console.log(this.listCompany);
      this.cdr.detectChanges();
  });

  this.loopbackService
    .listCities()
    .subscribe(response => {
      this.listCity = response;
      this.cdr.detectChanges();
  });

  this.loopbackService
  .countPositions()
  .subscribe((response) => {
    this.countPosition = response.count
    this.cdr.detectChanges();
  });
  
  this.loopbackService
  .listOffice()
  .subscribe((response) => {
    this.listOffice = response
    console.log(this.listOffice);
    this.cdr.detectChanges();
  });
}

listPosition(): any {
  this.loading = true;

  setTimeout(() => {
    this.loopbackService
    .listPositions()
    .subscribe((response) => {
      this.listPositions = response;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }, 1000);
}

delete(positionId: number): void {
    Swal.fire({
      title: 'Biztos törlöd ezt a címkét?',
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
            .deletePositionHcs(positionId)
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
              this.listPosition();
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            });  
      }
    })
}

detail(positionId: number): void {
  this.router
    .navigateByUrl(`${AppRoutes.POSITION}/position-hc/details/${positionId}`)
    .then();
}

ngOnDestroy(): void {
  this.unsubscribe.next();
  this.unsubscribe.complete();
}

}
