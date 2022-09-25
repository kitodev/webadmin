import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { DrivingLicence } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-driving-licence-list',
  templateUrl: './driving-licence-list.component.html',
  styleUrls: ['./driving-licence-list.component.scss']
})
export class DrivingLicenceListComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  drivingLicenceId: number;
  listDrivingLicence: DrivingLicence[] = [];
  //allDrivingLicence:  DrivingLicence[];
  isLoading =  true;
  errors: HttpErrorResponse;
  countDrivingLicence: number[];
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
    this.listDrivingLicences();
    this.countDrivingLicences();
    this.loadStatus();
    this.loadTableColumns();
  }
  
  countDrivingLicences(): any {
    this.loopbackService
    .countDrivingLicence()
    .subscribe((response) => {
      this.countDrivingLicence = response.count;
      this.cdr.detectChanges();
    });
  }

  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Megnevezés' },
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

  listDrivingLicences(): any {
    this.loopbackService
    .listDrivingLicences()
    .subscribe((response) => {
      this.listDrivingLicence = response;
      this.cdr.detectChanges();
    });
  }

  delete(drivingLicenceId: number): void {
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
              .deleteDrivingLicence(drivingLicenceId)
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
                this.listDrivingLicences();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(drivingLicenceId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.DRIVING_LICENSES}/detail/${drivingLicenceId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
