import { LazyLoadEvent } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject, takeUntil, Observable, BehaviorSubject } from 'rxjs';
import { DATATABLE_SETTINGS } from 'src/app/constants';
import { Tag, TagCategory } from 'src/app/core/models/loopback.model';
import { AppRoutes } from 'src/app/shared/system/AppRoutes';
import Swal from 'sweetalert2';
import { LoopbackService } from '../../../core/services/loopback.service';

@Component({
  selector: 'app-dictionary-list',
  templateUrl: './dictionary-list.component.html',
  styleUrls: ['./dictionary-list.component.scss']
})


export class DictionaryListComponent implements OnInit, OnDestroy {

  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public loadingSubject$: Observable<boolean> =
    this.loadingSubject.asObservable();
  private unsubscribe = new Subject<void>();

  PAGE_SIZE = DATATABLE_SETTINGS.PAGE_SIZE;
  name: string;
  tagCategoryId: number;
  typesId: number;
  listTag: Tag[] = [];
  allTag: Tag[] = [];
  listTagCategory: any[] = [];
  listTagCategorie: any[] = [];
  selectedTagCategory: TagCategory;
  isLoading = true;
  loading: boolean;
  errors: HttpErrorResponse;
  countTag: number[];
  searchTerm: string;
  page: number = 1;
  collectionSize: number;
  tagCategory: any;
  types: any[] = [];
  cols: any[];
  listActive: any[] = [];
  showFrontend: any[] = [];
  totalRecords: number;

  constructor(
    private cdr: ChangeDetectorRef,
    private loopbackService: LoopbackService,
    private router: Router,
    private toastService: HotToastService,
    private route: ActivatedRoute,
  ) {
    this.loadingSubject.next(true);
  }

  ngOnInit(): void {
    this.listTagCategories();
    this.listTags();
    this.countTags();
    this.loadTypes();
    this.loadStatus();
    this.loadTableColumns();
    this.showFrontends();

    this.loading = false;
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

  showFrontends() {
    const show = 
    {id: 0, name: 'igen', value: 1};
    const notShow = 
    { id: 1, name: 'nem', value: 0};

    this.showFrontend.push(show);
    this.showFrontend.push(notShow);
    this.loadingSubject.next(false);
  }

  loadTypes() {
    const firstType = {
      id: 10,
      name: 'Minddiák',
      value: 10,
    };

    const secondType = {
      id: 20,
      name: 'Humáncentrum',
      value: 20,
    }

    this.types.push(firstType);
    this.types.push(secondType);
    this.loadingSubject.next(false);
  }
  
  loadTableColumns(): any {
    this.cols = [
      { field: 'name', header: 'Név' },
      { field: 'tagCategoryId', header: 'Kategória' },
      { field: 'type', header: 'Típus' },
      { field: 'isActive', header: '' },
      { field: 'showFrontend', header: '' },
      { field: 'actions', header: 'Műveletek' }        
    ];
  }

  countTags(): any {
    this.loopbackService
      .listTagsCount()
      .subscribe((response) => {
        this.countTag = response.count
        this.cdr.detectChanges();
      });
  }

  listTagCategories(): any {
    this.loopbackService
      .listTagCategories()
      .subscribe(response => {
        this.listTagCategory = response;
        this.listTagCategorie.push(response);
        this.loadingSubject.next(false);
        this.cdr.detectChanges();
      });
  }

  listTags(): any {
      this.loopbackService
        .listTags(this.tagCategoryId)
        .subscribe((response) => {
          this.listTag = response;
          this.listTag.push(response);
          this.loadingSubject.next(false);
          this.cdr.detectChanges();
        });
  }
  
  nextPage(event: LazyLoadEvent) {
      console.log(event);

      const filter = {
        skip: event.first,
        limit: event.rows,
        where: event.filters
      }

      console.log(filter);
      setTimeout(() => {
        this.loopbackService
        .listTags(this.tagCategoryId)
        .subscribe((response) => {
          this.listTag = response;
          this.totalRecords = response.length;
          this.loadingSubject.next(false);
        });
      }, 100)

  }

  delete(tagCategoryId: number): void {
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
          .deleteTag(tagCategoryId)
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
              this.listTags();
            },
            (error: HttpErrorResponse) => {
              this.errors = error;
            });
      }
    })
  }

  edit(tagCategoryId: number): void {
    this.router
      .navigateByUrl(`${AppRoutes.DICTIONARY}/detail/${tagCategoryId}`)
      .then();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
