import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { FieldsOfStudyCategory } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-fields-of-study-category-list',
  templateUrl: './fields-of-study-category-list.component.html',
  styleUrls: ['./fields-of-study-category-list.component.scss']
})
export class FieldsOfStudyCategoryListComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  listFieldsOfStudyCategory: FieldsOfStudyCategory[] = [];
  fieldsOfStudyCategoryId: number;
  isLoading = true;
  errors: HttpErrorResponse;
  countFieldsOfStudyCat: number;
  searchTerm: string;
  collectionSize: number;
  listActive: any[] = [];
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
    this.listFieldsOfStudyCategories();
    this.countFieldsOfStudyCategories();
    this.loadStatus();
    this.loadTableColumns();
  }
  
  countFieldsOfStudyCategories(): any {
      this.loopbackService
      .countFieldsOfStudyCategories()
      .subscribe((response) => {
        console.log(response);
        this.countFieldsOfStudyCat = response.count;
        this.cdr.detectChanges();
    });
  }

  listFieldsOfStudyCategories(): any {
    this.loopbackService
    .listFieldsOfStudyCategories()
    .subscribe((response) => {
      this.listFieldsOfStudyCategory = response;
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
      {id: 0, name: 'aktív', value: 1};
    const inactive = 
      { id: 1, name: 'inaktív', value: 0};
  
      this.listActive.push(active);
      this.listActive.push(inactive);
      this.loadingSubject.next(false);
  }

  delete(fieldsOfStudyCategoryId: number): void {
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
              .deleteFieldsOfStudyCategory(fieldsOfStudyCategoryId)
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
                this.listFieldsOfStudyCategories();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(fieldsOfStudyCategoryId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.FIELDS_OF_STUDY_CATEGORY}/detail/${fieldsOfStudyCategoryId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
