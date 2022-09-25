import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { FieldsOfWork, FieldsOfWorkCategory } from 'src/app/core/models/loopback.model';
import { LoopbackService } from 'src/app/core/services/loopback.service';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fields-of-work-category-list',
  templateUrl: './fields-of-work-category-list.component.html',
  styleUrls: ['./fields-of-work-category-list.component.scss']
})
export class FieldsOfWorkCategoryListComponent implements OnInit {
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  PAGE = DATATABLE_SETTINGS.PAGE;
  private unsubscribe = new Subject<void>();
  fieldsOfWorkCategoryId: number;
  listFieldsOfWork: FieldsOfWork[] = [];
  listFieldsOfWorkCategory: FieldsOfWorkCategory[] = [];
  isLoading =  true;
  searchTerm: string;
  fieldsOfWorkCategoryCount: number;
  errors: HttpErrorResponse;
  cols: any[];
  loading: boolean;
  constructor(
      private cdr: ChangeDetectorRef,
      private loopbackService: LoopbackService,
      private router: Router,
      private toastService: HotToastService,
      private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    //this.listfieldsOfWork();
    this.listfieldsOfWorkCategory();
    this.fieldsOfWorkCategoryCounts();
    this.loadTableColumns();
  }

  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Név' },
      { field: 'actions', header: 'Műveletek' }        
    ];
  }
  
  fieldsOfWorkCategoryCounts(): any {
    this.loopbackService
    .fieldsOfWorkCategoryCount()
    .subscribe((response) => {
      this.fieldsOfWorkCategoryCount = response.count;
      this.cdr.detectChanges();
    });
  }
  
  // listfieldsOfWork(): any {
  //   this.loopbackService
  //     .listFieldsOfWorks()
  //     .subscribe(response => {
  //       this.listFieldsOfWork = response;
  //       this.cdr.detectChanges();
  //   });
  // }

  listfieldsOfWorkCategory(): any {
    this.loading = true;

    setTimeout(() => {
    this.loopbackService
    .listFieldsOfWorkCategories(this.fieldsOfWorkCategoryId)
    .subscribe((response) => {
      this.listFieldsOfWork = response;
      this.loading = false;
      this.cdr.detectChanges();
    });
    }, 1000);
  }

  delete(fieldsOfWorkCategoryId: number): void {
      Swal.fire({
        title: 'Biztos törlöd ezt a kategóriát?',
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
              .deleteFieldsOfWorkCategory(fieldsOfWorkCategoryId)
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
                this.listfieldsOfWorkCategory();
              },
              (error: HttpErrorResponse) => {
                this.errors = error
              });  
        }
      })
  }

  edit( fieldsOfWorkCategoryId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.FIELDS_OF_WORK_CATEGORY}/detail/${fieldsOfWorkCategoryId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
