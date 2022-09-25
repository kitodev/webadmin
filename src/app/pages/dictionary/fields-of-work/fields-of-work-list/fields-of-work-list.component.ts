import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { FieldsOfWork, FieldsOfWorkCategory } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fields-of-work-list',
  templateUrl: './fields-of-work-list.component.html',
  styleUrls: ['./fields-of-work-list.component.scss']
})
export class FieldsOfWorkListComponent implements OnInit, OnDestroy {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  private unsubscribe = new Subject<void>();
  fieldsOfWorkCategoryId: number;
  listFieldsOfWork: FieldsOfWork[] = [];
  listFieldsOfWorkCategory: FieldsOfWorkCategory[] = [];
  isLoading =  true;
  loading: boolean;
  errors: HttpErrorResponse;
  searchTerm: string;
  countFieldsOfWork: number[];
  page: number = 1;
  cols: any[] = [];

  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.listfieldsOfWorkCategory();
    this.listfieldsOfWork();
    this.countFieldsOfWorks();
    this.loadTableColumns();
  }

  countFieldsOfWorks(): any {
    this.loopbackService
    .fieldsOfWorkCount()
    .subscribe((response) => {
      this.countFieldsOfWork = response.count;
      this.cdr.detectChanges();
    });
  }

  listfieldsOfWorkCategory(): any {
    this.loopbackService
      .listFieldsOfWorkCategories()
      .subscribe(response => {
        this.listFieldsOfWorkCategory = response;
        this.cdr.detectChanges();
    });
  }
  
  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Megnevezés' },
      { field: 'fieldsOfWorkCategoryId', header: 'Szakterület' },
      { field: 'actions', header: 'Műveletek' }        
    ];
  }

  listfieldsOfWork(): any {
    this.loading = true;
  
      setTimeout(() => {
      this.loopbackService
      .listFieldsOfWorks(this.fieldsOfWorkCategoryId)
      .subscribe((response) => {
        this.listFieldsOfWork= response;
        this.loading = false;
        //this.loadingSubject.next(false);
        this.cdr.detectChanges();
      });
    }, 1000);
  }

  delete(fieldsOfWorkCategoryId: number): void {
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
              .deleteFieldsOfWork(fieldsOfWorkCategoryId)
              .pipe(
                this.toastService.observe({
                loading: 'Folyamantban...',
                success: 'Sikeres törlés',
                error: 'Hiba történt'
              }),
                takeUntil(this.unsubscribe)
              )
              .subscribe(
              (response) => {
                this.listfieldsOfWork();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(fieldsOfWorkCategoryId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.FIELDS_OF_WORK}/detail/${fieldsOfWorkCategoryId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
