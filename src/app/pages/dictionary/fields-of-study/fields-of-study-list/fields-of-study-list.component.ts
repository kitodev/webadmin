import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { FieldsOfStudy, FieldsOfStudyCategory } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../../core/services/loopback.service';

@Component({
  selector: 'app-fields-of-study-list',
  templateUrl: './fields-of-study-list.component.html',
  styleUrls: ['./fields-of-study-list.component.scss']
})
export class FieldsOfStudyListComponent implements OnInit {
  private loadingSubject: BehaviorSubject<boolean> =
  new BehaviorSubject<boolean>(false);
  
  private unsubscribe = new Subject<void>();
  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  fieldsOfStudyId: number;
  fieldsOfStudyCategory: FieldsOfStudyCategory[] = [];
  listFieldsOfStudys: FieldsOfStudy[] = [];
  allFieldsOfStudy: FieldsOfStudy[];
  isLoading =  true;
  errors: HttpErrorResponse;
  countFieldsOfStudy: number[];
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
    this.listFieldsOfStudies();
    this.countFieldsOfStudys();
    this.listFieldsOfStudyCategory();
    this.loadStatus();
    this.loadTableColumns();
  }
  
  countFieldsOfStudys(): any {
    this.loopbackService
    .countFieldsOfStudy()
    .subscribe((response) => {
      this.countFieldsOfStudy = response.count;
      this.cdr.detectChanges();
    });
  }

  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Megnevezés' },
      { field: 'fieldsOfStudyCategoryId', header: 'Tanulmányterület' },
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

  listFieldsOfStudies(): any {
    this.loopbackService
    .listFieldsOfStudies()
    .subscribe((response) => {
      console.log(response);
      this.listFieldsOfStudys = response;
      this.cdr.detectChanges();
    });
  }
  
  listFieldsOfStudyCategory(): any {
    this.loopbackService
    .listFieldsOfStudyCategories()
    .subscribe((response) => {
      console.log(response);
      this.fieldsOfStudyCategory = response;
      this.cdr.detectChanges();
    });
  }

  delete(fieldsOfStudyId: number): void {
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
              .deleteFieldsOfStudy(fieldsOfStudyId)
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
                this.listFieldsOfStudies();
              },
              (error: HttpErrorResponse) => {
                this.errors = error;
              });  
        }
      })
  }

  edit(fieldsOfStudyId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/${AppRoutes.FIELDS_OF_STUDY}/detail/${fieldsOfStudyId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
