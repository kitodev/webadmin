import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Referers } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-referers-list',
  templateUrl: './referers-list.component.html',
  styleUrls: ['./referers-list.component.scss']
})
export class ReferersListComponent implements OnInit, OnDestroy {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  referersId: number;
  listReferers: Referers[] = [];
  allReferers: Referers[];
  isLoading =  true;
  errors: HttpErrorResponse;
  countSpareTime: number[];
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  cols: any[] = [];
  listSites: any[] = [];
  listActive: any[] = [];

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    //this.listTagCategories();
    this.listReferer();
    this.countReferer();
    this.loadStatus();
    this.loadSite();
    this.loadTableColumns();
    //this.countTags();
  }
  
  countReferer(): any {
    this.loopbackService
    .countReferer()
    .subscribe((response) => {
      this.countReferer = response.count;
      this.cdr.detectChanges();
    });
  }

  listReferer(): any {
    this.loopbackService
    .listReferers()
    .subscribe((response) => {
      this.listReferers = response;
      this.cdr.detectChanges();
    });
  }

  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Megnevezés' },
      { field: 'site', header: 'Kapcsolódó honlap' },
      { field: 'isActive', header: '' },
      { field: 'actions', header: 'Műveletek' }        
    ];
  }

  loadSite() {
    const hc = 
      { id: 10, name: 'Humáncentrum', value: 10 };
    const md = 
      { id: 20, name: 'Minddiák', value: 20 };
    const hcmd = 
      { id: 30, name: 'Humán Centrum és Mind-Diák', value: 30 };
      
      this.listSites.push(hc);
      this.listSites.push(md);
      this.listSites.push(hcmd);
      this.loadingSubject.next(false);
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

  delete(refererId: number): void {
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
              .deleteReferer(refererId)
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
                this.listReferer();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(refererId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.REFERERS}/detail/${refererId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
